alter table public.requests
  add column if not exists label_color text not null default '#4f8cff';
