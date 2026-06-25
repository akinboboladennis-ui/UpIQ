# Contributing

Thank you for contributing to UpIQ. This guide covers everything you need to submit good work.

## Branching Strategy

We use **trunk-based development** with short-lived feature branches.

| Branch | Purpose |
|---|---|
| `main` | Production-ready code. Protected. |
| `develop` | Integration branch. PRs merge here. |
| `feat/<slug>` | New features |
| `fix/<slug>` | Bug fixes |
| `docs/<slug>` | Documentation only |
| `chore/<slug>` | Tooling, deps, config |

**Branch from `develop`, merge to `develop`.**

```bash
git checkout develop
git pull origin develop
git checkout -b feat/proposal-score-breakdown
```

## Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/).

```
<type>(<scope>): <short description>

[optional body]

[optional footer]
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Examples:**
```
feat(proposals): add per-dimension score breakdown UI
fix(api): handle empty profile data from Upwork sync
docs(ai-pipeline): clarify model selection rationale
```

## Pull Request Process

1. Open a PR against `develop` (not `main`).
2. Fill out the PR template completely.
3. Ensure CI passes (lint, typecheck, tests, build).
4. Request a review from at least one maintainer.
5. Squash-merge after approval.

## Code Style

- TypeScript strict mode is enabled everywhere.
- ESLint and Prettier run on pre-commit via lint-staged.
- No `any` types. Use `unknown` + type guards if the shape is truly unknown.
- No inline comments explaining *what* code does. Only comment the *why* when it's non-obvious.

## Testing

- Unit tests go next to the file they test: `foo.ts` → `foo.test.ts`.
- Write tests for service layer functions and AI prompt builders.
- UI component tests use React Testing Library.
- Do not test implementation details — test behavior.

## AI Prompt Changes

Changes to prompts in `packages/ai/prompts/` must include:
- A before/after comparison of example outputs in the PR description.
- An update to the corresponding Zod output schema if the shape changes.
- A note on which model was used for testing.
