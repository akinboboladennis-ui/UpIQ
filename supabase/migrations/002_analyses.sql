-- Sprint Oracle: AI analysis results storage

create table if not exists public.analyses (
  id               uuid primary key default uuid_generate_v4(),
  user_id          uuid not null references auth.users(id) on delete cascade,

  -- Input snapshot (sanitized, no PII beyond what the user entered)
  draft            jsonb not null,

  -- AI output
  overall_score    smallint not null check (overall_score between 0 and 100),
  scores           jsonb not null,        -- full ProfileScore object
  strengths        text[] not null default '{}',
  weaknesses       text[] not null default '{}',
  missing_keywords text[] not null default '{}',
  suggestions      jsonb not null default '{}',  -- { title, overviewOpener }
  priority_fixes   text[] not null default '{}',
  ai_summary       text not null default '',
  next_actions     text[] not null default '{}',
  recommendations  jsonb not null default '[]',

  -- Provenance
  prompt_version   text not null,
  provider         text not null,
  model            text not null,
  input_tokens     integer not null default 0,
  output_tokens    integer not null default 0,
  latency_ms       integer not null default 0,

  created_at       timestamptz not null default now()
);

create index if not exists analyses_user_id_idx      on public.analyses(user_id);
create index if not exists analyses_created_at_idx   on public.analyses(created_at desc);
create index if not exists analyses_overall_score_idx on public.analyses(overall_score);

-- RLS
alter table public.analyses enable row level security;

create policy "analyses_select_own" on public.analyses
  for select using (auth.uid() = user_id);

create policy "analyses_insert_own" on public.analyses
  for insert with check (auth.uid() = user_id);

-- Users cannot update/delete analyses (immutable audit trail).
