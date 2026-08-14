-- Durcir les fonctions SECURITY DEFINER utilisées par l’admin et le trigger de commande.
create or replace function public.est_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and is_admin = true
  );
$$;

revoke all on function public.est_admin() from public;
grant execute on function public.est_admin() to authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, nom, telephone, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nom', ''),
    coalesce(new.raw_user_meta_data->>'telephone', ''),
    new.email
  );
  return new;
end;
$$;

create or replace function public.generer_numero_commande()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  seq int;
begin
  select count(*) + 1 into seq
  from public.commandes
  where date_trunc('day', created_at) = date_trunc('day', now());
  new.numero := 'MOS-' || to_char(now(), 'YYYYMMDD') || '-' || lpad(seq::text, 4, '0');
  return new;
end;
$$;
