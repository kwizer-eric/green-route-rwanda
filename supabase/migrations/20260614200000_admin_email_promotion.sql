-- Promote designated admin email on signup; block self-assigned admin for others

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  assigned_portal_role text;
begin
  if lower(new.email) = lower('ijay07201@gmail.com') then
    assigned_portal_role := 'admin';
  else
    assigned_portal_role := coalesce(new.raw_user_meta_data ->> 'portal_role', 'farmer');
    if assigned_portal_role = 'admin' then
      assigned_portal_role := 'farmer';
    end if;
  end if;

  insert into public.profiles (id, full_name, portal_role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    assigned_portal_role
  );
  return new;
end;
$$;

do $$
begin
  update public.profiles p
  set portal_role = 'admin'
  from auth.users u
  where p.id = u.id
    and lower(u.email) = lower('ijay07201@gmail.com')
    and p.portal_role <> 'admin';
exception
  when others then
    raise notice 'Admin profile sync skipped: %', sqlerrm;
end;
$$;
