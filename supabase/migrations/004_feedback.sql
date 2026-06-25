-- Feedback submissions from the in-app feedback widget
create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  type text not null check (type in ('bug', 'feature', 'general')) default 'general',
  message text not null check (char_length(message) <= 2000),
  rating smallint check (rating >= 1 and rating <= 5),
  created_at timestamptz not null default now()
);

-- RLS: users can submit feedback (insert only); only service role reads
alter table public.feedback enable row level security;

create policy "users can insert own feedback"
  on public.feedback
  for insert
  with check (auth.uid() = user_id or user_id is null);
