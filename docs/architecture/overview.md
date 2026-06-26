# Architecture Overview

## System Purpose

UpIQ ingests data from the freelance marketplace (Upwork), runs it through an AI analysis pipeline, stores structured intelligence in a database, and surfaces personalized recommendations to freelancers via a web application.

## High-Level Component Map

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client (Browser)                         │
│                    Next.js 15 App (apps/web)                    │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS (REST / Server Actions)
┌────────────────────────────▼────────────────────────────────────┐
│                        Backend API                              │
│                    Hono on Node.js (apps/api)                   │
│  ┌─────────────────┐  ┌──────────────┐  ┌────────────────────┐ │
│  │  Auth Middleware │  │ Route Layer  │  │  Service Layer     │ │
│  └─────────────────┘  └──────────────┘  └────────────────────┘ │
└──────────┬───────────────────────────────────────┬─────────────┘
           │                                       │
┌──────────▼───────────┐               ┌───────────▼─────────────┐
│   Supabase (Postgres) │               │   AI Pipeline           │
│   + pgvector          │               │   (packages/ai)         │
│                       │               │                         │
│  - users              │               │  - Anthropic Claude API │
│  - profiles           │◄──────────────│  - Embedding generation │
│  - market_snapshots   │               │  - Analysis prompts     │
│  - analyses           │               │  - Scoring models       │
│  - proposals          │               └─────────────────────────┘
└───────────────────────┘
           ▲
┌──────────┴───────────┐
│   Upwork MCP / API   │
│  (Market data feed)  │
└──────────────────────┘
```

## Data Flow

### Profile Analysis Flow

1. User connects their Upwork profile (OAuth or manual paste).
2. API fetches profile data via the Upwork MCP server.
3. The AI pipeline benchmarks the profile against anonymized top-earner data in the same category.
4. Analysis results are stored in the `analyses` table with a vector embedding.
5. The web app surfaces ranked recommendations with specific rewrite suggestions.

### Proposal Optimization Flow

1. User submits a job posting URL and their draft proposal.
2. API fetches job metadata from Upwork.
3. The AI pipeline scores the proposal (0–100) across five dimensions.
4. Claude generates a rewritten proposal with reasoning annotations.
5. The rewritten proposal and score breakdown are returned to the user.

### Market Intelligence Flow

1. A scheduled job (daily) fetches recent job postings in tracked categories.
2. The AI pipeline extracts rate data, skill demand, and trend signals.
3. Aggregated signals are stored in `market_snapshots`.
4. The web app renders trend dashboards and alerts.

## Monorepo Structure

```
UpIQ/
├── apps/
│   ├── web/          # Next.js 15 frontend
│   └── api/          # Hono backend API
├── packages/
│   ├── ui/           # Shared React component library
│   ├── ai/           # Claude API client, prompts, analysis utilities
│   └── shared/       # TypeScript types, Zod schemas, constants
├── docs/
├── scripts/
├── .github/
└── turbo.json
```

## Key Design Principles

- **AI-first**: Every intelligence feature is powered by Claude. Heuristics are only used when latency requires it.
- **Privacy by design**: Upwork profile data is stored only for the authenticated user. No profile data is shared across users or used to train models.
- **Composable packages**: Business logic lives in `packages/` so it can be consumed by both the web app and API without duplication.
- **Progressive enhancement**: The web app works without JavaScript for basic content; AI features are loaded as interactive islands.
