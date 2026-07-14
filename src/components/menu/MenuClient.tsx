'use client';

import { useState, useMemo, useRef } from 'react';
import type { Plat, Categorie } from '@/types';
import { CartePlat } from './CartePlat';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface MenuClientProps {
  categories: Categorie[];
  plats: Plat[];
}

type Filtre = 'tous' | 'vegetarien' | 'epice';

// Photo éditoriale de rupture entre blocs de plats
const PHOTOS_RUPTURE = [
  {
    url: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=1400&q=80',
    legende: 'Fait maison, chaque matin.',
  },
  {
    url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1400&q=80',
    legende: 'Des saveurs qu\'on reconnaît au premier coup de fourchette.',
  },
];

export function MenuClient({ categories, plats }: MenuClientProps) {
  const [categorieActive, setCategorieActive] = useState<string>('tous');
  const [filtre, setFiltre] = useState<Filtre>('tous');
  const categoriesRef = useRef<HTMLDivElement>(null);

  const platsFiltres = useMemo(() => {
    let resultat = plats;
    if (categorieActive !== 'tous') {
      resultat = resultat.filter((p) => p.categorie_id === categorieActive);
    }
    if (filtre === 'vegetarien') {
      resultat = resultat.filter((p) => p.est_vegetarien);
    } else if (filtre === 'epice') {
      resultat = resultat.filter((p) => p.est_epice);
    }
    return resultat;
  }, [plats, categorieActive, filtre]);

  // Grouper par catégorie pour l'affichage
  const parCategorie = useMemo(() => {
    if (categorieActive !== 'tous') {
      return [{ categorie: categories.find((c) => c.id === categorieActive)!, plats: platsFiltres }];
    }
    return categories
      .map((cat) => ({
        categorie: cat,
        plats: platsFiltres.filter((p) => p.categorie_id === cat.id),
      }))
      .filter((g) => g.plats.length > 0);
  }, [categories, platsFiltres, categorieActive]);

  return (
    <>
      {/* En-tête menu */}
      <div className="bg-mosaique-terre text-white pt-10 pb-12">
        <div className="container-site">
          <h1 className="font-display text-4xl lg:text-5xl font-bold mb-3">Le menu</h1>
          <p className="text-white/70 text-lg max-w-xl">
            {plats.length} plats, cuisinés à la main chaque jour. Disponibilité selon l&apos;approvisionnement du marché.
          </p>
        </div>
      </div>

      {/* Barre de navigation catégories + filtres */}
      <div className="sticky top-16 lg:top-20 z-30 bg-mosaique-ivoire/95 backdrop-blur-sm border-b border-mosaique-creme">
        <div className="container-site">
          {/* Scroll horizontal catégories */}
          <div
            ref={categoriesRef}
            className="flex gap-1 overflow-x-auto scrollbar-none py-3 -mx-4 px-4 sm:mx-0 sm:px-0"
            role="tablist"
            aria-label="Catégories du menu"
          >
            <button
              role="tab"
              aria-selected={categorieActive === 'tous'}
              onClick={() => setCategorieActive('tous')}
              className={cn(
                'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap min-h-[40px]',
                categorieActive === 'tous'
                  ? 'bg-mosaique-ocre text-white'
                  : 'text-mosaique-gris hover:text-mosaique-nuit hover:bg-mosaique-creme'
              )}
            >
              Tout voir
            </button>
            {categories.map((cat) => {
              const nb = plats.filter((p) => p.categorie_id === cat.id).length;
              return (
                <button
                  key={cat.id}
                  role="tab"
                  aria-selected={categorieActive === cat.id}
                  onClick={() => setCategorieActive(cat.id)}
                  className={cn(
                    'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap min-h-[40px]',
                    categorieActive === cat.id
                      ? 'bg-mosaique-ocre text-white'
                      : 'text-mosaique-gris hover:text-mosaique-nuit hover:bg-mosaique-creme'
                  )}
                >
                  {cat.nom}
                  <span className="ml-1.5 opacity-60 text-xs">({nb})</span>
                </button>
              );
            })}
          </div>

          {/* Filtres */}
          <div className="flex items-center gap-2 pb-3 -mx-4 px-4 sm:mx-0 sm:px-0">
            <span className="text-xs text-mosaique-gris mr-1">Filtrer :</span>
            {([
              { value: 'tous', label: 'Tous' },
              { value: 'vegetarien', label: '🌿 Végétarien' },
              { value: 'epice', label: '🌶 Épicé' },
            ] as { value: Filtre; label: string }[]).map((f) => (
              <button
                key={f.value}
                onClick={() => setFiltre(f.value)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium transition-colors min-h-[36px]',
                  filtre === f.value
                    ? 'bg-mosaique-nuit text-white'
                    : 'bg-mosaique-creme text-mosaique-gris hover:text-mosaique-nuit'
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contenu menu */}
      <div className="container-site py-10">
        {platsFiltres.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-mosaique-gris text-lg">Aucun plat ne correspond à ce filtre.</p>
            <button
              onClick={() => { setCategorieActive('tous'); setFiltre('tous'); }}
              className="mt-4 btn-secondary"
            >
              Voir tout le menu
            </button>
          </div>
        ) : (
          <div className="space-y-16">
            {parCategorie.map((groupe, gi) => (
              <section key={groupe.categorie?.id ?? gi} aria-labelledby={`cat-${groupe.categorie?.slug}`}>
                {/* Titre de catégorie */}
                {categorieActive === 'tous' && groupe.categorie && (
                  <h2
                    id={`cat-${groupe.categorie.slug}`}
                    className="font-display text-2xl font-bold text-mosaique-terre mb-6 pb-4 border-b border-mosaique-creme"
                  >
                    {groupe.categorie.nom}
                  </h2>
                )}

                {/* Grille avec ruptures éditoriales tous les 8–12 plats */}
                <PlatsAvecRuptures plats={groupe.plats} offsetRupture={gi} />
              </section>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function PlatsAvecRuptures({
  plats,
  offsetRupture,
}: {
  plats: Plat[];
  offsetRupture: number;
}) {
  const RUPTURE_TOUS_LES = 10;
  const elements: React.ReactNode[] = [];
  let ruptureIndex = 0;

  plats.forEach((plat, i) => {
    elements.push(
      <li key={plat.id}>
        <CartePlat plat={plat} />
      </li>
    );

    // Insérer une rupture éditoriale tous les 10 plats (sauf à la fin)
    if ((i + 1) % RUPTURE_TOUS_LES === 0 && i < plats.length - 1) {
      const photo = PHOTOS_RUPTURE[(ruptureIndex + offsetRupture) % PHOTOS_RUPTURE.length];
      ruptureIndex++;
      elements.push(
        <li key={`rupture-${i}`} className="col-span-full">
          <RuptureEditoriale photo={photo.url} legende={photo.legende} />
        </li>
      );
    }
  });

  return (
    <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {elements}
    </ul>
  );
}

function RuptureEditoriale({ photo, legende }: { photo: string; legende: string }) {
  return (
    <div className="relative h-48 sm:h-64 rounded-card overflow-hidden my-2">
      <Image
        src={photo}
        alt={legende}
        fill
        className="object-cover"
        sizes="(max-width: 1280px) 100vw, 1280px"
      />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to right, rgba(28,20,16,0.7) 0%, transparent 60%)' }}
        aria-hidden="true"
      />
      <p className="absolute left-8 bottom-8 font-display text-xl font-semibold text-white max-w-sm">
        {legende}
      </p>
    </div>
  );
}
