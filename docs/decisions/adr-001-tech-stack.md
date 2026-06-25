# ADR-001: Technology Stack Selection

**Date:** 2024  
**Status:** Accepted

## Context

We needed to choose a technology stack for UpIQ — an AI-powered web application with a real-time frontend, an API backend, an AI pipeline, and a database. The primary constraints were:

- Small founding team (1–2 engineers)
- Fast time-to-market
- AI-first feature set requiring tight Claude API integration
- Monorepo preferred to share types and utilities across apps
- Preference for TypeScript end-to-end

## Decision

We adopted the following stack:

| Layer | Choice |
|---|---|
| Frontend | Next.js 15 (App Router) |
| UI components | shadcn/ui + Tailwind CSS |
| Backend API | Hono on Node.js |
| AI | Anthropic Claude API |
| Database | Supabase (PostgreSQL + pgvector) |
| Auth | Supabase Auth |
| Monorepo | Turborepo + pnpm workspaces |
| Hosting | Vercel (web) + Railway (API) |

## Rationale

### Next.js 15

- App Router with React Server Components enables streaming AI responses directly in the page, reducing client-side complexity.
- Built-in route handlers eliminate the need for a BFF (backend for frontend).
- First-class Vercel deployment support means zero infrastructure configuration for the frontend.

### Hono

- Minimal and fast Node.js framework with excellent TypeScript support.
- `zod-validator` middleware integrates cleanly with our Zod schemas for end-to-end type safety.
- Easier to test than Express; more lightweight than NestJS for our scale.

### Anthropic Claude API

- Claude's instruction-following accuracy and long-context handling make it the best choice for complex profile analysis and proposal rewriting.
- `claude-opus-4-8` for quality-critical tasks; `claude-haiku-4-5` for high-volume, cost-sensitive tasks.
- JSON mode enforces structured output, making prompt outputs reliably parseable.

### Supabase

- Managed PostgreSQL with a generous free tier.
- Built-in auth with JWT that integrates directly with our API middleware.
- Row-level security (RLS) enforces data isolation at the database level — a strong privacy guarantee.
- pgvector extension enables semantic search on analysis embeddings without a separate vector DB.

### Turborepo

- Zero-overhead monorepo orchestration.
- Remote caching speeds up CI significantly for a large repo.
- Task graph ensures packages build in the correct order.

## Alternatives Considered

| Alternative | Reason not chosen |
|---|---|
| Express | More boilerplate, weaker TypeScript story than Hono |
| NestJS | Too heavy for our scale; slower iteration speed |
| Prisma | Adds ORM complexity; Supabase JS client is sufficient |
| Pinecone | Separate vector DB cost and latency not justified when pgvector covers our needs |
| OpenAI | Claude outperforms on instruction-following benchmarks for our use case |
| Nx | More complex configuration than Turborepo for our team size |

## Consequences

- The team must be proficient in TypeScript and React Server Components.
- All AI costs are billed through the Anthropic console — cost monitoring is required from day one.
- Supabase free tier limits apply in early development; upgrade path is straightforward.
