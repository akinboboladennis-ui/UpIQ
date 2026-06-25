# Database Schema — UpIQ

## Design Principles

- Every user-scoped table enforces Row-Level Security (RLS): users read and write only their own data.
- Global/reference tables (categories, market data) are readable by all authenticated users.
- Soft deletes are used on user-generated content tables (`deleted_at` timestamp).
- `created_at` and `updated_at` are present on every table.
- UUIDs are used for all primary keys.
- `jsonb` columns are used where the structure is expected to evolve; typed columns are used where the structure is fixed.
- The `pgvector` extension enables semantic similarity search on analysis embeddings.

---

## Extensions Required

```sql
create extension if not exists "uuid-ossp";
create extension if not exists "pgvector";
```

---

## Tables

### `categories`

Reference table for freelance categories.

```sql
create table categories (
  slug        text primary key,
  label       text not null,
  parent_slug text references categories(slug),
  platform    text not null default 'upwork',
  created_at  timestamptz not null default now()
);
```

**Seed data examples:**
- `web-development` / Web Development
- `mobile-development` / Mobile Development
- `ui-ux-design` / UI/UX Design
- `copywriting` / Copywriting

---

### `profiles`

Stores the user's linked Upwork profile. One profile per user.

```sql
create table profiles (
  id                  uuid primary key default uuid_generate_v4(),
  user_id             uuid not null unique references auth.users(id) on delete cascade,
  upwork_uid          text,
  upwork_url          text,
  display_name        text,
  title               text,
  overview            text,
  category            text references categories(slug),
  hourly_rate         numeric(10, 2),
  job_success_score   numeric(5, 2),
  total_earned        numeric(12, 2),
  review_count        integer default 0,
  portfolio_count     integer default 0,
  skills              text[] default '{}',
  raw_data            jsonb,
  last_synced_at      timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index profiles_user_id_idx on profiles(user_id);
create index profiles_category_idx on profiles(category);

-- RLS
alter table profiles enable row level security;

create policy "profiles_user_isolation" on profiles
  for all using (auth.uid() = user_id);
```

---

### `analyses`

Stores the output of every AI analysis run.

```sql
create table analyses (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  type            text not null check (type in ('profile', 'positioning', 'market_fit')),
  input_snapshot  jsonb not null,          -- snapshot of input data at analysis time
  result          jsonb not null,          -- full AI output (scores, dimensions, recommendations)
  overall_score   numeric(5, 2),
  model_used      text not null,
  prompt_version  text not null,           -- tracks which prompt version generated this result
  embedding       vector(1536),            -- semantic embedding of result summary
  cached          boolean not null default false,
  deleted_at      timestamptz,
  created_at      timestamptz not null default now()
);

create index analyses_user_id_idx on analyses(user_id);
create index analyses_type_idx on analyses(type);
create index analyses_created_at_idx on analyses(created_at desc);
create index analyses_embedding_idx on analyses
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- RLS
alter table analyses enable row level security;

create policy "analyses_user_isolation" on analyses
  for all using (auth.uid() = user_id);
```

**`result` jsonb structure (profile analysis):**
```json
{
  "overallScore": 72,
  "dimensions": {
    "title": { "score": 65, "strengths": [...], "gaps": [...], "rewrite": "..." },
    "overview": { "score": 80, "strengths": [...], "gaps": [...], "rewrite": "..." },
    "portfolio": { "score": 55, "strengths": [...], "gaps": [...] },
    "skills": { "score": 70, "strengths": [...], "gaps": [...] },
    "rates": { "score": 90, "strengths": [...], "gaps": [...] }
  },
  "recommendations": [
    {
      "id": "rec_001",
      "dimension": "portfolio",
      "impact": "high",
      "gap": "...",
      "action": "...",
      "rewrite": "..."
    }
  ]
}
```

---

### `proposals`

Stores proposal optimization submissions and results.

```sql
create table proposals (
  id               uuid primary key default uuid_generate_v4(),
  user_id          uuid not null references auth.users(id) on delete cascade,
  job_url          text,
  job_metadata     jsonb,               -- title, budget, skills, client signals
  draft            text not null,
  rewrite          text,
  overall_score    numeric(5, 2),
  score_breakdown  jsonb,               -- per-dimension scores
  bid_strength     text check (bid_strength in ('low', 'medium', 'high')),
  model_used       text,
  prompt_version   text,
  outcome          text check (outcome in ('submitted', 'shortlisted', 'hired', 'rejected', 'unknown')),
  outcome_recorded_at timestamptz,
  deleted_at       timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index proposals_user_id_idx on proposals(user_id);
create index proposals_created_at_idx on proposals(created_at desc);

-- RLS
alter table proposals enable row level security;

create policy "proposals_user_isolation" on proposals
  for all using (auth.uid() = user_id);
```

---

### `market_snapshots`

Stores daily market intelligence extractions per category. Not user-scoped.

```sql
create table market_snapshots (
  id               uuid primary key default uuid_generate_v4(),
  category         text not null references categories(slug),
  snapshot_date    date not null,
  platform         text not null default 'upwork',
  median_rate      numeric(10, 2),
  rate_p25         numeric(10, 2),
  rate_p75         numeric(10, 2),
  top_skills       jsonb,               -- [{ skill: string, frequency: number }]
  emerging_skills  jsonb,               -- skills growing >10% week-over-week
  declining_skills jsonb,
  job_volume       integer,
  avg_budget       numeric(12, 2),
  model_used       text,
  prompt_version   text,
  created_at       timestamptz not null default now(),

  unique (category, snapshot_date, platform)
);

create index market_snapshots_category_date_idx on market_snapshots(category, snapshot_date desc);
```

---

### `recommendations`

Stores the output of the Recommendation Engine for a user at a point in time.

```sql
create table recommendations (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  source          text not null,        -- 'profile_analysis' | 'market_signal' | 'proposal_pattern'
  dimension       text,
  title           text not null,
  description     text not null,
  action          text,
  impact          text check (impact in ('critical', 'high', 'medium', 'low')),
  evidence        jsonb,               -- what data drove this recommendation
  status          text not null default 'active'
                  check (status in ('active', 'dismissed', 'completed')),
  dismissed_at    timestamptz,
  completed_at    timestamptz,
  expires_at      timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index recommendations_user_id_status_idx on recommendations(user_id, status);
create index recommendations_impact_idx on recommendations(impact);

-- RLS
alter table recommendations enable row level security;

create policy "recommendations_user_isolation" on recommendations
  for all using (auth.uid() = user_id);
```

---

### `learning_signals`

Stores normalized signals from all Learning Engine providers before they are processed into recommendations.

```sql
create table learning_signals (
  id             uuid primary key default uuid_generate_v4(),
  provider       text not null,         -- 'proposal' | 'market' | 'community' | 'results' | 'profile'
  signal_type    text not null,
  category       text references categories(slug),
  payload        jsonb not null,
  relevance      numeric(5, 4),         -- 0.0 to 1.0, provider-assigned
  processed      boolean not null default false,
  processed_at   timestamptz,
  created_at     timestamptz not null default now()
);

create index learning_signals_provider_idx on learning_signals(provider);
create index learning_signals_processed_idx on learning_signals(processed, created_at);
```

---

### `ai_usage`

Tracks AI API usage per user for billing and rate limiting.

```sql
create table ai_usage (
  id             uuid primary key default uuid_generate_v4(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  feature        text not null,         -- 'profile_analysis' | 'proposal_optimizer' | 'ai_coach'
  model          text not null,
  input_tokens   integer not null default 0,
  output_tokens  integer not null default 0,
  cached_tokens  integer not null default 0,
  latency_ms     integer,
  created_at     timestamptz not null default now()
);

create index ai_usage_user_id_idx on ai_usage(user_id);
create index ai_usage_feature_idx on ai_usage(feature);
create index ai_usage_created_at_idx on ai_usage(created_at desc);

-- RLS
alter table ai_usage enable row level security;

create policy "ai_usage_user_isolation" on ai_usage
  for all using (auth.uid() = user_id);
```

---

### `prompt_versions`

Tracks versioned prompt templates for auditability and rollback.

```sql
create table prompt_versions (
  id           uuid primary key default uuid_generate_v4(),
  name         text not null,
  version      text not null,
  content      text not null,
  variables    text[] default '{}',
  model_target text,
  notes        text,
  active       boolean not null default true,
  created_at   timestamptz not null default now(),

  unique (name, version)
);

create index prompt_versions_name_active_idx on prompt_versions(name, active);
```

---

## Entity Relationship Diagram

```
auth.users (Supabase managed)
  │
  ├── profiles (1:1)
  ├── analyses (1:many)
  ├── proposals (1:many)
  ├── recommendations (1:many)
  └── ai_usage (1:many)

categories (reference)
  ├── profiles.category
  ├── market_snapshots.category
  └── learning_signals.category

market_snapshots (global, not user-scoped)
learning_signals (global, not user-scoped)
prompt_versions (global, not user-scoped)
```

---

## Future Extensibility

| Future need | Extension approach |
|---|---|
| Team/agency accounts | Add `teams` table, `team_members` junction, update RLS policies |
| Multi-platform support | Add `platform` column to profiles, extend category slug prefix |
| A/B testing prompts | `prompt_versions` already supports multiple active versions per name |
| Proposal outcome ML | `proposals.outcome` column enables supervised learning dataset |
| Semantic search | `analyses.embedding` with ivfflat index already in place |
| Audit logging | Add `audit_log` table with trigger-based inserts |
