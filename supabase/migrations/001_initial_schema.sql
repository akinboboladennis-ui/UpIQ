-- UpIQ Initial Schema
-- Run this in the Supabase SQL editor or via the Supabase CLI.

-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "vector";

-- ============================================================
-- categories
-- ============================================================
create table if not exists public.categories (
  slug        text primary key,
  label       text not null,
  parent_slug text references public.categories(slug),
  platform    text not null default 'upwork',
  created_at  timestamptz not null default now()
);

insert into public.categories (slug, label) values
  ('web-development',    'Web Development'),
  ('mobile-development', 'Mobile Development'),
  ('ui-ux-design',       'UI/UX Design'),
  ('copywriting',        'Copywriting'),
  ('data-science',       'Data Science'),
  ('devops',             'DevOps & Cloud'),
  ('video-editing',      'Video Editing'),
  ('virtual-assistant',  'Virtual Assistant')
on conflict do nothing;

-- ============================================================
-- profiles
-- Extends auth.users with Upwork and UpIQ-specific data.
-- ============================================================
create table if not exists public.profiles (
  id                  uuid primary key default uuid_generate_v4(),
  user_id             uuid not null unique references auth.users(id) on delete cascade,
  upwork_uid          text,
  upwork_url          text,
  display_name        text,
  first_name          text,
  last_name           text,
  avatar_url          text,
  category            text references public.categories(slug),
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

create index if not exists profiles_user_id_idx on public.profiles(user_id);
create index if not exists profiles_category_idx on public.profiles(category);

-- ============================================================
-- Row-Level Security
-- ============================================================
alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = user_id);

create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = user_id);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = user_id);

create policy "profiles_delete_own" on public.profiles
  for delete using (auth.uid() = user_id);

-- ============================================================
-- Auto-create profile on signup
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, display_name, first_name, last_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', new.email),
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- updated_at auto-update trigger
-- ============================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

-- ============================================================
-- ai_usage
-- Tracks Claude API consumption per user.
-- ============================================================
create table if not exists public.ai_usage (
  id             uuid primary key default uuid_generate_v4(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  feature        text not null,
  model          text not null,
  input_tokens   integer not null default 0,
  output_tokens  integer not null default 0,
  cached_tokens  integer not null default 0,
  latency_ms     integer,
  created_at     timestamptz not null default now()
);

create index if not exists ai_usage_user_id_idx on public.ai_usage(user_id);
create index if not exists ai_usage_created_at_idx on public.ai_usage(created_at desc);

alter table public.ai_usage enable row level security;

create policy "ai_usage_select_own" on public.ai_usage
  for select using (auth.uid() = user_id);

create policy "ai_usage_insert_own" on public.ai_usage
  for insert with check (auth.uid() = user_id);
