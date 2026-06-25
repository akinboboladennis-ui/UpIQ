# Getting Started

This guide walks you through setting up UpIQ for local development.

## Prerequisites

| Tool | Version | Install |
|---|---|---|
| Node.js | 20 LTS | [nodejs.org](https://nodejs.org) |
| pnpm | 9+ | `npm install -g pnpm` |
| Git | any | [git-scm.com](https://git-scm.com) |

You will also need accounts for:
- [Supabase](https://supabase.com) — create a free project
- [Anthropic](https://console.anthropic.com) — get an API key

## 1. Clone the Repository

```bash
git clone https://github.com/akinboboladennis-ui/upiq.git
cd upiq
```

## 2. Install Dependencies

```bash
pnpm install
```

## 3. Set Up Supabase

1. Create a new project in the Supabase dashboard.
2. In **Project Settings → API**, copy:
   - Project URL
   - Anon public key
   - Service role key (keep this secret)
3. Run the database migrations (once the `scripts/` folder is populated):
   ```bash
   pnpm db:migrate
   ```

## 4. Configure Environment Variables

**Web app:**
```bash
cp apps/web/.env.example apps/web/.env.local
```

Fill in `apps/web/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-project-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

**Backend API:**
```bash
cp apps/api/.env.example apps/api/.env
```

Fill in `apps/api/.env`:
```
SUPABASE_URL=<your-supabase-project-url>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
ANTHROPIC_API_KEY=<your-anthropic-api-key>
PORT=3001
```

## 5. Start Development Servers

```bash
pnpm dev
```

This starts all apps in parallel via Turborepo:
- Web app: `http://localhost:3000`
- API: `http://localhost:3001`

## Available Scripts

| Script | Description |
|---|---|
| `pnpm dev` | Start all apps in dev mode |
| `pnpm build` | Build all apps |
| `pnpm lint` | Lint all packages |
| `pnpm typecheck` | Run TypeScript checks |
| `pnpm test` | Run all tests |
| `pnpm db:migrate` | Run database migrations |

## Troubleshooting

**Port already in use:** Change the `PORT` in `apps/api/.env` and `NEXT_PUBLIC_API_URL` in `apps/web/.env.local` to match.

**pnpm install fails:** Ensure Node.js 20 is active (`node -v`). Use [nvm](https://github.com/nvm-sh/nvm) or [fnm](https://github.com/Schniz/fnm) to switch versions.
