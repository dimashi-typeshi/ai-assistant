create table if not exists public.rent_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  object_name text not null,
  text text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.rent_notes enable row level security;

create policy "read own rent notes"
  on public.rent_notes for select
  using (auth.uid() = user_id);

create policy "insert own rent notes"
  on public.rent_notes for insert
  with check (auth.uid() = user_id);

create policy "update own rent notes"
  on public.rent_notes for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "delete own rent notes"
  on public.rent_notes for delete
  using (auth.uid() = user_id);
