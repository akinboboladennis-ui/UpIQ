# Deployment

UpIQ uses a split deployment: the **web app** deploys to Vercel, the **API** deploys to Railway.

## Environments

| Environment | Branch | Web URL | API URL |
|---|---|---|---|
| Production | `main` | `https://upiq.app` | `https://api.upiq.app` |
| Preview | PR branches | Vercel preview URL | N/A |

## CI/CD

Deployments are automated via GitHub Actions (see `.github/workflows/deploy.yml`).

- Push to `main` → triggers the deploy workflow.
- CI must pass before deploy runs.
- Deployments are non-concurrent (one at a time).

## Web App (Vercel)

The `apps/web` package is deployed as a Vercel project.

**Required secrets in GitHub:**
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

**Required environment variables in Vercel project settings:**
```
NEXT_PUBLIC_API_URL=https://api.upiq.app
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## API (Railway)

The `apps/api` package is deployed as a Railway service.

**Required secrets in GitHub:**
- `RAILWAY_TOKEN`

**Required environment variables in Railway service settings:**
```
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
PORT=3001
```

## Database (Supabase)

Supabase manages the database and auth. Migrations must be run manually on the production project before deploying API changes that depend on schema changes.

```bash
# Connect to production Supabase and run migrations
pnpm db:migrate --env production
```

## Rollback

**Web:** Roll back via the Vercel dashboard → Deployments → select previous → Promote.

**API:** Roll back via the Railway dashboard → Deployments → select previous → Rollback.
