# Product Roadmap — UpIQ

## Principles

- Each phase must deliver standalone value before the next phase begins.
- AI features are prioritized only after their data dependencies are in place.
- User feedback is collected after each phase to validate assumptions before proceeding.
- Phases are not calendar-locked; they are gated on quality and validation milestones.

---

## Phase 0 — Foundation

**Goal:** Technical foundation is in place. The team can ship and iterate safely.

**Status:** In Progress

### Deliverables

- [x] Monorepo structure (Turborepo + pnpm workspaces)
- [x] Documentation suite (`/docs`)
- [ ] Database schema implemented in Supabase
- [ ] Authentication (email + Google OAuth via Supabase)
- [ ] CI/CD pipeline (GitHub Actions → Vercel + Railway)
- [ ] Base design system (Tailwind + shadcn/ui tokens)
- [ ] Shared TypeScript package (`packages/shared`)
- [ ] AI package skeleton (`packages/ai`) with Claude client
- [ ] Logging and error tracking (Sentry)
- [ ] Environment variable management

### Dependencies

None — this is the root phase.

### Exit Criteria

- A new engineer can clone the repo, run `pnpm dev`, and have a working local environment in under 15 minutes.
- CI runs pass on every commit.
- Authentication works end-to-end (sign up, log in, session persistence).

---

## Phase 1 — MVP: Profile Intelligence

**Goal:** A user can connect their Upwork profile and receive a scored, actionable analysis with specific recommendations.

### Deliverables

- Upwork profile data fetcher (URL → structured profile JSON)
- Profile scoring engine (5 dimensions, weighted composite)
- Claude-powered profile analysis pipeline
- Analysis result storage and history
- Profile dashboard UI (score overview, dimension breakdown, recommendations)
- 24-hour analysis caching
- Free tier rate limiting (5 analyses/day)
- Onboarding flow (sign up → connect profile → first analysis)

### Dependencies

- Phase 0 complete
- Anthropic API key provisioned
- Upwork data fetching strategy confirmed (MCP server or scraping)

### Exit Criteria

- 50 beta users complete a profile analysis.
- Average analysis completion time < 30 seconds.
- NPS score from beta users ≥ 7/10.
- At least 60% of beta users report at least one recommendation they acted on.

---

## Phase 2 — Proposal Intelligence

**Goal:** A user can optimize any proposal before submitting it to a job posting.

### Deliverables

- Job posting URL parser and metadata extractor
- Proposal scoring engine (5 dimensions)
- Claude-powered proposal rewriter with inline annotations
- Bid strength rating algorithm
- Proposal history storage and UI
- Proposal comparison view (original vs. rewrite side-by-side)
- Rate limiting for proposals (10/day free tier)

### Dependencies

- Phase 1 complete (user must have a connected profile; proposal optimization personalizes to their profile)
- Job data access strategy confirmed

### Exit Criteria

- 30% of beta users use the proposal optimizer within 7 days of first login.
- Average proposal score improves by ≥ 15 points between first and third submission for repeat users.
- User-reported bid submission rate after optimization ≥ 70%.

---

## Phase 3 — Market Intelligence

**Goal:** UpIQ learns from the market in real time and surfaces trends before they become competitive.

### Deliverables

- Market data ingestion pipeline (scheduled job, daily)
- Market Intelligence Extractor (Claude Haiku, batch processing)
- `market_snapshots` database population
- Market Radar dashboard: rate trends, skill demand, emerging niches
- Email/in-app alerts for significant category shifts
- Category selection and multi-category tracking

### Learning Engine Providers Added

- `MarketProvider` — extracts signals from public job postings
- `ProfileProvider` — aggregates anonymized profile benchmark data

### Dependencies

- Phase 1 complete (category baseline data needed)
- Reliable access to public job posting data at volume

### Exit Criteria

- Market snapshots run daily without intervention for 30 consecutive days.
- At least one niche trend alert is triggered and validated as accurate within 60 days.
- 40% of active users view the Market Radar at least once per week.

---

## Phase 4 — Career Intelligence

**Goal:** UpIQ synthesizes all signals into a personalized long-term career roadmap.

### Deliverables

- Growth Compass dashboard (90-day roadmap, skill gap analysis)
- Positioning Engine (finds user's unique differentiation angle vs. competitors)
- Niche recommendation engine (suggests adjacent niches based on market demand + user skills)
- Skills trend tracker (tracks which skills the user has vs. what the market is demanding)
- Milestone tracking (user sets income/rate goals, UpIQ tracks progress)

### Learning Engine Providers Added

- `ResultsProvider` — user-reported proposal outcomes, rate increases, milestones

### Dependencies

- Phase 3 complete (market trend data required for niche recommendations)
- Minimum 90 days of user outcome data collected

### Exit Criteria

- 25% of users open their Growth Compass weekly.
- Users who follow the 90-day roadmap report measurable rate increase within 90 days (validated via outcome feedback).

---

## Phase 5 — AI Coach

**Goal:** UpIQ becomes a conversational career advisor, not just a dashboard.

### Deliverables

- AI Coach chat interface (conversational, context-aware)
- Coach has access to user's full profile, proposal history, market data, and analysis history
- Coach can generate on-demand proposals, profile rewrites, and positioning statements
- Coach remembers prior conversations and builds on them
- Proactive coach check-ins ("Your JSS dropped 2 points this week — here's what to do")

### Learning Engine Providers Added

- `CommunityProvider` — ingests signals from freelance forums and community feedback

### Dependencies

- Phase 4 complete (Coach needs all data layers to be meaningful)
- Context window management strategy for long-running conversations

### Exit Criteria

- Average session length with the AI Coach ≥ 5 minutes.
- 50% of users who use the Coach report it as their primary UpIQ interaction.
- Coach suggestions have ≥ 80% acceptance rate from users.

---

## Phase 6 — Enterprise & Teams

**Goal:** Agencies and freelance teams use UpIQ to manage collective positioning and market intelligence.

### Deliverables

- Team workspace (multiple profiles under one account)
- Team aggregate profile score and gap analysis
- Agency-level market positioning report
- Admin role and member management
- Enterprise billing (per-seat pricing)
- SSO (SAML/OIDC)
- Data export (CSV, PDF)
- SLA and dedicated support tier

### Dependencies

- Phase 5 complete
- Legal review of team data handling policies
- Billing infrastructure (Stripe integration)

### Exit Criteria

- 10 agency accounts paying for the Enterprise tier.
- Agency churn rate < 5% monthly.

---

## Dependency Graph

```
Phase 0 (Foundation)
  └── Phase 1 (Profile Intelligence)
        └── Phase 2 (Proposal Intelligence)
              └── Phase 3 (Market Intelligence)
                    └── Phase 4 (Career Intelligence)
                          └── Phase 5 (AI Coach)
                                └── Phase 6 (Enterprise)
```

Each phase is strictly sequential. No phase begins until the exit criteria of the prior phase are met and validated.
