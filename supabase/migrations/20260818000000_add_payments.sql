create table if not exists public.payment_operations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null,
  amount numeric(12, 2) not null check (amount >= 0),
  paid_at date not null,
  status text not null default 'Оплачено',
  created_at timestamptz not null default now()
);

create table if not exists public.pending_payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null,
  amount numeric(12, 2) not null check (amount >= 0),
  due_at date not null,
  created_at timestamptz not null default now()
);

create table if not exists public.payment_reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null,
  remind_at date not null,
  created_at timestamptz not null default now()
);

alter table public.payment_operations enable row level security;
alter table public.pending_payments enable row level security;
alter table public.payment_reminders enable row level security;

create policy "read own payment operations"
  on public.payment_operations for select
  using (auth.uid() = user_id);

create policy "insert own payment operations"
  on public.payment_operations for insert
  with check (auth.uid() = user_id);

create policy "delete own payment operations"
  on public.payment_operations for delete
  using (auth.uid() = user_id);

create policy "read own pending payments"
  on public.pending_payments for select
  using (auth.uid() = user_id);

create policy "insert own pending payments"
  on public.pending_payments for insert
  with check (auth.uid() = user_id);

create policy "delete own pending payments"
  on public.pending_payments for delete
  using (auth.uid() = user_id);

create policy "read own payment reminders"
  on public.payment_reminders for select
  using (auth.uid() = user_id);

create policy "insert own payment reminders"
  on public.payment_reminders for insert
  with check (auth.uid() = user_id);

create policy "delete own payment reminders"
  on public.payment_reminders for delete
  using (auth.uid() = user_id);
