# System Architecture — UpIQ

## Architecture Philosophy

UpIQ is designed around three guiding constraints:

1. **Separation of intelligence from infrastructure.** AI pipeline logic is a distinct layer that can evolve independently of the API or frontend.
2. **Data as a first-class citizen.** Every piece of data has a defined schema, a clear owner, and a defined lifespan.
3. **Incremental complexity.** The architecture supports the MVP with minimal moving parts, then grows into more complex components only when the data and usage patterns justify it.

---

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Browser (Next.js 15)                         │
│   Server Components (RSC) + Client Islands + Streaming Suspense     │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │ HTTPS
                    ┌─────────────▼──────────────┐
                    │      Next.js API Routes     │
                    │  (thin proxy + auth check)  │
                    └─────────────┬──────────────┘
                                  │ HTTP (internal)
┌─────────────────────────────────▼───────────────────────────────────┐
│                         Backend API (Hono)                          │
│                          apps/api — Port 3001                       │
│                                                                     │
│  ┌──────────────┐  ┌───────────────┐  ┌────────────────────────┐   │
│  │ Auth Middle  │  │  Route Layer   │  │    Service Layer       │   │
│  │ (JWT verify) │  │ (Zod validate) │  │  (business logic)     │   │
│  └──────────────┘  └───────────────┘  └────────────┬───────────┘   │
└───────────────────────────────────────────────────┬─┘               │
                                                    │                  │
              ┌─────────────────────────────────────┼──────────────┐  │
              │                                     │              │  │
┌─────────────▼────────────┐   ┌────────────────────▼──┐  ┌───────▼──┴────────────┐
│     AI Pipeline           │   │   Recommendation       │  │   Persistence Layer   │
│     (packages/ai)         │   │   Engine               │  │   (Supabase)          │
│                           │   │   (packages/ai)        │  │                       │
│  ┌─────────────────────┐  │   │                        │  │  PostgreSQL + pgvector│
│  │ Profile Analyzer    │  │   │  Aggregates signals    │  │  Row-Level Security   │
│  │ Proposal Optimizer  │  │   │  from all providers    │  │  Realtime             │
│  │ Market Extractor    │  │   │  into ranked recs      │  │  Auth                 │
│  │ Positioning Engine  │  │   │                        │  │                       │
│  └─────────────────────┘  │   └────────────────────────┘  └───────────────────────┘
│                           │
│  ┌─────────────────────┐  │
│  │  Claude API         │  │
│  │  OpenAI API         │  │         ┌──────────────────────────────────┐
│  └─────────────────────┘  │         │   Learning Engine                │
│                           │◄────────│   (packages/ai/learning)         │
│  ┌─────────────────────┐  │         │                                  │
│  │  Scoring Engine     │  │         │  ProposalProvider                │
│  └─────────────────────┘  │         │  MarketProvider                  │
└───────────────────────────┘         │  CommunityProvider               │
                                      │  ResultsProvider                 │
                                      │  ProfileProvider                 │
                                      └──────────────────────────────────┘
                                                      ▲
                                      ┌───────────────┴──────────────────┐
                                      │   Data Providers (External)       │
                                      │   Upwork MCP / API               │
                                      │   Public job feeds               │
                                      │   Community signals              │
                                      └──────────────────────────────────┘
```

---

## Component Responsibilities

### 1. Frontend — `apps/web`

**Technology:** Next.js 15 (App Router), React 19, Tailwind CSS 4, shadcn/ui

**Responsibilities:**
- Render the user interface (dashboard, analysis results, proposals, market data)
- Authenticate users via Supabase Auth
- Stream AI-generated content using React Suspense + Next.js streaming
- Proxy requests to the backend API from server-side route handlers (preventing CORS issues and hiding the API URL)
- Handle optimistic UI updates for user actions

**What it does NOT do:**
- Call the Anthropic or OpenAI APIs directly
- Access the database directly
- Run business logic

**Communication:**
- To backend API: HTTP over internal network (server-to-server) or via `fetch` from the client with auth headers
- To Supabase: Auth only (client SDK); data goes through the API, not directly from the browser

---

### 2. Backend API — `apps/api`

**Technology:** Hono, Node.js 20, Zod, Supabase JS

**Responsibilities:**
- Validate and authenticate all incoming requests
- Route requests to the appropriate service
- Orchestrate calls between the AI pipeline, learning engine, and persistence layer
- Return structured, typed responses
- Enforce rate limits

**What it does NOT do:**
- Render UI
- Store data in memory (stateless)
- Build prompts or call AI APIs directly (delegates to `packages/ai`)

**Communication:**
- Receives: HTTP from Next.js (server-side) or optionally from clients
- Calls: `packages/ai` (in-process), Supabase JS client (database), external data providers

---

### 3. AI Services — `packages/ai`

**Technology:** Anthropic Claude API (`@anthropic-ai/sdk`), OpenAI API (embeddings), Zod

**Responsibilities:**
- Define all prompt templates (externally stored, versioned)
- Build and execute Claude API calls for each analysis feature
- Parse and validate AI responses with Zod schemas
- Generate embeddings via OpenAI `text-embedding-3-small`
- Implement retry logic, caching, and error handling for AI calls

**Sub-modules:**

| Module | Responsibility |
|---|---|
| `analyzers/profile.ts` | Profile dimension scoring and recommendation generation |
| `analyzers/proposal.ts` | Proposal scoring and rewriting |
| `analyzers/market.ts` | Batch market signal extraction |
| `analyzers/positioning.ts` | Competitive differentiation analysis |
| `prompts/` | Externalized prompt templates |
| `scoring/` | Scoring engine integration (deterministic + AI blend) |
| `learning/` | Learning engine and provider implementations |
| `client.ts` | Claude and OpenAI client singletons with retry logic |

**Communication:**
- Called by: `apps/api` service layer (in-process import)
- Calls: Anthropic API (HTTPS), OpenAI API (HTTPS)
- Reads from: `packages/shared` (types, schemas)

---

### 4. Recommendation Engine — `packages/ai/recommendation`

**Technology:** TypeScript, Zod

**Responsibilities:**
- Consume normalized output from all Learning Engine providers
- Merge, deduplicate, and rank signals into a unified recommendation set
- Apply user context (category, experience level, current scores) to personalize ranking
- Return a typed `RecommendationSet` consumed by the API

**Communication:**
- Receives: normalized `LearningSignal[]` from all providers
- Calls: Claude (for ranking and synthesis if signal count is large)
- Returns: `RecommendationSet` to the API service layer

---

### 5. Scoring Engine — `packages/ai/scoring`

**Technology:** TypeScript, Zod, Claude API (for AI sub-scores)

**Responsibilities:**
- Compute deterministic rule-based sub-scores (profile completeness, keyword coverage, etc.)
- Invoke Claude for AI-evaluated sub-scores (clarity, positioning, trust signals)
- Blend scores using defined weights per dimension
- Return fully explainable score objects with evidence

See `scoring_engine.md` for full specification.

---

### 6. Learning Engine — `packages/ai/learning`

**Technology:** TypeScript, provider interface pattern

**Responsibilities:**
- Define the `LearningProvider` interface
- Implement all data source providers
- Normalize heterogeneous data into a common `LearningSignal` format
- Feed normalized signals to the Recommendation Engine

See `learning_engine.md` for full specification.

---

### 7. Data Providers — External

**Upwork MCP Server:** Primary source for profile data and job posting data. Accessed via the Upwork MCP protocol in the API layer.

**Public job feeds:** Scraped or fetched via Upwork's public-facing job search. Used for market intelligence (batch, not real-time).

**Community signals (Phase 5):** Structured parsing of public freelance community discussions.

---

### 8. Persistence Layer — Supabase

**Technology:** PostgreSQL 15, pgvector, Supabase Auth, Supabase Realtime, Row-Level Security

**Responsibilities:**
- Persist all user data (profiles, analyses, proposals, usage)
- Persist market intelligence snapshots
- Store vector embeddings for semantic search and similarity
- Enforce data isolation via RLS policies
- Provide auth token validation

See `database_schema.md` for full table definitions.

---

## Communication Patterns

### Synchronous (Request/Response)

Used for: user-initiated actions (trigger analysis, submit proposal, fetch history).

```
Browser → Next.js Route Handler → Hono API → Service → AI Pipeline / DB → Response
```

### Streaming

Used for: AI-generated content (analysis results, proposal rewrites, AI Coach).

```
Browser (Suspense + stream) ← Next.js (streaming RSC) ← Hono SSE ← Claude streaming API
```

### Asynchronous (Background Jobs)

Used for: market data ingestion, scheduled analysis refreshes, embedding generation.

```
GitHub Actions / Railway Cron → API endpoint (authenticated) → Learning Engine providers → DB write
```

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                            GitHub                                       │
│   main branch push → CI (lint/typecheck/test/build) → Deploy workflow  │
└─────────────────────────────┬──────────────────────────────────────────┘
                              │
              ┌───────────────┴──────────────┐
              │                              │
┌─────────────▼────────────┐  ┌─────────────▼────────────┐
│       Vercel             │  │       Railway             │
│  apps/web (Next.js)      │  │  apps/api (Hono)          │
│  Edge Network CDN        │  │  Node.js container        │
│  Serverless Functions    │  │  Persistent process       │
└──────────────────────────┘  └──────────────────────────┘
              │                              │
              └───────────────┬──────────────┘
                              │
              ┌───────────────▼──────────────┐
              │           Supabase           │
              │    PostgreSQL + pgvector      │
              │    Auth + RLS                │
              └──────────────────────────────┘
```

---

## Security Architecture

| Layer | Control |
|---|---|
| Transport | TLS 1.3+ everywhere |
| Authentication | Supabase JWT, validated on every API request |
| Authorization | RLS at database layer; service layer always passes `userId` explicitly |
| Input validation | Zod schemas at API boundary (never trust client input) |
| Secret management | Environment variables only; no secrets in code |
| AI key exposure | Anthropic + OpenAI keys only available server-side |
| Data isolation | Each user can only read/write their own rows |
| Rate limiting | Per-user token bucket, enforced in API middleware |

---

## Scalability Considerations

- The API is stateless and horizontally scalable behind Railway's load balancer.
- AI pipeline calls are I/O-bound and benefit from Node.js's async model without additional threads.
- Database connections are pooled via Supabase's connection pooler (PgBouncer).
- Market data ingestion runs as a separate background job to avoid impacting API latency.
- Embeddings are generated asynchronously after analysis completes; they do not block the response.
