create table if not exists public.requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null,
  status text not null default 'new' check (status in ('new', 'in_progress', 'done')),
  deadline_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.request_notes (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.requests (id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  text text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.requests enable row level security;
alter table public.request_notes enable row level security;

create policy "read own requests"
  on public.requests for select
  using (auth.uid() = user_id);

create policy "insert own requests"
  on public.requests for insert
  with check (auth.uid() = user_id);

create policy "update own requests"
  on public.requests for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "delete own requests"
  on public.requests for delete
  using (auth.uid() = user_id);

create policy "read own request notes"
  on public.request_notes for select
  using (auth.uid() = user_id);

create policy "insert own request notes"
  on public.request_notes for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.requests
      where requests.id = request_notes.request_id
      and requests.user_id = auth.uid()
    )
  );

create policy "update own request notes"
  on public.request_notes for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "delete own request notes"
  on public.request_notes for delete
  using (auth.uid() = user_id);
