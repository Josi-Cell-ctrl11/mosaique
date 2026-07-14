-- ============================================================
-- Mosaïque — Menu réel avec photos depuis Supabase Storage
-- ============================================================

-- Base URL photos
-- https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/

-- CATÉGORIES
insert into public.categories (id, nom, slug, ordre) values
  ('a0000001-0000-0000-0000-000000000001', 'Sandwichs',        'sandwichs',        1),
  ('a0000002-0000-0000-0000-000000000002', 'Pâtes',            'pates',            2),
  ('a0000003-0000-0000-0000-000000000003', 'Kébabs',           'kebabs',           3),
  ('a0000004-0000-0000-0000-000000000004', 'Chawarma',         'chawarma',         4),
  ('a0000005-0000-0000-0000-000000000005', 'Poulets',          'poulets',          5),
  ('a0000006-0000-0000-0000-000000000006', 'Brochettes',       'brochettes',       6),
  ('a0000007-0000-0000-0000-000000000007', 'Poissons braisés', 'poissons-braises', 7),
  ('a0000008-0000-0000-0000-000000000008', 'Gaufres',          'gaufres',          8),
  ('a0000009-0000-0000-0000-000000000009', 'Crêpes',           'crepes',           9);

-- ============================================================
-- SANDWICHS
-- ============================================================
insert into public.plats (categorie_id, nom, slug, description, prix, disponible, est_vegetarien, est_epice, est_vedette, ordre, image_url) values
('a0000001-0000-0000-0000-000000000001', 'Sandwich poulet BBQ',      'sandwich-poulet-bbq',      'Sandwich généreux au poulet grillé façon BBQ, sauce maison, légumes frais.',                    3500, true, false, false, false, 1, 'https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/Sandwich.jpeg'),
('a0000001-0000-0000-0000-000000000001', 'Sandwich poulet piquant',  'sandwich-poulet-piquant',  'Poulet mariné aux épices pimentées, garni de légumes croquants et sauce relevée.',              3500, true, false, true,  false, 2, 'https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/Sandwich.jpeg'),
('a0000001-0000-0000-0000-000000000001', 'Sandwich langue de bœuf', 'sandwich-langue-boeuf',    'Tranches de langue de bœuf fondantes, moutarde et cornichons dans un pain moelleux.',         3000, true, false, false, false, 3, 'https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/Sandwich.jpeg'),
('a0000001-0000-0000-0000-000000000001', 'Sandwich frites',          'sandwich-frites',          'Sandwich garni de frites croustillantes, sauce ketchup-mayo maison.',                          2000, true, true,  false, false, 4, 'https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/Sandwich.jpeg'),
('a0000001-0000-0000-0000-000000000001', 'Chicken Sub',              'chicken-sub',              'Sub au poulet grillé, salade, tomate, oignon et sauce spéciale Mosaïque.',                     3500, true, false, false, true,  5, 'https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/Sandwich.jpeg'),
('a0000001-0000-0000-0000-000000000001', 'Steak Sub',                'steak-sub',                'Sub au steak de bœuf émincé, poivrons sautés, fromage fondu et sauce maison.',                3500, true, false, false, false, 6, 'https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/Sandwich.jpeg'),
('a0000001-0000-0000-0000-000000000001', 'Hot Dog',                  'hot-dog',                  'Saucisse grillée dans un pain brioché, moutarde, ketchup et oignons.',                         2000, true, false, false, false, 7, 'https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/Sandwich.jpeg'),
('a0000001-0000-0000-0000-000000000001', 'Brochette de bœuf roulé', 'brochette-boeuf-roule',    'Bœuf mariné roulé en brochette, servi dans un pain avec sauce arachide.',                     2500, true, false, false, false, 8, 'https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/Sandwich.jpeg'),
('a0000001-0000-0000-0000-000000000001', '@MOSAÏQUE Hot Dog',        'mosaique-hot-dog',         'La version signature Mosaïque — saucisse XXL, garnitures généreuses, sauce exclusive.',        3500, true, false, false, true,  9, 'https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/Sandwich.jpeg');

-- ============================================================
-- PÂTES
-- ============================================================
insert into public.plats (categorie_id, nom, slug, description, prix, disponible, est_vegetarien, est_epice, est_vedette, ordre, image_url) values
('a0000002-0000-0000-0000-000000000002', 'Spaghetti sauce provençale', 'spaghetti-provencale',  'Spaghetti al dente dans une sauce provençale tomate-herbes, parfumée à l''ail et au basilic.', 3500, true, true,  false, false, 1, 'https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/Pate.jpeg'),
('a0000002-0000-0000-0000-000000000002', 'Spaghetti bolognaise',       'spaghetti-bolognaise',  'Spaghetti avec une bolognaise de bœuf mijotée lentement, sauce tomate riche.',                 3500, true, false, false, true,  2, 'https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/Pate.jpeg'),
('a0000002-0000-0000-0000-000000000002', 'Spaghetti al pesto',         'spaghetti-pesto',       'Spaghetti enrobés d''un pesto basilic-parmesan maison, noix de pin.',                           3000, true, true,  false, false, 3, 'https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/Pate.jpeg'),
('a0000002-0000-0000-0000-000000000002', 'Penne forestière',           'penne-forestiere',      'Penne aux champignons des bois, crème fraîche, ail et persil.',                                 4000, true, true,  false, false, 4, 'https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/Pate.jpeg'),
('a0000002-0000-0000-0000-000000000002', 'Penne aux fruits de mer',    'penne-fruits-de-mer',   'Penne avec crevettes, calamars et moules dans une sauce tomate-crème parfumée.',                4500, true, false, false, true,  5, 'https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/Pate.jpeg'),
('a0000002-0000-0000-0000-000000000002', 'Farfalle MC Bouffe',         'farfalle-mc-bouffe',    'Farfalle en sauce crémeuse au poulet grillé et légumes de saison.',                             4000, true, false, false, false, 6, 'https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/Pate.jpeg'),
('a0000002-0000-0000-0000-000000000002', '@MOSAÏQUE Spaghetti',        'mosaique-spaghetti',    'La signature Mosaïque — spaghetti en sauce spéciale maison, garniture généreuse.',              3500, true, false, false, true,  7, 'https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/Pate.jpeg');

-- ============================================================
-- KÉBABS
-- ============================================================
insert into public.plats (categorie_id, nom, slug, description, prix, disponible, est_vegetarien, est_epice, est_vedette, ordre, image_url) values
('a0000003-0000-0000-0000-000000000003', 'Kébab Mouton',     'kebab-mouton',     'Kébab de mouton mariné aux épices orientales, servi avec frites ou riz au choix.',          3000, true, false, false, false, 1, 'https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/Kebab.jpeg'),
('a0000003-0000-0000-0000-000000000003', 'Kébab Bœuf',      'kebab-boeuf',      'Kébab de bœuf haché épicé, garni de légumes frais et sauce yaourt.',                        4000, true, false, false, true,  2, 'https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/Kebab.jpeg'),
('a0000003-0000-0000-0000-000000000003', 'Kébab Poulet',     'kebab-poulet',     'Kébab de poulet mariné au citron et herbes, légumes croquants, sauce blanche.',             2500, true, false, false, false, 3, 'https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/Kebab.jpeg'),
('a0000003-0000-0000-0000-000000000003', 'Kébab Azmarlé',    'kebab-azmarle',    'Kébab façon Azmarlé — viande mixte, épices locales, sauce signature.',                     3500, true, false, true,  false, 4, 'https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/Kebab.jpeg'),
('a0000003-0000-0000-0000-000000000003', 'Kébab Antablé',    'kebab-antable',    'Kébab Antablé — préparation traditionnelle, viande tendre et marinée.',                    3000, true, false, false, false, 5, 'https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/Kebab.jpeg'),
('a0000003-0000-0000-0000-000000000003', 'Kébab Khichkhach', 'kebab-khichkhach', 'Kébab Khichkhach — viande finement hachée avec épices maison.',                            3000, true, false, true,  false, 6, 'https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/Kebab.jpeg'),
('a0000003-0000-0000-0000-000000000003', '@MOSAÏQUE Kébab',  'mosaique-kebab',   'Le kébab signature Mosaïque — viande premium, sauce exclusive, garniture complète.',       4000, true, false, false, true,  7, 'https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/Kebab.jpeg');

-- ============================================================
-- CHAWARMA
-- ============================================================
insert into public.plats (categorie_id, nom, slug, description, prix, disponible, est_vegetarien, est_epice, est_vedette, ordre, image_url) values
('a0000004-0000-0000-0000-000000000004', 'Chawarma Poulet',       'chawarma-poulet',       'Chawarma de poulet mariné aux épices orientales, servi en pain pita avec légumes et sauce.',  3000, true, false, false, true,  1, 'https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/Chawarma.jpeg'),
('a0000004-0000-0000-0000-000000000004', 'Chawarma Bœuf',        'chawarma-boeuf',        'Chawarma de bœuf mariné, viande fondante, sauce blanche et légumes croquants.',               3500, true, false, false, false, 2, 'https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/Chawarma.jpeg'),
('a0000004-0000-0000-0000-000000000004', 'Chawarma Mixte',        'chawarma-mixte',        'Mélange poulet et bœuf, double sauce, garniture complète.',                                    3500, true, false, false, false, 3, 'https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/Chawarma.jpeg'),
('a0000004-0000-0000-0000-000000000004', '@MOSAÏQUE Chawarma',    'mosaique-chawarma',     'Le chawarma signature Mosaïque — viande premium, sauce exclusive maison.',                    4000, true, false, false, true,  4, 'https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/Chawarma.jpeg');

-- ============================================================
-- POULETS
-- ============================================================
insert into public.plats (categorie_id, nom, slug, description, prix, disponible, est_vegetarien, est_epice, est_vedette, ordre, image_url) values
('a0000005-0000-0000-0000-000000000005', 'Poulet braisé entier', 'poulet-braise-entier', 'Poulet fermier entier mariné et braisé au charbon de bois — peau croustillante, chair juteuse.', 8000,  true, false, false, true,  1, 'https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/Poulets.jpeg'),
('a0000005-0000-0000-0000-000000000005', 'Poulet rôti entier',   'poulet-roti-entier',   'Poulet entier rôti lentement aux herbes et ail, servi avec son jus.',                            10000, true, false, false, false, 2, 'https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/Poulets.jpeg'),
('a0000005-0000-0000-0000-000000000005', 'Demi poulet braisé',   'demi-poulet-braise',   'Demi-poulet braisé au charbon, mariné 24h. Servi avec accompagnement au choix.',                 4500,  true, false, false, true,  3, 'https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/Poulets.jpeg'),
('a0000005-0000-0000-0000-000000000005', 'Demi poulet rôti',     'demi-poulet-roti',     'Demi-poulet rôti aux herbes, tendre et parfumé.',                                                 5500,  true, false, false, false, 4, 'https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/Poulets.jpeg'),
('a0000005-0000-0000-0000-000000000005', 'Poulet entier grillé', 'poulet-entier-grille', 'Poulet entier grillé sur braise vive, assaisonné aux épices maison.',                            9000,  true, false, false, false, 5, 'https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/Poulets.jpeg'),
('a0000005-0000-0000-0000-000000000005', 'Demi poulet grillé',   'demi-poulet-grille',   'Demi-poulet grillé à point, croustillant en surface, moelleux à l''intérieur.',                  5000,  true, false, false, false, 6, 'https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/Poulets.jpeg'),
('a0000005-0000-0000-0000-000000000005', 'Poulet entier fumé',   'poulet-entier-fume',   'Poulet entier fumé lentement aux bois aromatiques — saveur profonde et unique.',                 11000, true, false, false, false, 7, 'https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/Poulets.jpeg'),
('a0000005-0000-0000-0000-000000000005', 'Demi poulet fumé',     'demi-poulet-fume',     'Demi-poulet fumé, texture fondante et arômes boisés.',                                           6000,  true, false, false, false, 8, 'https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/Poulets.jpeg');

-- ============================================================
-- BROCHETTES
-- ============================================================
insert into public.plats (categorie_id, nom, slug, description, prix, disponible, est_vegetarien, est_epice, est_vedette, ordre, image_url) values
('a0000006-0000-0000-0000-000000000006', 'Brochettes de mouton',            'brochettes-mouton',        'Brochettes de mouton marinées aux épices, grillées sur braise vive.',                       8000, true, false, false, true,  1, 'https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/Brochettes.jpeg'),
('a0000006-0000-0000-0000-000000000006', 'Brochettes de bœuf',             'brochettes-boeuf',         'Brochettes de bœuf tendre, marinées au gingembre et herbes, grillées à point.',            7000, true, false, false, false, 2, 'https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/Brochettes.jpeg'),
('a0000006-0000-0000-0000-000000000006', 'Brochettes de gésiers de dinde', 'brochettes-gesiers-dinde', 'Gésiers de dinde marinés et grillés en brochettes — saveur intense.',                       6000, true, false, false, false, 3, 'https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/Brochettes.jpeg'),
('a0000006-0000-0000-0000-000000000006', 'Brochettes de gésiers de poule', 'brochettes-gesiers-poule', 'Gésiers de poule en brochettes, marinés aux épices et grillés sur charbon.',                5000, true, false, false, false, 4, 'https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/Brochettes.jpeg'),
('a0000006-0000-0000-0000-000000000006', 'Brochettes de blanc de poulet',  'brochettes-blanc-poulet',  'Blanc de poulet en brochettes, marinade citron-herbes, grillé moelleux.',                   5000, true, false, false, false, 5, 'https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/Brochettes.jpeg'),
('a0000006-0000-0000-0000-000000000006', 'Brochettes de filet de poisson', 'brochettes-filet-poisson', 'Filet de poisson frais en brochettes, épices douces, grillé sur braise.',                  6500, true, false, false, false, 6, 'https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/Brochettes.jpeg'),
('a0000006-0000-0000-0000-000000000006', 'Brochettes de saucisses',        'brochettes-saucisses',     'Saucisses maison en brochettes, grillées et servies avec sauce pimentée.',                  3000, true, false, false, false, 7, 'https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/Brochettes.jpeg'),
('a0000006-0000-0000-0000-000000000006', 'Brochettes d''ailerons',         'brochettes-ailerons',      'Ailerons de poulet marinés et grillés en brochettes — croustillants et savoureux.',         7000, true, false, false, false, 8, 'https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/Brochettes.jpeg');

-- ============================================================
-- POISSONS BRAISÉS
-- ============================================================
insert into public.plats (categorie_id, nom, slug, description, prix, disponible, est_vegetarien, est_epice, est_vedette, ordre, image_url) values
('a0000007-0000-0000-0000-000000000007', 'Bar braisé',                     'bar-braise',                  'Bar entier braisé sur charbon de bois, arrosé de sauce oignon-tomate fraîche.',          8000,  true, false, false, false, 1, 'https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/Poisson.jpeg'),
('a0000007-0000-0000-0000-000000000007', 'Dorade braisée',                 'dorade-braisee',              'Dorade royale entière braisée, marinée aux épices et citron, sauce maison.',             8000,  true, false, false, true,  2, 'https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/Poisson.jpeg'),
('a0000007-0000-0000-0000-000000000007', 'Carpe rouge braisée',            'carpe-rouge-braisee',         'Carpe rouge entière braisée lentement, chair fondante et peau dorée.',                  7000,  true, false, false, false, 3, 'https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/Poisson.jpeg'),
('a0000007-0000-0000-0000-000000000007', 'Tilapia braisé',                 'tilapia-braise',              'Tilapia entier braisé au charbon, servi avec sauce tomate-oignon pimentée.',            6000,  true, false, true,  false, 4, 'https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/Poisson.jpeg'),
('a0000007-0000-0000-0000-000000000007', 'Sol braisé',                     'sol-braise',                  'Poisson sol braisé, délicat et savoureux, sauce légère aux herbes.',                    5000,  true, false, false, false, 5, 'https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/Poisson.jpeg'),
('a0000007-0000-0000-0000-000000000007', 'MTN braisé',                     'mtn-braise',                  'MTN braisé — poisson populaire de la région, préparé à la façon Mosaïque.',             5000,  true, false, false, false, 6, 'https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/Poisson.jpeg'),
('a0000007-0000-0000-0000-000000000007', 'Poisson de table entier braisé', 'poisson-table-entier-braise', 'Grand poisson de table entier braisé — plat de fête pour partager en famille.',        30000, true, false, false, false, 7, 'https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/Poisson.jpeg');

-- ============================================================
-- GAUFRES
-- ============================================================
insert into public.plats (categorie_id, nom, slug, description, prix, disponible, est_vegetarien, est_epice, est_vedette, ordre, image_url) values
('a0000008-0000-0000-0000-000000000008', 'Gaufre au sucre',          'gaufre-sucre',            'Gaufre croustillante saupoudrée de sucre glace, servie chaude.',                        2500, true, true, false, false, 1, 'https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/Gaufres.jpeg'),
('a0000008-0000-0000-0000-000000000008', 'Gaufre au chocolat',       'gaufre-chocolat',         'Gaufre nappée de chocolat fondu chaud, généreuse et gourmande.',                        3000, true, true, false, false, 2, 'https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/Gaufres.jpeg'),
('a0000008-0000-0000-0000-000000000008', 'Gaufre chocolat banane',   'gaufre-chocolat-banane',  'Gaufre avec chocolat fondu et tranches de banane fraîche.',                             3500, true, true, false, true,  3, 'https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/Gaufres.jpeg'),
('a0000008-0000-0000-0000-000000000008', 'Gaufre au miel',           'gaufre-miel',             'Gaufre dorée nappée de miel naturel, légère et parfumée.',                             3000, true, true, false, false, 4, 'https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/Gaufres.jpeg'),
('a0000008-0000-0000-0000-000000000008', 'Gaufre à la confiture',    'gaufre-confiture',        'Gaufre garnie de confiture maison au choix.',                                           3000, true, true, false, false, 5, 'https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/Gaufres.jpeg'),
('a0000008-0000-0000-0000-000000000008', 'Gaufre St Georges',        'gaufre-st-georges',       'Gaufre garnie façon St Georges — crème, fruits et touche de chocolat.',                 4000, true, true, false, false, 6, 'https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/Gaufres.jpeg'),
('a0000008-0000-0000-0000-000000000008', 'Gaufre spéciale MOSAÏQUE', 'gaufre-speciale-mosaique','La signature — gaufre XXL avec garnitures multiples, sauce exclusive Mosaïque.',        4000, true, true, false, true,  7, 'https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/Gaufres.jpeg');

-- ============================================================
-- CRÊPES
-- ============================================================
insert into public.plats (categorie_id, nom, slug, description, prix, disponible, est_vegetarien, est_epice, est_vedette, ordre, image_url) values
('a0000009-0000-0000-0000-000000000009', 'Crêpe au fromage',      'crepe-fromage',        'Crêpe fine garnie de fromage fondu, dorée à point.',                                   2000, true, true,  false, false, 1,  'https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/Crepes.jpeg'),
('a0000009-0000-0000-0000-000000000009', 'Crêpe au jambon',       'crepe-jambon',         'Crêpe garnie de jambon blanc et légèrement beurrée.',                                  1500, true, false, false, false, 2,  'https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/Crepes.jpeg'),
('a0000009-0000-0000-0000-000000000009', 'Crêpe jambon fromage',  'crepe-jambon-fromage', 'Crêpe garnie de jambon et fromage fondant — la combinaison classique.',                2500, true, false, false, true,  3,  'https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/Crepes.jpeg'),
('a0000009-0000-0000-0000-000000000009', 'Crêpe paysane',         'crepe-paysane',        'Crêpe garnie d''œuf, jambon, fromage et champignons.',                                 3000, true, false, false, false, 4,  'https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/Crepes.jpeg'),
('a0000009-0000-0000-0000-000000000009', 'Crêpe complète',        'crepe-complete',       'La complète — œuf, jambon, fromage, et garniture du moment.',                         3500, true, false, false, false, 5,  'https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/Crepes.jpeg'),
('a0000009-0000-0000-0000-000000000009', '@MOSAÏQUE Crêpes',      'mosaique-crepe-salee', 'La crêpe signature Mosaïque façon salée — garniture maison exclusive.',               2500, true, false, false, false, 6,  'https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/Crepes.jpeg'),
('a0000009-0000-0000-0000-000000000009', 'Crêpe au sucre',        'crepe-sucre',          'Crêpe fine saupoudrée de sucre, simple et délicieuse.',                               1000, true, true,  false, false, 7,  'https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/Crepes.jpeg'),
('a0000009-0000-0000-0000-000000000009', 'Crêpe Nutella',         'crepe-nutella',        'Crêpe généreusement garnie de Nutella — le classique indémodable.',                   2000, true, true,  false, true,  8,  'https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/Crepes.jpeg'),
('a0000009-0000-0000-0000-000000000009', 'Crêpe chocolat banane', 'crepe-chocolat-banane','Crêpe avec chocolat fondu et tranches de banane fraîche.',                            2500, true, true,  false, false, 9,  'https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/Crepes.jpeg'),
('a0000009-0000-0000-0000-000000000009', 'Crêpe au miel',         'crepe-miel',           'Crêpe nappée de miel naturel, chaude et parfumée.',                                   2000, true, true,  false, false, 10, 'https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/Crepes.jpeg'),
('a0000009-0000-0000-0000-000000000009', 'Crêpe à la confiture',  'crepe-confiture',      'Crêpe garnie de confiture maison, légère et fruitée.',                                2500, true, true,  false, false, 11, 'https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/Crepes.jpeg'),
('a0000009-0000-0000-0000-000000000009', '#MOSAÏQUE Crêpes',      'mosaique-crepe-sucree','La crêpe signature Mosaïque sucrée — garniture surprise maison.',                     1500, true, true,  false, true,  12, 'https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/Crepes.jpeg');
