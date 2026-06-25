# Data Model

All tables live in a PostgreSQL database managed by Supabase. Row-level security (RLS) is enabled on all user-scoped tables.

## Entity Relationship Summary

```
users
  └── profiles           (1 user → 1 profile)
  └── proposals          (1 user → many proposals)
  └── analyses           (1 user → many analyses)
  └── ai_usage           (1 user → many usage records)

market_snapshots          (global, not user-scoped)
categories                (reference table)
```

## Table Definitions

### `users`
Managed by Supabase Auth. Extended with a public profile via `profiles`.

### `profiles`

Stores the user's linked Upwork profile data.

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | Primary key, equals `auth.users.id` |
| `upwork_uid` | `text` | Upwork profile identifier |
| `raw_data` | `jsonb` | Full profile snapshot from Upwork |
| `category` | `text` | FK → `categories.slug` |
| `hourly_rate` | `numeric` | Current stated rate |
| `job_success_score` | `numeric` | JSS at time of last sync |
| `last_synced_at` | `timestamptz` | Last successful Upwork fetch |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | |

### `analyses`

Stores the output of an AI profile analysis run.

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | Primary key |
| `user_id` | `uuid` | FK → `users.id` |
| `type` | `text` | `profile` \| `positioning` |
| `result` | `jsonb` | Full AI output (scored dimensions + suggestions) |
| `model_used` | `text` | Claude model ID |
| `embedding` | `vector(1536)` | For semantic similarity search |
| `created_at` | `timestamptz` | |

### `proposals`

Stores submitted proposals and their AI optimization results.

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | Primary key |
| `user_id` | `uuid` | FK → `users.id` |
| `job_url` | `text` | Source job posting URL |
| `job_metadata` | `jsonb` | Extracted job data |
| `draft` | `text` | User's original draft |
| `rewrite` | `text` | AI-generated rewrite |
| `score` | `numeric` | Overall proposal score (0–100) |
| `score_breakdown` | `jsonb` | Per-dimension scores |
| `created_at` | `timestamptz` | |

### `market_snapshots`

Stores daily market intelligence extractions per category.

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | Primary key |
| `category` | `text` | FK → `categories.slug` |
| `snapshot_date` | `date` | Date of the snapshot |
| `median_rate` | `numeric` | Median hourly rate observed |
| `top_skills` | `jsonb` | `[{skill, frequency}]` |
| `emerging_skills` | `jsonb` | Skills growing week-over-week |
| `job_volume` | `integer` | Number of postings analysed |
| `created_at` | `timestamptz` | |

### `ai_usage`

Tracks Claude API usage per user for billing and rate-limiting.

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | Primary key |
| `user_id` | `uuid` | FK → `users.id` |
| `feature` | `text` | `profile_analysis` \| `proposal_optimizer` \| etc. |
| `model` | `text` | Claude model ID |
| `input_tokens` | `integer` | |
| `output_tokens` | `integer` | |
| `created_at` | `timestamptz` | |

### `categories`

Reference table for freelance categories.

| Column | Type | Notes |
|---|---|---|
| `slug` | `text` | Primary key, e.g. `web-development` |
| `label` | `text` | Human-readable label |
| `parent_slug` | `text` | Self-reference for subcategories |

## RLS Policies

All user-scoped tables enforce:

```sql
-- Users can only read/write their own rows
create policy "user_isolation" on <table>
  using (auth.uid() = user_id);
```

`market_snapshots` and `categories` are readable by all authenticated users, not writable by users.
