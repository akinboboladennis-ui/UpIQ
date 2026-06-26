# Product Requirements — UpIQ

## MVP Scope

The MVP focuses on one core loop: **connect profile → get scored analysis → act on specific recommendations**. Everything outside this loop is deferred.

---

## User Stories

### Authentication & Onboarding

| ID | Story | Priority |
|---|---|---|
| US-001 | As a new user, I can sign up with email or Google so I can access the platform without friction. | Must |
| US-002 | As a new user, I am prompted to connect my Upwork profile during onboarding so the platform has context to analyze. | Must |
| US-003 | As a new user, I can select my primary freelance category so the platform benchmarks me against the right peers. | Must |
| US-004 | As a returning user, I can log in and reach my dashboard in under 3 seconds. | Must |

### Profile Intelligence

| ID | Story | Priority |
|---|---|---|
| US-010 | As a freelancer, I can paste my Upwork profile URL so UpIQ can analyze my public profile. | Must |
| US-011 | As a freelancer, I receive an overall profile score (0–100) with a breakdown by dimension so I understand where I stand. | Must |
| US-012 | As a freelancer, I receive a prioritized list of specific recommendations, ordered by estimated impact, so I know what to fix first. | Must |
| US-013 | As a freelancer, each recommendation includes a specific rewrite or action so I don't have to guess what "fix it" means. | Must |
| US-014 | As a freelancer, I can see how my profile compares to top earners in my category so I have a concrete benchmark. | Must |
| US-015 | As a freelancer, I can re-analyze my profile after making changes so I can track improvement. | Must |

### Proposal Optimizer

| ID | Story | Priority |
|---|---|---|
| US-020 | As a freelancer, I can paste a job posting URL and my draft proposal so UpIQ can evaluate the fit. | Must |
| US-021 | As a freelancer, I receive a proposal score with a breakdown across relevance, specificity, social proof, tone, and call-to-action. | Must |
| US-022 | As a freelancer, I receive a rewritten version of my proposal with annotations explaining each change. | Must |
| US-023 | As a freelancer, I can see a bid strength rating ("Low / Medium / High") so I can decide whether to submit. | Should |
| US-024 | As a freelancer, I can view my proposal history so I can track what I've submitted and learn from patterns. | Should |

### Market Radar (Post-MVP)

| ID | Story | Priority |
|---|---|---|
| US-030 | As a freelancer, I can see the median hourly rate for my category over the past 30 days so I can price competitively. | Should |
| US-031 | As a freelancer, I can see which skills are increasing in demand in my category so I can decide what to learn next. | Should |
| US-032 | As a freelancer, I receive an alert when a significant market shift is detected in my category. | Could |

### Growth Compass (Post-MVP)

| ID | Story | Priority |
|---|---|---|
| US-040 | As a freelancer, I receive a 90-day career roadmap based on my current profile and market conditions. | Could |
| US-041 | As a freelancer, I can track whether I am on track with my career goals. | Could |

---

## Functional Requirements

### FR-001: Profile Analysis

- The system must accept a valid Upwork profile URL as input.
- The system must extract publicly available profile data (title, overview, skills, portfolio, hourly rate, reviews).
- The system must score the profile across a minimum of five dimensions: Title, Overview, Portfolio, Skills, and Rates.
- Each dimension score must be in the range 0–100.
- The overall score must be a weighted composite of dimension scores.
- The system must produce at least 3 and at most 10 ranked recommendations per analysis.
- Each recommendation must include: dimension, gap description, specific rewrite or action, and estimated impact label (High / Medium / Low).
- Analysis results must be stored and retrievable for the user's history.
- Cached results must be returned if an analysis was run within the past 24 hours for the same profile.

### FR-002: Proposal Optimization

- The system must accept a job posting URL and a freeform text proposal as input.
- The system must extract job metadata: title, description, budget, required skills, and client history indicators.
- The system must score the proposal across five dimensions: Relevance, Specificity, Social Proof, Tone, and Call-to-Action.
- The system must return an annotated rewrite of the proposal.
- The system must return a bid strength rating.
- Proposals must be stored in the user's history.

### FR-003: Authentication

- The system must support email/password authentication.
- The system must support Google OAuth.
- All authenticated sessions must be validated via JWT on every API request.
- Users must only be able to access their own data.

### FR-004: Rate Limiting

- Profile analysis is limited to 5 runs per user per day on the free tier.
- Proposal optimization is limited to 10 runs per user per day on the free tier.
- Rate limit status must be surfaced in the UI before the user hits the limit.

---

## Non-Functional Requirements

### Performance

| Requirement | Target |
|---|---|
| Dashboard initial load | < 2 seconds (LCP) |
| Profile analysis response time | < 30 seconds (streamed) |
| Proposal optimization response time | < 45 seconds (streamed) |
| API p99 response time (non-AI endpoints) | < 500ms |
| Uptime | 99.5% monthly |

### Security

- All data in transit must be encrypted (TLS 1.3+).
- API keys (Anthropic, Upwork) must never be exposed to the client.
- Row-level security must be enforced at the database layer for all user-scoped tables.
- Password hashing uses bcrypt (via Supabase Auth).
- Input validation is enforced at the API boundary with Zod schemas.
- No user profile data is logged in plain text.

### Scalability

- The AI pipeline must support horizontal scaling for concurrent analysis requests.
- The database must support 100,000 users without schema changes.
- Market data ingestion must be runnable as a background job independent of the API.

### Accessibility

- All interactive elements must be keyboard-navigable.
- Color contrast must meet WCAG 2.1 AA standards.
- Screen reader support for all primary user flows.

### Privacy

- Users may delete their account and all associated data at any time.
- No user-identifiable data is shared across users.
- Market intelligence is always aggregated and anonymized.
- Explicit consent is required before any user data is used to improve AI models.

---

## Acceptance Criteria

### AC-001: Profile Analysis

Given a valid Upwork profile URL, when a user submits it for analysis:
- A score between 0 and 100 is returned within 30 seconds.
- At least 3 ranked recommendations are returned.
- Each recommendation contains a specific rewrite or action.
- The result is stored and visible in the user's analysis history.

### AC-002: Proposal Optimizer

Given a job URL and a draft proposal, when a user submits for optimization:
- A proposal score between 0 and 100 is returned.
- A rewritten proposal with inline annotations is returned.
- A bid strength rating (Low / Medium / High) is returned.
- The submission is stored in proposal history.

### AC-003: Authentication

Given valid credentials, when a user attempts to log in:
- They are authenticated in under 2 seconds.
- They are redirected to the dashboard.
- Their session persists across browser refreshes.

### AC-004: Rate Limiting

Given a user on the free tier who has exhausted their daily analysis quota:
- Subsequent analysis requests return a 429 error with a message indicating when the quota resets.
- The UI displays the remaining quota before the user attempts to submit.

---

## Out of Scope for MVP

- Mobile native applications
- Multi-platform support (Fiverr, Toptal, etc.)
- Team or agency accounts
- API access for third parties
- Custom AI model fine-tuning
- Billing and paid tiers (free during beta)
