# Coding Standards — UpIQ

## Source of Truth

These standards are non-optional. They exist because consistency dramatically reduces the cognitive overhead of navigating a codebase and reviewing code. When in doubt, match the existing patterns.

---

## Project Structure

```
UpIQ/
├── apps/
│   ├── web/                       # Next.js 15 frontend
│   │   ├── app/                   # App Router pages and layouts
│   │   ├── components/            # App-specific components
│   │   ├── lib/                   # App-specific utilities
│   │   ├── hooks/                 # App-specific hooks
│   │   └── stores/                # Zustand stores
│   └── api/                       # Hono backend
│       └── src/
│           ├── routes/            # Route handlers
│           ├── services/          # Business logic
│           ├── middleware/        # Hono middleware
│           └── lib/               # Utilities
├── packages/
│   ├── ui/                        # Shared React component library
│   │   ├── src/
│   │   │   ├── components/        # Components
│   │   │   ├── hooks/             # Shared hooks
│   │   │   └── index.ts           # Barrel export
│   │   └── package.json
│   ├── ai/                        # AI pipeline
│   │   ├── src/
│   │   │   ├── analyzers/         # Feature-specific analysis modules
│   │   │   ├── learning/          # Learning engine and providers
│   │   │   ├── scoring/           # Scoring engine
│   │   │   ├── prompts/           # Prompt loading utilities
│   │   │   └── client.ts          # API client singletons
│   │   └── package.json
│   └── shared/                    # Shared types and utilities
│       ├── src/
│       │   ├── types/             # TypeScript interfaces and types
│       │   ├── schemas/           # Zod schemas
│       │   ├── constants/         # Shared constants
│       │   └── utils/             # Pure utility functions
│       └── package.json
└── docs/                          # This documentation
```

---

## Naming Conventions

### Files

| Type | Convention | Example |
|---|---|---|
| React component | PascalCase | `ScoreRing.tsx` |
| Hook | camelCase, `use` prefix | `useAnalysis.ts` |
| Utility | camelCase | `formatScore.ts` |
| Zod schema | camelCase, `Schema` suffix | `analysisSchema.ts` |
| Types file | camelCase | `analysis.types.ts` |
| Test file | same as source, `.test.ts` suffix | `formatScore.test.ts` |
| Route handler | camelCase | `profiles.ts` |
| Service | camelCase, `.service.ts` suffix | `profile.service.ts` |

### Identifiers

| Kind | Convention | Example |
|---|---|---|
| Variables | camelCase | `overallScore` |
| Functions | camelCase | `analyzeProfile` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_ANALYSES_PER_DAY` |
| Types/Interfaces | PascalCase | `ProfileAnalysis` |
| Zod schemas | camelCase, `Schema` suffix | `profileAnalysisSchema` |
| React components | PascalCase | `RecommendationCard` |
| Enums | PascalCase | `AnalysisType` |
| Enum values | PascalCase | `AnalysisType.Profile` |

### CSS / Tailwind

- Tailwind utility classes only. No custom CSS unless adding a new design token.
- Design tokens are defined in `tailwind.config.ts` and map to the CSS custom properties in `ui_design.md`.
- Class order: layout → sizing → spacing → typography → color → effects → interactivity.

---

## TypeScript Rules

### `tsconfig.json` flags (non-negotiable)

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### Rules

- **No `any`.** Use `unknown` and narrow with type guards. If you must accept dynamic input, document why.
- **No type assertions (`as`)** unless the type system genuinely cannot infer what you know to be true. Add a comment explaining the invariant.
- **Zod for external data.** Any data entering the system from outside (API requests, AI responses, database reads) must be validated with a Zod schema before use.
- **Prefer `type` over `interface`** for object shapes that will not be extended via `extends`. Use `interface` for extension-points (service interfaces, provider interfaces).
- **Export types that cross module boundaries.** If a type is used in more than one file, it lives in `packages/shared`.
- **Return types on public functions.** All exported functions have explicit return types annotated.

---

## Clean Architecture

The codebase follows a layered architecture. Dependencies only flow inward.

```
Presentation (components, pages)
  ↓
Application (hooks, service calls, stores)
  ↓
Domain (services, business logic)
  ↓
Infrastructure (DB, external APIs, AI pipeline)
```

**Rules:**
- Presentation components never call `supabase` directly. They call hooks or server actions.
- Services never import from the route layer.
- The AI pipeline (`packages/ai`) never imports from `apps/api` or `apps/web`.
- `packages/shared` has zero dependencies on any other internal package.

---

## Testing

### Philosophy

Tests verify **behavior**, not implementation. If a refactor that doesn't change behavior breaks a test, the test is wrong.

### What to test

| Code | Test type | Location |
|---|---|---|
| Pure utility functions | Unit test | Co-located: `util.test.ts` |
| Service layer functions | Unit test with mocked DB | Co-located: `service.test.ts` |
| AI analyzer functions | Unit test with mocked Claude | Co-located: `analyzer.test.ts` |
| API routes | Integration test (real DB, mocked AI) | `apps/api/src/routes/__tests__/` |
| React components | Component test (React Testing Library) | Co-located: `Component.test.tsx` |
| User flows | E2E test (Playwright) | `apps/web/e2e/` |

### What not to test

- Tailwind class names
- Database migrations (test in staging)
- Third-party library internals

### Coverage

The CI pipeline fails if unit test coverage drops below 70% for the `packages/` directory. Coverage is measured by branch coverage, not line coverage.

### Prompt golden-set tests

Every prompt in the library has a golden-set test: a fixed input with a known-valid output structure. These tests call the real Claude API in CI using a test key with strict rate limits. They run in a separate `test:prompts` CI job.

---

## Error Handling

- **Never swallow errors silently.** Either handle the error meaningfully or let it propagate.
- **Use typed errors.** Define error classes or discriminated union types; don't pass strings.
- **Log errors with context.** Every caught error must be logged with the user ID, route, and relevant input identifiers (never full request bodies — those may contain sensitive data).
- **API errors use the standard envelope.** See `api_spec.md`. No custom error shapes anywhere in the API.

```typescript
// Good
class AnalysisError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly retryable: boolean,
  ) {
    super(message);
    this.name = 'AnalysisError';
  }
}

// Bad
throw new Error('something went wrong');
```

---

## Comments

Write no comments. The code should be self-explanatory through well-named identifiers and clean structure.

The only acceptable comments:

1. **Non-obvious WHY:** A business rule, an external constraint, or a known bug workaround that would surprise a reader.
2. **Prompt template notes:** `<!--notes-->` blocks in prompt templates explaining design intent and failure modes.
3. **TODO with owner:** `// TODO(username): description` — never `// TODO:` without an owner.

Never write comments that describe WHAT code does. If the code needs a comment to explain what it does, refactor it.

---

## Git Workflow

### Branch model

See `docs/guides/contributing.md`. Summary:
- Branch from `develop`
- Merge to `develop` via PR
- `main` is always deployable; only updated via `develop` after validation

### Commit messages

We follow [Conventional Commits](https://www.conventionalcommits.org/).

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**

| Type | When to use |
|---|---|
| `feat` | New feature or capability |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `refactor` | Code change that is not a feat or fix |
| `test` | Adding or updating tests |
| `chore` | Build, CI, tooling, dependencies |
| `perf` | Performance improvement |
| `style` | Formatting, whitespace (not CSS) |

**Scope examples:** `profile`, `proposals`, `scoring`, `ai`, `db`, `api`, `web`, `ui`

**Rules:**
- Description in imperative mood: "add" not "added" or "adds"
- No period at end of description
- Body wraps at 72 characters
- Breaking changes noted in footer: `BREAKING CHANGE: <description>`

### Pre-commit hooks

Husky runs on every commit:
1. ESLint (fails on any error)
2. Prettier (auto-formats)
3. TypeScript type check (fails on any error)
4. `pnpm test` (fails if any test fails)

If a hook fails, fix the issue. Never bypass with `--no-verify`.

---

## Linting and Formatting

- **ESLint:** Extends `next/core-web-vitals`, `@typescript-eslint/recommended-strict`. No unused variables, no explicit `any`, no non-null assertions.
- **Prettier:** 2-space indent, single quotes, trailing commas (ES5), 100-character print width.
- **Runs:** On save in VS Code (via `.vscode/settings.json`), on pre-commit, and in CI.

---

## Environment Variables

- All environment variables are documented in `.env.example` for every app.
- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. Never put secrets in these.
- Variables are validated at startup using Zod. The app crashes on boot if a required variable is missing. This prevents silent misconfiguration in production.

```typescript
// apps/api/src/lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  ANTHROPIC_API_KEY: z.string().min(1),
  PORT: z.coerce.number().default(3001),
});

export const env = envSchema.parse(process.env);
```

---

## Dependency Policy

- **Add dependencies deliberately.** Every new dependency must be justified. Can the feature be implemented with what we already have?
- **Prefer native APIs** when the browser or Node support is sufficient.
- **Lock versions** in `package.json` (exact versions, not ranges) for production dependencies. Ranges are acceptable for dev dependencies.
- **Audit on addition:** Run `pnpm audit` after adding any dependency. Block on high or critical severity.
- **No dependencies in `packages/shared`** beyond TypeScript and Zod. This package must stay lean.
