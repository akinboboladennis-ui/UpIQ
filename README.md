# UpIQ

> AI-powered career intelligence platform that continuously learns from the freelance marketplace to help freelancers optimize their profile, proposals, positioning, and long-term growth.

---

## What Is UpIQ?

UpIQ monitors the freelance marketplace in real time, analyzes patterns from top-performing profiles and winning proposals, and delivers personalized, actionable intelligence to help freelancers earn more and grow faster.

**Core capabilities:**

- **Profile Intelligence** — Identify gaps in your profile compared to top earners in your niche and get specific rewrite suggestions.
- **Proposal Optimizer** — Score and rewrite proposals using patterns from successful bids in your category.
- **Market Radar** — Track rate trends, in-demand skills, and emerging niches before they become competitive.
- **Growth Compass** — Long-term career roadmap based on where the market is heading and where your skills are now.
- **Positioning Engine** — Surface the unique angle that makes your profile stand out in a crowded category.

---

## Architecture Overview

UpIQ is a full-stack monorepo built as a modern web application backed by an AI pipeline.

```
UpIQ/
├── apps/
│   ├── web/          # Next.js 15 frontend (App Router)
│   └── api/          # Node.js / Hono backend API
├── packages/
│   ├── ui/           # Shared design system components
│   ├── ai/           # AI pipeline utilities and prompts
│   └── shared/       # Shared TypeScript types and utilities
├── docs/             # Architecture, API, and decision records
└── scripts/          # Dev, build, and ops scripts
```

Full architecture documentation lives in [`/docs`](./docs/README.md).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, React 19, Tailwind CSS, shadcn/ui |
| Backend API | Node.js, Hono, Zod |
| AI Pipeline | Anthropic Claude API (claude-opus-4-8 / claude-haiku-4-5) |
| Database | PostgreSQL (Supabase), pgvector for embeddings |
| Auth | Supabase Auth |
| Infra | Vercel (web), Railway (API), GitHub Actions (CI/CD) |
| Monorepo | Turborepo, pnpm workspaces |

---

## Getting Started

See [docs/guides/getting-started.md](./docs/guides/getting-started.md) for full local setup instructions.

**Quick start (once prerequisites are met):**

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env

# Start all services in development mode
pnpm dev
```

---

## Documentation

| Document | Description |
|---|---|
| [Architecture Overview](./docs/architecture/overview.md) | System design and component map |
| [Frontend Architecture](./docs/architecture/frontend.md) | Next.js app structure and conventions |
| [Backend Architecture](./docs/architecture/backend.md) | API design and service layer |
| [AI Pipeline](./docs/architecture/ai-pipeline.md) | How market intelligence is generated |
| [Data Model](./docs/architecture/data-model.md) | Database schema and entity relationships |
| [API Reference](./docs/api/README.md) | REST API endpoint documentation |
| [Getting Started](./docs/guides/getting-started.md) | Local development setup |
| [Contributing](./docs/guides/contributing.md) | Contribution guidelines |
| [Deployment](./docs/guides/deployment.md) | Deployment guide |
| [ADR-001: Tech Stack](./docs/decisions/adr-001-tech-stack.md) | Why we chose this stack |

---

## Project Status

UpIQ is in active early development. The foundation is being laid and no production release has been made.

---

## License

[MIT](./LICENSE) © 2024 UpIQ Contributors
