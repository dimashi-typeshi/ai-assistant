alter table public.requests add column if not exists is_demo boolean not null default false;
alter table public.rent_contracts add column if not exists is_demo boolean not null default false;
alter table public.rent_payments add column if not exists is_demo boolean not null default false;
alter table public.rent_notes add column if not exists is_demo boolean not null default false;
alter table public.payment_operations add column if not exists is_demo boolean not null default false;
alter table public.pending_payments add column if not exists is_demo boolean not null default false;
alter table public.payment_reminders add column if not exists is_demo boolean not null default false;
