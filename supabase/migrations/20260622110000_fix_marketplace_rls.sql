-- Fix RLS so marketplace flows work across roles

drop policy if exists "Farmers can update own listings" on public.listings;
create policy "Marketplace participants can update listings"
  on public.listings for update to authenticated
  using (
    farmer_id = auth.uid()
    or public.is_admin()
    or exists (
      select 1 from public.orders
      where orders.listing_id = listings.id and orders.buyer_id = auth.uid()
    )
    or exists (
      select 1 from public.transport_jobs
      where transport_jobs.listing_id = listings.id
        and transport_jobs.transporter_id = auth.uid()
    )
    or exists (
      select 1 from public.trips
      where trips.listing_id = listings.id and trips.transporter_id = auth.uid()
    )
  )
  with check (true);

drop policy if exists "Buyers and admins can update orders" on public.orders;
create policy "Marketplace participants can update orders"
  on public.orders for update to authenticated
  using (
    buyer_id = auth.uid()
    or public.is_admin()
    or exists (
      select 1 from public.trips
      where trips.listing_id = orders.listing_id and trips.transporter_id = auth.uid()
    )
  )
  with check (true);
