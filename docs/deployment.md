# Deployment Guide

## Prerequisites

- Vercel account
- Supabase project (free tier or pro)
- Anthropic API key

## Environment Variables

All required variables are listed in `apps/web/.env.example`.

Copy it locally:

```bash
cp apps/web/.env.example apps/web/.env.local
```

In Vercel, set the same variables in **Project Settings → Environment Variables**.

| Variable                        | Required | Where to get it           |
| ------------------------------- | -------- | ------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | ✅       | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅       | Supabase → Settings → API |
| `NEXT_PUBLIC_SITE_URL`          | ✅       | Your Vercel project URL   |
| `ANTHROPIC_API_KEY`             | ✅       | console.anthropic.com     |
| `NEXT_PUBLIC_SENTRY_DSN`        | optional | sentry.io                 |
| `NEXT_PUBLIC_POSTHOG_KEY`       | optional | posthog.com               |

## Database Setup

1. Create a Supabase project
2. Run migrations in order:

   ```bash
   # Using Supabase CLI
   supabase db push
   ```

   Or manually in the SQL editor:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_analyses.sql`
   - `supabase/migrations/003_reports.sql`

3. Verify RLS is enabled on all tables

## Deploy to Vercel

### Via Dashboard

1. Import the repository from GitHub
2. Set `apps/web` as the root directory
3. Add environment variables
4. Deploy

### Via CLI

```bash
pnpm vercel --prod
```

Set required secrets in GitHub for automated deploys:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## Supabase Auth Configuration

In your Supabase project:

1. **Authentication → URL Configuration**
   - Site URL: `https://your-domain.vercel.app`
   - Redirect URLs: `https://your-domain.vercel.app/auth/callback`

2. **Authentication → Email Templates**
   - Update templates to reference your domain

## Production Checklist

- [ ] All required env vars set in Vercel
- [ ] Supabase migrations applied
- [ ] Auth redirect URLs configured
- [ ] RLS verified on all tables
- [ ] Test sign up → analysis → report flow end-to-end
- [ ] Verify ANTHROPIC*API_KEY is NOT in client bundle (`NEXT_PUBLIC*` prefix)
- [ ] Rate limiting working (try 6+ analyses in 10 min)

## Rollback

Vercel keeps all previous deployments. To roll back:

1. Vercel dashboard → Deployments
2. Select previous deployment → Promote to Production

Or via CLI:

```bash
vercel rollback
```
