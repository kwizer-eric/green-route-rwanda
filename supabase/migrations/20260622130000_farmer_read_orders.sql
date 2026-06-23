-- Farmers can read orders placed on their listings

drop policy if exists "Buyers can read own orders" on public.orders;
drop policy if exists "Marketplace participants can update orders" on public.orders;

create policy "Role participants can read orders"
  on public.orders for select to authenticated
  using (
    buyer_id = auth.uid()
    or public.is_admin()
    or exists (
      select 1 from public.listings
      where listings.id = orders.listing_id and listings.farmer_id = auth.uid()
    )
  );

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
