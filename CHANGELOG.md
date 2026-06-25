# Changelog

All notable changes to UpIQ are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased] — Sprint Polaris

### Added

- Centralized structured logger (`lib/logger.ts`) — JSON in production, readable in dev
- Environment variable validation (`lib/env.ts`) — startup assertions with clear error messages
- Feature flag system (`lib/feature-flags.ts`) — env-backed toggles for upcoming modules
- Monitoring abstractions (`lib/monitoring.ts`) — Sentry and PostHog placeholders
- In-memory rate limiter (`lib/rate-limit.ts`) — sliding window, per-user
- Security headers in `next.config.ts` — CSP, HSTS, X-Frame-Options, no-sniff
- Global error page (`app/error.tsx`) — with error ID and retry/home actions
- 404 page (`app/not-found.tsx`) — with navigation links
- React `ErrorBoundary` component — class-based, forwards errors to monitoring
- 7 new test files — grading utils, rate limiter, feature flags, env validation, store logic
- Coverage configuration in `vitest.config.ts` — 60% thresholds enforced
- Dependency audit step in CI pipeline

### Changed

- `/api/analyze` — added rate limiting (5 req/10 min per user), request size limit (512 KB),
  structured logging, monitoring capture for errors
- `.env.example` — added `ANTHROPIC_API_KEY`, Sentry DSN, PostHog key, feature flag vars
- CI workflow — coverage reports uploaded as artifacts, Node pinned to 20, stub env vars
- `poweredByHeader: false` in Next.js config

### Security

- Added Content Security Policy header
- Added `X-Frame-Options: DENY` to prevent clickjacking
- Added `Strict-Transport-Security` for HTTPS enforcement
- Rate limiting on AI endpoint prevents cost abuse

---

## [0.5.0] — Sprint Nexus

### Added

- Intelligence Report page (`/report/[id]`) — 8 sections with full analysis display
- Analysis History page (`/history`) — search, sort, favorites filtering
- Report components: ExecutiveSummary, ScoreDashboard, SectionBreakdown,
  RecommendationCenter, KeywordIntelligence, CareerSummary, ImprovementTimeline,
  ReportHeader, ReportFooter, HistoryCard, HistoryWorkspace
- `reportStore` Zustand store — persisted history, filters, recommendation completion
- API routes: `GET/PATCH/DELETE /api/analyses/[id]`, `GET /api/analyses`
- Supabase migration `003_reports.sql` — title, is_favorite, completed_recommendations
- Sidebar History link enabled
- Redirect to `/report/[id]` after successful analysis

---

## [0.4.0] — Sprint Oracle

### Added

- Provider-agnostic `AIService` with `ClaudeProvider` and `OpenAIProvider` stubs
- `PromptManager` — structured profile analysis prompts (v1.0)
- `JSONValidator` — robust JSON parsing with recovery for malformed AI output
- `ScoringEngine` — hybrid scoring: AI dimensions blended with deterministic completeness
- `RecommendationEngine` — priority ranking and deduplication
- `RetryManager` — exponential backoff with jitter (3 retries, 500ms → 8s)
- `ErrorHandler` — maps provider errors to user-facing messages
- `POST /api/analyze` — authenticated, validated, AI-powered analysis endpoint
- Supabase migration `002_analyses.sql` — analyses table with RLS
- 22 Vitest unit tests for AI engine

---

## [0.3.0] — Sprint Insight

### Added

- Profile Analyzer two-panel workspace (`/profile-analyzer`)
- 11 profile sections with form validation
- Auto-save with Zustand persistence
- Paste-from-LinkedIn import dialog
- `profileAnalyzerStore` — full draft + analysis lifecycle state

---

## [0.2.0] — Sprint Horizon

### Added

- Authenticated dashboard (`/dashboard`)
- Collapsible sidebar navigation with animations
- Top navigation bar with user avatar
- Mobile navigation drawer
- Theme provider (dark mode)

---

## [0.1.0] — Sprint Atlas

### Added

- Turborepo + pnpm monorepo foundation
- Next.js 15 App Router with route groups
- Supabase authentication (login, signup, password reset)
- Supabase SSR integration
- `packages/shared` — shared TypeScript types and Zod schemas
- Initial database migration `001_initial_schema.sql`
- CI/CD pipeline with GitHub Actions
