-- Отзывы видны всем пользователям приложения, создавать можно только от своего аккаунта.
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  author_name text not null default 'Пользователь',
  text text not null check (char_length(text) between 2 and 220),
  created_at timestamptz not null default now()
);

alter table public.reviews enable row level security;

create policy "read all reviews"
  on public.reviews for select
  using (true);

create policy "insert own reviews"
  on public.reviews for insert
  with check (auth.uid() = user_id);

create policy "delete own reviews"
  on public.reviews for delete
  using (auth.uid() = user_id);
