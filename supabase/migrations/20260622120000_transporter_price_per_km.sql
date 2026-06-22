alter table public.transporter_profiles
  add column if not exists price_per_km numeric not null default 120 check (price_per_km > 0);
