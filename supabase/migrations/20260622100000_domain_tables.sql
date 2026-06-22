-- Domain tables for marketplace data (listings, orders, transport, trips)

-- Listings
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  farmer_id uuid not null references public.profiles (id) on delete cascade,
  crop text not null,
  quantity numeric not null check (quantity >= 0),
  district text not null,
  price_per_kg numeric not null check (price_per_kg >= 0),
  available_date date,
  status text not null default 'Pending'
    check (status in ('Pending', 'Matched', 'Processing', 'In Transit', 'Delivered', 'Completed')),
  freshness text not null default 'Excellent',
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists listings_farmer_id_idx on public.listings (farmer_id);
create index if not exists listings_status_idx on public.listings (status);

-- Transporter vehicle profiles (one per transporter user)
create table if not exists public.transporter_profiles (
  id uuid primary key references public.profiles (id) on delete cascade,
  vehicle_type text not null,
  capacity numeric not null check (capacity > 0),
  license_plate text not null,
  routes text[] not null default '{}',
  lat numeric,
  lng numeric,
  rating numeric not null default 5.0,
  availability date,
  updated_at timestamptz not null default now()
);

-- Orders
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references public.profiles (id) on delete cascade,
  listing_id uuid not null references public.listings (id) on delete restrict,
  quantity numeric not null check (quantity > 0),
  total numeric not null check (total >= 0),
  status text not null default 'Processing'
    check (status in ('Processing', 'Matched', 'In Transit', 'Delivered', 'Completed')),
  delivery_address text not null,
  delivery_district text not null,
  delivery_date date,
  payment text not null default 'Mobile Money',
  created_at timestamptz not null default now()
);

create index if not exists orders_buyer_id_idx on public.orders (buyer_id);
create index if not exists orders_listing_id_idx on public.orders (listing_id);

-- Transport jobs
create table if not exists public.transport_jobs (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  crop text not null,
  quantity numeric not null,
  pickup_district text not null,
  delivery_district text not null,
  price numeric not null,
  distance numeric,
  transporter_id uuid references public.profiles (id) on delete set null,
  ai_optimized boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists transport_jobs_listing_id_idx on public.transport_jobs (listing_id);
create index if not exists transport_jobs_transporter_id_idx on public.transport_jobs (transporter_id);

-- Trips
create table if not exists public.trips (
  id uuid primary key default gen_random_uuid(),
  transporter_id uuid not null references public.profiles (id) on delete cascade,
  listing_id uuid references public.listings (id) on delete set null,
  job_id uuid references public.transport_jobs (id) on delete set null,
  crop text not null,
  quantity numeric not null,
  from_district text not null,
  to_district text not null,
  status text not null default 'Active'
    check (status in ('Active', 'In Transit', 'Completed')),
  earnings numeric not null default 0,
  trip_date date not null default current_date,
  created_at timestamptz not null default now()
);

create index if not exists trips_transporter_id_idx on public.trips (transporter_id);
create index if not exists trips_listing_id_idx on public.trips (listing_id);

-- Helper: admin check
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and portal_role = 'admin'
  );
$$;

-- RLS
alter table public.listings enable row level security;
alter table public.transporter_profiles enable row level security;
alter table public.orders enable row level security;
alter table public.transport_jobs enable row level security;
alter table public.trips enable row level security;

-- Profiles: allow reading names for marketplace display
drop policy if exists "Authenticated users can read profiles for marketplace" on public.profiles;
create policy "Authenticated users can read profiles for marketplace"
  on public.profiles
  for select
  to authenticated
  using (true);

-- Listings
drop policy if exists "Anyone authenticated can read listings" on public.listings;
create policy "Anyone authenticated can read listings"
  on public.listings for select to authenticated using (true);

drop policy if exists "Farmers can insert own listings" on public.listings;
create policy "Farmers can insert own listings"
  on public.listings for insert to authenticated
  with check (farmer_id = auth.uid());

drop policy if exists "Farmers can update own listings" on public.listings;
create policy "Farmers can update own listings"
  on public.listings for update to authenticated
  using (farmer_id = auth.uid() or public.is_admin())
  with check (farmer_id = auth.uid() or public.is_admin());

-- Transporter profiles
drop policy if exists "Anyone authenticated can read transporter profiles" on public.transporter_profiles;
create policy "Anyone authenticated can read transporter profiles"
  on public.transporter_profiles for select to authenticated using (true);

drop policy if exists "Transporters can upsert own profile" on public.transporter_profiles;
create policy "Transporters can upsert own profile"
  on public.transporter_profiles for insert to authenticated
  with check (id = auth.uid());

drop policy if exists "Transporters can update own profile" on public.transporter_profiles;
create policy "Transporters can update own profile"
  on public.transporter_profiles for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- Orders
drop policy if exists "Buyers can read own orders" on public.orders;
create policy "Buyers can read own orders"
  on public.orders for select to authenticated
  using (buyer_id = auth.uid() or public.is_admin());

drop policy if exists "Buyers can insert own orders" on public.orders;
create policy "Buyers can insert own orders"
  on public.orders for insert to authenticated
  with check (buyer_id = auth.uid());

drop policy if exists "Buyers and admins can update orders" on public.orders;
create policy "Buyers and admins can update orders"
  on public.orders for update to authenticated
  using (buyer_id = auth.uid() or public.is_admin())
  with check (buyer_id = auth.uid() or public.is_admin());

-- Transport jobs
drop policy if exists "Anyone authenticated can read transport jobs" on public.transport_jobs;
create policy "Anyone authenticated can read transport jobs"
  on public.transport_jobs for select to authenticated using (true);

drop policy if exists "Authenticated users can insert transport jobs" on public.transport_jobs;
create policy "Authenticated users can insert transport jobs"
  on public.transport_jobs for insert to authenticated with check (true);

drop policy if exists "Transporters and admins can update transport jobs" on public.transport_jobs;
create policy "Transporters and admins can update transport jobs"
  on public.transport_jobs for update to authenticated
  using (transporter_id = auth.uid() or transporter_id is null or public.is_admin())
  with check (true);

-- Trips
drop policy if exists "Anyone authenticated can read trips" on public.trips;
create policy "Anyone authenticated can read trips"
  on public.trips for select to authenticated using (true);

drop policy if exists "Authenticated users can insert trips" on public.trips;
create policy "Authenticated users can insert trips"
  on public.trips for insert to authenticated with check (true);

drop policy if exists "Transporters can update own trips" on public.trips;
create policy "Transporters can update own trips"
  on public.trips for update to authenticated
  using (transporter_id = auth.uid() or public.is_admin())
  with check (transporter_id = auth.uid() or public.is_admin());
