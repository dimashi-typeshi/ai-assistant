create table if not exists public.rent_contracts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  object_name text not null,
  tenant_name text not null,
  starts_at date not null,
  ends_at date not null,
  monthly_amount numeric(12, 2) not null check (monthly_amount >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at >= starts_at)
);

alter table public.rent_contracts enable row level security;

create policy "read own rent contracts"
  on public.rent_contracts for select
  using (auth.uid() = user_id);

create policy "insert own rent contracts"
  on public.rent_contracts for insert
  with check (auth.uid() = user_id);

create policy "update own rent contracts"
  on public.rent_contracts for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "delete own rent contracts"
  on public.rent_contracts for delete
  using (auth.uid() = user_id);
