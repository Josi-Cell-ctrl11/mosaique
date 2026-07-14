-- ============================================================
-- Mosaïque — Schéma Supabase
-- ============================================================

-- Extension pour UUID
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILS UTILISATEURS
-- (complète la table auth.users de Supabase)
-- ============================================================
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  nom         text not null,
  telephone   text not null,
  email       text not null,
  adresse     text,
  ville       text,
  is_admin    boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- RLS
alter table public.profiles enable row level security;

create policy "Un utilisateur voit son propre profil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Un utilisateur modifie son propre profil"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Admins voient tous les profils"
  on public.profiles for all
  using (
    (select is_admin from public.profiles where id = auth.uid()) = true
  );

-- Trigger : créer un profil vide à l'inscription
create or replace function public.handle_new_user()
returns trigger as $$
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
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- CATÉGORIES DE PLATS
-- ============================================================
create table public.categories (
  id          uuid primary key default uuid_generate_v4(),
  nom         text not null,
  slug        text not null unique,
  ordre       int not null default 0,
  created_at  timestamptz not null default now()
);

alter table public.categories enable row level security;

create policy "Tout le monde lit les catégories"
  on public.categories for select using (true);

create policy "Admins gèrent les catégories"
  on public.categories for all
  using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

-- ============================================================
-- PLATS
-- ============================================================
create table public.plats (
  id              uuid primary key default uuid_generate_v4(),
  categorie_id    uuid not null references public.categories(id),
  nom             text not null,
  slug            text not null unique,
  description     text not null,
  ingredients     text,
  prix            int not null, -- en FCFA, entier
  image_url       text,
  images_urls     text[] default '{}',
  disponible      boolean not null default true,
  est_vegetarien  boolean not null default false,
  est_epice       boolean not null default false,
  est_vedette     boolean not null default false,  -- mis en avant sur l'accueil
  ordre           int not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table public.plats enable row level security;

create policy "Tout le monde lit les plats disponibles"
  on public.plats for select using (disponible = true or
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

create policy "Admins gèrent les plats"
  on public.plats for all
  using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

-- ============================================================
-- OPTIONS DE PLAT (taille, épice, suppléments)
-- ============================================================
create table public.options_plat (
  id         uuid primary key default uuid_generate_v4(),
  plat_id    uuid not null references public.plats(id) on delete cascade,
  nom        text not null,        -- ex: "Taille", "Niveau d'épice"
  type       text not null,        -- 'select' | 'checkbox'
  required   boolean default false,
  created_at timestamptz not null default now()
);

create table public.valeurs_option (
  id         uuid primary key default uuid_generate_v4(),
  option_id  uuid not null references public.options_plat(id) on delete cascade,
  label      text not null,
  prix_sup   int not null default 0, -- supplément en FCFA
  created_at timestamptz not null default now()
);

alter table public.options_plat enable row level security;
alter table public.valeurs_option enable row level security;

create policy "Lecture options" on public.options_plat for select using (true);
create policy "Lecture valeurs" on public.valeurs_option for select using (true);

create policy "Admin gère options" on public.options_plat for all
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));
create policy "Admin gère valeurs" on public.valeurs_option for all
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

-- ============================================================
-- CONFIGURATION LIVRAISON (admin configurable)
-- ============================================================
create table public.config_livraison (
  id              uuid primary key default uuid_generate_v4(),
  type            text not null default 'fixe', -- 'fixe' | 'par_zone'
  frais_fixe      int not null default 1000,    -- FCFA
  delai_minutes   int not null default 45,
  actif           boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table public.zones_livraison (
  id         uuid primary key default uuid_generate_v4(),
  config_id  uuid not null references public.config_livraison(id) on delete cascade,
  nom        text not null,
  frais      int not null,  -- FCFA
  created_at timestamptz not null default now()
);

alter table public.config_livraison enable row level security;
alter table public.zones_livraison enable row level security;

create policy "Lecture config livraison" on public.config_livraison for select using (true);
create policy "Lecture zones" on public.zones_livraison for select using (true);

create policy "Admin config livraison" on public.config_livraison for all
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));
create policy "Admin zones" on public.zones_livraison for all
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

-- Insérer une config par défaut
insert into public.config_livraison (type, frais_fixe, delai_minutes)
values ('fixe', 1000, 45);

-- ============================================================
-- COMMANDES
-- ============================================================
create type statut_commande as enum (
  'en_attente_paiement',
  'payee',
  'en_preparation',
  'en_livraison',
  'livree',
  'annulee'
);

create type statut_paiement as enum (
  'en_attente',
  'paye',
  'echoue',
  'rembourse'
);

create table public.commandes (
  id                  uuid primary key default uuid_generate_v4(),
  numero              text not null unique, -- ex: MOS-20240714-0001
  utilisateur_id      uuid not null references public.profiles(id),
  statut              statut_commande not null default 'en_attente_paiement',
  statut_paiement     statut_paiement not null default 'en_attente',

  -- Adresse de livraison (copiée au moment de la commande)
  adresse_livraison   text not null,
  ville_livraison     text not null,
  telephone_livraison text not null,
  zone_livraison_id   uuid references public.zones_livraison(id),

  -- Montants (en FCFA)
  sous_total          int not null,
  frais_livraison     int not null,
  total               int not null,

  -- Heure souhaitée
  heure_livraison     timestamptz,

  -- FedaPay
  fedapay_transaction_id text,
  fedapay_reference      text,

  -- Notes
  notes               text,

  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

alter table public.commandes enable row level security;

create policy "Un client voit ses commandes"
  on public.commandes for select
  using (auth.uid() = utilisateur_id);

create policy "Un client crée une commande"
  on public.commandes for insert
  with check (auth.uid() = utilisateur_id);

create policy "Admin voit toutes les commandes"
  on public.commandes for all
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

-- ============================================================
-- LIGNES DE COMMANDE
-- ============================================================
create table public.lignes_commande (
  id           uuid primary key default uuid_generate_v4(),
  commande_id  uuid not null references public.commandes(id) on delete cascade,
  plat_id      uuid references public.plats(id) on delete set null,
  nom_plat     text not null,  -- copie au moment de la commande
  prix_unitaire int not null,  -- copie au moment de la commande
  quantite     int not null default 1,
  options      jsonb default '{}',  -- options choisies
  sous_total   int not null,
  created_at   timestamptz not null default now()
);

alter table public.lignes_commande enable row level security;

create policy "Un client voit ses lignes"
  on public.lignes_commande for select
  using (
    exists (
      select 1 from public.commandes c
      where c.id = commande_id and c.utilisateur_id = auth.uid()
    )
  );

create policy "Un client insère ses lignes"
  on public.lignes_commande for insert
  with check (
    exists (
      select 1 from public.commandes c
      where c.id = commande_id and c.utilisateur_id = auth.uid()
    )
  );

create policy "Admin gère les lignes"
  on public.lignes_commande for all
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

-- ============================================================
-- AVIS CLIENTS
-- ============================================================
create table public.avis (
  id           uuid primary key default uuid_generate_v4(),
  plat_id      uuid not null references public.plats(id) on delete cascade,
  utilisateur_id uuid not null references public.profiles(id),
  note         int not null check (note between 1 and 5),
  commentaire  text,
  approuve     boolean not null default false,
  created_at   timestamptz not null default now()
);

alter table public.avis enable row level security;

create policy "Tout le monde lit les avis approuvés"
  on public.avis for select using (approuve = true);

create policy "Un client crée un avis"
  on public.avis for insert
  with check (auth.uid() = utilisateur_id);

create policy "Admin gère les avis"
  on public.avis for all
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

-- ============================================================
-- INDEXES
-- ============================================================
create index idx_plats_categorie on public.plats(categorie_id);
create index idx_plats_disponible on public.plats(disponible);
create index idx_plats_vedette on public.plats(est_vedette);
create index idx_commandes_utilisateur on public.commandes(utilisateur_id);
create index idx_commandes_statut on public.commandes(statut);
create index idx_commandes_created on public.commandes(created_at desc);
create index idx_lignes_commande on public.lignes_commande(commande_id);

-- ============================================================
-- FONCTION : générer un numéro de commande lisible
-- ============================================================
create or replace function public.generer_numero_commande()
returns trigger as $$
declare
  seq int;
begin
  select count(*) + 1 into seq
  from public.commandes
  where date_trunc('day', created_at) = date_trunc('day', now());

  new.numero := 'MOS-' || to_char(now(), 'YYYYMMDD') || '-' || lpad(seq::text, 4, '0');
  return new;
end;
$$ language plpgsql security definer;

create trigger set_numero_commande
  before insert on public.commandes
  for each row execute function public.generer_numero_commande();
