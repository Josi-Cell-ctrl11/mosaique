-- ============================================================
-- Le Mosaïque — Schéma Supabase (version sécurisée, octobre 2026)
-- Identique à la migration « schema_initial_mosaique » appliquée au projet Supabase « mosaique ».
--
-- Sécurité :
--  * personne ne peut modifier is_admin, sauf un admin (trigger proteger_is_admin) ;
--  * les commandes et leurs lignes ne sont créées QUE par le serveur (clé service_role) :
--    aucune règle RLS n'autorise un client à les insérer directement ;
--  * les avis créés par un client sont toujours « non approuvés » ;
--  * numéros de commande sans doublon (verrou + max du jour).
-- ============================================================

create extension if not exists "uuid-ossp" with schema extensions;

create type public.statut_commande as enum ('en_attente_paiement','payee','en_preparation','en_livraison','livree','annulee');
create type public.statut_paiement as enum ('en_attente','paye','echoue','rembourse');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nom text not null, telephone text not null, email text not null,
  adresse text, ville text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.categories (
  id uuid primary key default extensions.uuid_generate_v4(),
  nom text not null, slug text not null unique, ordre integer not null default 0,
  created_at timestamptz not null default now()
);
create table public.plats (
  id uuid primary key default extensions.uuid_generate_v4(),
  categorie_id uuid not null references public.categories(id),
  nom text not null, slug text not null unique, description text not null, ingredients text,
  prix integer not null check (prix >= 0),
  image_url text, images_urls text[] default '{}'::text[],
  disponible boolean not null default true, est_vegetarien boolean not null default false,
  est_epice boolean not null default false, est_vedette boolean not null default false,
  ordre integer not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.options_plat (
  id uuid primary key default extensions.uuid_generate_v4(),
  plat_id uuid not null references public.plats(id) on delete cascade,
  nom text not null, type text not null, required boolean default false,
  created_at timestamptz not null default now()
);
create table public.valeurs_option (
  id uuid primary key default extensions.uuid_generate_v4(),
  option_id uuid not null references public.options_plat(id) on delete cascade,
  label text not null, prix_sup integer not null default 0,
  created_at timestamptz not null default now()
);
create table public.config_livraison (
  id uuid primary key default extensions.uuid_generate_v4(),
  type text not null default 'fixe', frais_fixe integer not null default 1000,
  delai_minutes integer not null default 45, actif boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.zones_livraison (
  id uuid primary key default extensions.uuid_generate_v4(),
  config_id uuid not null references public.config_livraison(id) on delete cascade,
  nom text not null, frais integer not null check (frais >= 0),
  created_at timestamptz not null default now()
);
create table public.commandes (
  id uuid primary key default extensions.uuid_generate_v4(),
  numero text not null unique,
  utilisateur_id uuid not null references public.profiles(id),
  statut public.statut_commande not null default 'en_attente_paiement',
  statut_paiement public.statut_paiement not null default 'en_attente',
  adresse_livraison text not null, ville_livraison text not null, telephone_livraison text not null,
  zone_livraison_id uuid references public.zones_livraison(id),
  sous_total integer not null, frais_livraison integer not null, total integer not null,
  heure_livraison timestamptz, fedapay_transaction_id text, fedapay_reference text, notes text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.lignes_commande (
  id uuid primary key default extensions.uuid_generate_v4(),
  commande_id uuid not null references public.commandes(id) on delete cascade,
  plat_id uuid references public.plats(id) on delete set null,
  nom_plat text not null, prix_unitaire integer not null,
  quantite integer not null default 1 check (quantite > 0),
  options jsonb default '{}'::jsonb, sous_total integer not null,
  created_at timestamptz not null default now()
);
create table public.avis (
  id uuid primary key default extensions.uuid_generate_v4(),
  plat_id uuid not null references public.plats(id) on delete cascade,
  utilisateur_id uuid not null references public.profiles(id),
  note integer not null check (note between 1 and 5),
  commentaire text, approuve boolean not null default false,
  created_at timestamptz not null default now()
);

create index idx_commandes_created on public.commandes (created_at desc);
create index idx_commandes_statut on public.commandes (statut);
create index idx_commandes_utilisateur on public.commandes (utilisateur_id);
create index idx_commandes_fedapay on public.commandes (fedapay_transaction_id);
create index idx_lignes_commande on public.lignes_commande (commande_id);
create index idx_lignes_plat on public.lignes_commande (plat_id);
create index idx_plats_categorie on public.plats (categorie_id);
create index idx_plats_disponible on public.plats (disponible);
create index idx_plats_vedette on public.plats (est_vedette);
create index idx_avis_plat on public.avis (plat_id);
create index idx_avis_utilisateur on public.avis (utilisateur_id);
create index idx_options_plat on public.options_plat (plat_id);
create index idx_valeurs_option on public.valeurs_option (option_id);
create index idx_zones_config on public.zones_livraison (config_id);
create index idx_commandes_zone on public.commandes (zone_livraison_id);

-- Fonctions
create or replace function public.est_admin() returns boolean
language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.profiles where id = (select auth.uid()) and is_admin = true); $$;

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public
as $$ begin
  insert into public.profiles (id, nom, telephone, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'nom', new.raw_user_meta_data->>'full_name', ''),
          coalesce(new.raw_user_meta_data->>'telephone', ''), new.email)
  on conflict (id) do nothing;
  return new;
end; $$;

create or replace function public.generer_numero_commande() returns trigger
language plpgsql security definer set search_path = public
as $$ declare jour text := to_char(now(), 'YYYYMMDD'); seq int; begin
  perform pg_advisory_xact_lock(hashtext('mosaique_numero_' || jour));
  select coalesce(max(split_part(numero, '-', 3)::int), 0) + 1 into seq
    from public.commandes where numero like 'MOS-' || jour || '-%';
  new.numero := 'MOS-' || jour || '-' || lpad(seq::text, 4, '0');
  return new;
end; $$;

create or replace function public.proteger_is_admin() returns trigger
language plpgsql security definer set search_path = public
as $$ begin
  if new.is_admin is distinct from old.is_admin
     and (select auth.uid()) is not null and not public.est_admin() then
    raise exception 'Modification des droits administrateur interdite';
  end if;
  if (select auth.uid()) = old.id and old.is_admin and not new.is_admin then
    raise exception 'Vous ne pouvez pas retirer vos propres droits administrateur';
  end if;
  new.updated_at := now();
  return new;
end; $$;

create or replace function public.maj_updated_at() returns trigger
language plpgsql set search_path = public
as $$ begin new.updated_at := now(); return new; end; $$;

create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();
create trigger set_numero_commande before insert on public.commandes for each row execute function public.generer_numero_commande();
create trigger proteger_is_admin before update on public.profiles for each row execute function public.proteger_is_admin();
create trigger maj_plats before update on public.plats for each row execute function public.maj_updated_at();
create trigger maj_commandes before update on public.commandes for each row execute function public.maj_updated_at();
create trigger maj_config before update on public.config_livraison for each row execute function public.maj_updated_at();

revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.generer_numero_commande() from public, anon, authenticated;
revoke all on function public.proteger_is_admin() from public, anon, authenticated;
revoke all on function public.est_admin() from public;
grant execute on function public.est_admin() to anon, authenticated;

-- RLS
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.plats enable row level security;
alter table public.options_plat enable row level security;
alter table public.valeurs_option enable row level security;
alter table public.config_livraison enable row level security;
alter table public.zones_livraison enable row level security;
alter table public.commandes enable row level security;
alter table public.lignes_commande enable row level security;
alter table public.avis enable row level security;

create policy "Profil : lecture" on public.profiles for select to authenticated using (id = (select auth.uid()) or public.est_admin());
create policy "Profil : modification" on public.profiles for update to authenticated using (id = (select auth.uid()) or public.est_admin()) with check (id = (select auth.uid()) or public.est_admin());
create policy "Profil : suppression admin" on public.profiles for delete to authenticated using (public.est_admin());

create policy "Catégories : lecture" on public.categories for select using (true);
create policy "Catégories : admin insert" on public.categories for insert to authenticated with check (public.est_admin());
create policy "Catégories : admin update" on public.categories for update to authenticated using (public.est_admin());
create policy "Catégories : admin delete" on public.categories for delete to authenticated using (public.est_admin());

create policy "Plats : lecture" on public.plats for select using (disponible = true or public.est_admin());
create policy "Plats : admin insert" on public.plats for insert to authenticated with check (public.est_admin());
create policy "Plats : admin update" on public.plats for update to authenticated using (public.est_admin());
create policy "Plats : admin delete" on public.plats for delete to authenticated using (public.est_admin());

create policy "Options : lecture" on public.options_plat for select using (true);
create policy "Options : admin insert" on public.options_plat for insert to authenticated with check (public.est_admin());
create policy "Options : admin update" on public.options_plat for update to authenticated using (public.est_admin());
create policy "Options : admin delete" on public.options_plat for delete to authenticated using (public.est_admin());

create policy "Valeurs : lecture" on public.valeurs_option for select using (true);
create policy "Valeurs : admin insert" on public.valeurs_option for insert to authenticated with check (public.est_admin());
create policy "Valeurs : admin update" on public.valeurs_option for update to authenticated using (public.est_admin());
create policy "Valeurs : admin delete" on public.valeurs_option for delete to authenticated using (public.est_admin());

create policy "Config : lecture" on public.config_livraison for select using (true);
create policy "Config : admin insert" on public.config_livraison for insert to authenticated with check (public.est_admin());
create policy "Config : admin update" on public.config_livraison for update to authenticated using (public.est_admin());
create policy "Config : admin delete" on public.config_livraison for delete to authenticated using (public.est_admin());

create policy "Zones : lecture" on public.zones_livraison for select using (true);
create policy "Zones : admin insert" on public.zones_livraison for insert to authenticated with check (public.est_admin());
create policy "Zones : admin update" on public.zones_livraison for update to authenticated using (public.est_admin());
create policy "Zones : admin delete" on public.zones_livraison for delete to authenticated using (public.est_admin());

create policy "Commandes : lecture" on public.commandes for select to authenticated using (utilisateur_id = (select auth.uid()) or public.est_admin());
create policy "Commandes : admin update" on public.commandes for update to authenticated using (public.est_admin());
create policy "Lignes : lecture" on public.lignes_commande for select to authenticated using (
  public.est_admin() or exists (select 1 from public.commandes c where c.id = commande_id and c.utilisateur_id = (select auth.uid())));

create policy "Avis : lecture" on public.avis for select using (approuve = true or utilisateur_id = (select auth.uid()) or public.est_admin());
create policy "Avis : création client" on public.avis for insert to authenticated with check (utilisateur_id = (select auth.uid()) and approuve = false);
create policy "Avis : admin update" on public.avis for update to authenticated using (public.est_admin());
create policy "Avis : admin delete" on public.avis for delete to authenticated using (public.est_admin());

-- Bucket photos (public en lecture, écriture réservée aux admins)
insert into storage.buckets (id, name, public) values ('photos', 'photos', true) on conflict (id) do nothing;
create policy "Photos : envoi admin" on storage.objects for insert to authenticated with check (bucket_id = 'photos' and public.est_admin());
create policy "Photos : modif admin" on storage.objects for update to authenticated using (bucket_id = 'photos' and public.est_admin());
create policy "Photos : suppression admin" on storage.objects for delete to authenticated using (bucket_id = 'photos' and public.est_admin());
