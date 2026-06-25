# Security Guide

## Authentication

- Uses Supabase Auth with secure session management
- `getUser()` (not `getSession()`) used server-side — validates token server-to-server
- Middleware enforces authentication on all protected routes
- Auth callback at `/auth/callback` handles OAuth and magic link flows

## Authorization

- Row-Level Security (RLS) enabled on all Supabase tables
- `analyses`: users can only select/insert/update/delete their own rows (`user_id = auth.uid()`)
- `profiles`: users can only read/update their own profile
- API routes enforce `user_id` at the query level as defence-in-depth

## API Security

### Rate Limiting

- `/api/analyze`: 5 requests per user per 10 minutes
- Returns `429 Too Many Requests` with `Retry-After` header
- Implementation: in-memory sliding window (`lib/rate-limit.ts`)
- **Upgrade path**: Replace with Upstash Redis for multi-instance deployments

### Input Validation

- All API routes validate with Zod before processing
- Request body size capped at 512 KB to prevent payload abuse
- String fields have max-length constraints in Zod schemas

### Secrets Management

- `ANTHROPIC_API_KEY` is server-only (no `NEXT_PUBLIC_` prefix)
- Never exposed to client-side bundles
- Verified at startup via `lib/env.ts`

## Security Headers

Applied to all routes via `next.config.ts`:

| Header                      | Value                                          | Purpose                |
| --------------------------- | ---------------------------------------------- | ---------------------- |
| `X-Frame-Options`           | `DENY`                                         | Prevent clickjacking   |
| `X-Content-Type-Options`    | `nosniff`                                      | Prevent MIME sniffing  |
| `Referrer-Policy`           | `strict-origin-when-cross-origin`              | Limit referrer leakage |
| `Permissions-Policy`        | `camera=(), microphone=(), geolocation=()`     | Restrict browser APIs  |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Enforce HTTPS          |
| `Content-Security-Policy`   | See below                                      | Prevent XSS            |
| `poweredByHeader`           | disabled                                       | Don't reveal framework |

### Content Security Policy

- `default-src 'self'` — only same-origin by default
- `connect-src` allows Supabase and Anthropic API
- `script-src 'unsafe-eval'` only in development (HMR)
- `frame-ancestors 'none'` — no framing allowed

## Known Limitations & Future Work

1. **Rate limiting is in-memory** — resets per Vercel function instance. Upgrade to Redis for
   distributed rate limiting before scaling beyond single-region.

2. **No CAPTCHA** — signup form has no CAPTCHA. Add Cloudflare Turnstile or hCaptcha to
   prevent bot signups at scale.

3. **No API key rotation procedure** — document a runbook for rotating `ANTHROPIC_API_KEY`
   without downtime.

4. **No WAF** — consider Cloudflare in front of Vercel for DDoS protection at scale.

5. **CSP `unsafe-inline` for styles** — required by Tailwind CSS. Consider hash-based CSP
   for stricter inline style control in a future sprint.
