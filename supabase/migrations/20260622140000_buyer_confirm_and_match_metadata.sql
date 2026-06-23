-- Buyer delivery confirmation + AI match metadata on transport jobs

alter table public.orders
  add column if not exists buyer_confirmed_at timestamptz;

alter table public.transport_jobs
  add column if not exists recommended_transporter_id uuid references public.profiles (id) on delete set null,
  add column if not exists match_score numeric,
  add column if not exists match_factors jsonb;
