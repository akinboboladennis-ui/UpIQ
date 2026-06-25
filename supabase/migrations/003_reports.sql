-- Sprint Nexus: Intelligence Report extensions
-- Adds report metadata (title, favorite, recommendation completion) to analyses
-- and relaxes RLS so users can rename / favorite / track / delete their own reports.

alter table public.analyses
  add column if not exists title                    text,
  add column if not exists is_favorite              boolean not null default false,
  add column if not exists completed_recommendations jsonb   not null default '[]';

-- Backfill a sensible title for existing rows.
update public.analyses
  set title = coalesce(nullif(draft->>'title', ''), 'Profile Analysis')
  where title is null;

create index if not exists analyses_is_favorite_idx on public.analyses(is_favorite);

-- Allow owners to update their own report metadata (rename, favorite, completion).
drop policy if exists "analyses_update_own" on public.analyses;
create policy "analyses_update_own" on public.analyses
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Allow owners to delete their own reports.
drop policy if exists "analyses_delete_own" on public.analyses;
create policy "analyses_delete_own" on public.analyses
  for delete using (auth.uid() = user_id);
