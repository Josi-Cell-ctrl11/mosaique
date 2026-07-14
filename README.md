# Mosaïque — Site de commande en ligne

Un site de commande de nourriture en ligne, entièrement en français, avec paiement FedaPay et livraison en FCFA.

## Stack

| Couche | Outil |
|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript |
| Styles | Tailwind CSS |
| State (panier) | Zustand (persisté localStorage) |
| Base de données | Supabase (Postgres) |
| Auth | Supabase Auth |
| Stockage photos | Supabase Storage |
| Paiement | FedaPay |
| Notifications | Novu |
| Hébergement | Cloudflare Pages |

---

## Installation

```bash
npm install
```

Puis copier `.env.local` et remplir les clés :

```bash
cp .env.local.example .env.local
```

---

## Variables d'environnement

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL de votre projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé anonyme Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé service role (côté serveur uniquement) |
| `FEDAPAY_SECRET_KEY` | Clé secrète FedaPay |
| `NEXT_PUBLIC_FEDAPAY_PUBLIC_KEY` | Clé publique FedaPay |
| `FEDAPAY_ENVIRONMENT` | `sandbox` ou `production` |
| `NOVU_API_KEY` | Clé API Novu |
| `NEXT_PUBLIC_APP_URL` | URL publique du site (pour les redirections) |
| `ADMIN_EMAIL` | Email de l'admin pour les notifications |

---

## Supabase — Mise en place

1. Créer un projet sur [supabase.com](https://supabase.com)
2. Dans **SQL Editor**, exécuter `supabase/schema.sql`
3. Puis exécuter `supabase/seed.sql` pour le menu placeholder
4. Dans **Storage**, créer un bucket public nommé `photos`
5. Dans **Authentication > Settings**, configurer l'URL du site

### ⚠️ Plan gratuit Supabase
Le projet est mis en pause après **7 jours d'inactivité**. Pour éviter ça en production :
- Activer un ping via [UptimeRobot](https://uptimerobot.com) (gratuit, ping toutes les 5 min)
- Ou passer au plan Pro (~25$/mois) dès que de vraies commandes arrivent

---

## FedaPay — Configuration

1. Créer un compte sur [fedapay.com](https://fedapay.com)
2. Récupérer les clés API dans le dashboard
3. Configurer le webhook vers : `https://votre-site.com/api/fedapay/webhook`
4. Passer `FEDAPAY_ENVIRONMENT=production` au lancement

---

## Novu — Workflows à créer

Dans le dashboard Novu, créer 3 workflows :

| ID workflow | Déclencheur | Canal |
|---|---|---|
| `mosaique-commande-confirmee` | Paiement confirmé | Email + SMS |
| `mosaique-statut-change` | Changement de statut commande | Email + SMS |
| `mosaique-admin-nouvelle-commande` | Nouvelle commande | Email |

Variables disponibles dans les templates :
- `{{nom}}` — nom du client
- `{{numero}}` — numéro de commande (ex: MOS-20240714-0001)
- `{{url}}` — lien vers la commande
- `{{statut}}` — message de statut
- `{{delai}}` — délai estimé

---

## Développement local

```bash
npm run dev
```

Le site tourne sur [http://localhost:3000](http://localhost:3000)
L'admin est accessible sur [http://localhost:3000/admin](http://localhost:3000/admin)

Pour accéder à l'admin, passer `is_admin = true` sur votre profil dans Supabase.

---

## Déploiement Cloudflare Pages

1. Connecter le repo GitHub à Cloudflare Pages
2. Build command : `npm run build`
3. Build output : `.next`
4. Framework preset : `Next.js`
5. Ajouter toutes les variables d'environnement dans Cloudflare Pages Settings

---

## Remplacer le contenu placeholder

Tout le contenu (plats, photos, descriptions, prix) est modifiable via `/admin/plats` sans toucher au code.

Pour chaque plat :
1. Uploader la vraie photo via l'interface admin
2. Modifier le nom, la description, les ingrédients, le prix
3. Activer/désactiver selon la disponibilité

---

## Structure du projet

```
src/
├── app/
│   ├── page.tsx              # Accueil
│   ├── menu/                 # Menu + fiches plats
│   ├── checkout/             # Tunnel de commande
│   ├── commande/             # Confirmation
│   ├── compte/               # Espace client
│   ├── admin/                # Back-office
│   └── api/                  # Routes API
├── components/
│   ├── accueil/              # Hero, PlatVedette, Histoire…
│   ├── menu/                 # CartePlat, FichePlat, MenuClient
│   ├── panier/               # Drawer panier
│   ├── checkout/             # Formulaire checkout
│   ├── compte/               # Espace client UI
│   ├── admin/                # Back-office UI
│   └── layout/               # Navigation, Footer
├── lib/
│   ├── supabase/             # Clients server/client
│   ├── notifications.ts      # Novu
│   └── utils.ts              # Helpers
├── store/
│   └── panier.ts             # Zustand
└── types/
    └── index.ts              # Types TypeScript
supabase/
├── schema.sql                # Schéma complet
└── seed.sql                  # Menu placeholder (25+ plats)
```
