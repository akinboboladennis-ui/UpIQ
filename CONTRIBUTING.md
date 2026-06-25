# Contributing to UpIQ

## Prerequisites

- Node.js 20+
- pnpm 9+
- A Supabase project (free tier works)
- An Anthropic API key

## Setup

```bash
git clone https://github.com/akinboboladennis-ui/upiq.git
cd upiq
pnpm install
cp apps/web/.env.example apps/web/.env.local
# Fill in .env.local with your credentials
pnpm dev
```

App runs at http://localhost:3000.

## Branch Conventions

| Prefix   | Purpose            |
| -------- | ------------------ |
| `feat/`  | New features       |
| `fix/`   | Bug fixes          |
| `chore/` | Tooling, deps, CI  |
| `docs/`  | Documentation only |
| `test/`  | Tests only         |

## Commit Messages

Follow Conventional Commits: `type(scope): description`

Examples:

- `feat(analyzer): add paste import dialog`
- `fix(auth): handle expired session redirect`
- `chore(ci): add dependency audit step`

## Development Workflow

1. Create a branch from `develop`
2. Write code with tests
3. `pnpm lint && pnpm typecheck && pnpm test` — all must pass
4. Push and open a PR against `develop`
5. CI runs automatically; merge requires all checks green

## Running Tests

```bash
pnpm test              # run all tests
pnpm test --watch      # watch mode
pnpm test --coverage   # with coverage report
```

Coverage thresholds are enforced — new code needs tests.

## Adding Feature Flags

1. Add the flag name to `FeatureFlag` type in `lib/feature-flags.ts`
2. Add a default value in `DEFAULTS`
3. Add the env var key in `ENV_KEYS`
4. Add the env var to `.env.example`

## Database Migrations

Migrations live in `supabase/migrations/`. Name them `NNN_description.sql`.
Run against your local Supabase project using the Supabase CLI.
