create table if not exists public.rent_payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  object_name text not null,
  due_at date not null,
  amount numeric(12, 2) not null check (amount >= 0),
  is_paid boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.rent_payments enable row level security;

create policy "read own rent payments"
  on public.rent_payments for select
  using (auth.uid() = user_id);

create policy "insert own rent payments"
  on public.rent_payments for insert
  with check (auth.uid() = user_id);

create policy "update own rent payments"
  on public.rent_payments for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "delete own rent payments"
  on public.rent_payments for delete
  using (auth.uid() = user_id);
