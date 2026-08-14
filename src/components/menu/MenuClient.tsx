'use client';

import { useMemo, useState } from 'react';
import type { Plat, Categorie } from '@/types';
import { CartePlat } from './CartePlat';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { ArrowLeft, ChevronRight, Flame, Leaf, UtensilsCrossed } from 'lucide-react';

interface MenuClientProps {
  categories: Categorie[];
  plats: Plat[];
}

type Filtre = 'tous' | 'vegetarien' | 'epice';

// Photo éditoriale de rupture entre blocs de plats.
const PHOTOS_RUPTURE = [
  {
    url: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=1400&q=80',
    legende: 'Fait maison, chaque matin.',
  },
  {
    url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1400&q=80',
    legende: "Des saveurs qu'on reconnaît au premier coup de fourchette.",
  },
];

export function MenuClient({ categories, plats }: MenuClientProps) {
  const [categorieActive, setCategorieActive] = useState<string>('tous');
  const [filtre, setFiltre] = useState<Filtre>('tous');
  const [vueFamilles, setVueFamilles] = useState(true);

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

  const parCategorie = useMemo(() => {
    if (categorieActive !== 'tous') {
      const categorie = categories.find((c) => c.id === categorieActive);
      return categorie ? [{ categorie, plats: platsFiltres }] : [];
    }
    return categories
      .map((cat) => ({
        categorie: cat,
        plats: platsFiltres.filter((p) => p.categorie_id === cat.id),
      }))
      .filter((g) => g.plats.length > 0);
  }, [categories, platsFiltres, categorieActive]);

  function ouvrirFamille(id: string) {
    setCategorieActive(id);
    setFiltre('tous');
    setVueFamilles(false);
  }

  function afficherToutesLesVarietes() {
    setCategorieActive('tous');
    setFiltre('tous');
    setVueFamilles(false);
  }

  function revenirAuxFamilles() {
    setCategorieActive('tous');
    setFiltre('tous');
    setVueFamilles(true);
  }

  return (
    <>
      {/* En-tête menu */}
      <div className="bg-mosaique-terre text-white pt-10 pb-12">
        <div className="container-site">
          <p className="text-mosaique-or text-sm uppercase tracking-[0.22em] mb-3">La carte Mosaïque</p>
          <h1 className="font-display text-4xl lg:text-5xl font-bold mb-3">
            {vueFamilles ? 'Choisissez votre univers' : categorieActive === 'tous' ? 'Toutes les variétés' : categories.find((c) => c.id === categorieActive)?.nom ?? 'La carte'}
          </h1>
          <p className="text-white/70 text-lg max-w-xl">
            {vueFamilles
              ? 'Parcourez nos familles de recettes, puis découvrez les préparations proposées dans chacune.'
              : `${platsFiltres.length} variété${platsFiltres.length > 1 ? 's' : ''} disponible${platsFiltres.length > 1 ? 's' : ''} selon l'approvisionnement du marché.`}
          </p>
        </div>
      </div>

      {/* Navigation catégories */}
      <div className="sticky top-16 lg:top-20 z-30 bg-mosaique-ivoire/95 backdrop-blur-sm border-b border-mosaique-creme">
        <div className="container-site">
          <div className="flex gap-1 overflow-x-auto scrollbar-none py-3 -mx-4 px-4 sm:mx-0 sm:px-0" role="tablist" aria-label="Familles du menu">
            <button
              role="tab"
              aria-selected={vueFamilles}
              onClick={revenirAuxFamilles}
              className={cn(
                'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap min-h-[40px]',
                vueFamilles ? 'bg-mosaique-ocre text-white' : 'text-mosaique-gris hover:text-mosaique-nuit hover:bg-mosaique-creme'
              )}
            >
              Les familles
            </button>
            {categories.map((cat) => {
              const nb = plats.filter((p) => p.categorie_id === cat.id).length;
              return (
                <button
                  key={cat.id}
                  role="tab"
                  aria-selected={!vueFamilles && categorieActive === cat.id}
                  onClick={() => ouvrirFamille(cat.id)}
                  className={cn(
                    'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap min-h-[40px]',
                    !vueFamilles && categorieActive === cat.id ? 'bg-mosaique-ocre text-white' : 'text-mosaique-gris hover:text-mosaique-nuit hover:bg-mosaique-creme'
                  )}
                >
                  {cat.nom}<span className="ml-1.5 opacity-60 text-xs">({nb})</span>
                </button>
              );
            })}
          </div>

          {!vueFamilles && (
            <div className="flex items-center gap-2 pb-3 -mx-4 px-4 sm:mx-0 sm:px-0">
              <span className="text-xs text-mosaique-gris mr-1">Filtrer :</span>
              {([
                { value: 'tous', label: 'Tous' },
                { value: 'vegetarien', label: 'Végétarien', Icon: Leaf },
                { value: 'epice', label: 'Épicé', Icon: Flame },
              ] as { value: Filtre; label: string; Icon?: typeof Leaf }[]).map(({ value, label, Icon }) => (
                <button
                  key={value}
                  onClick={() => setFiltre(value)}
                  className={cn(
                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors min-h-[36px]',
                    filtre === value ? 'bg-mosaique-nuit text-white' : 'bg-mosaique-creme text-mosaique-gris hover:text-mosaique-nuit'
                  )}
                >
                  {Icon && <Icon size={13} aria-hidden="true" />}
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Contenu */}
      <div className="container-site py-10">
        {vueFamilles ? (
          <section aria-labelledby="familles-title">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
              <div>
                <p className="text-mosaique-ocre text-sm font-semibold uppercase tracking-[0.18em] mb-2">Laissez-vous guider</p>
                <h2 id="familles-title" className="font-display text-3xl font-bold text-mosaique-terre">Nos familles de recettes</h2>
                <p className="text-mosaique-gris mt-2 max-w-2xl">Une image pour chaque univers, puis les variétés et les prix à l’intérieur. Une carte plus simple à parcourir, plus fidèle à la richesse de Mosaïque.</p>
              </div>
              <button onClick={afficherToutesLesVarietes} className="btn-secondary whitespace-nowrap">Voir toutes les variétés</button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat) => {
                const platsFamille = plats.filter((p) => p.categorie_id === cat.id);
                const imageUrl = platsFamille.find((p) => p.image_url)?.image_url;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => ouvrirFamille(cat.id)}
                    className="group text-left bg-white rounded-card shadow-card overflow-hidden hover:shadow-card-hover transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mosaique-ocre"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-mosaique-nuit">
                      {imageUrl ? (
                        <Image src={imageUrl} alt={`Famille ${cat.nom}`} fill className="object-contain transition-transform duration-300 group-hover:scale-[1.03]" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-mosaique-or"><UtensilsCrossed size={42} aria-hidden="true" /></div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" aria-hidden="true" />
                      <span className="absolute bottom-4 left-4 text-xs font-semibold uppercase tracking-[0.18em] text-mosaique-or">{platsFamille.length} variété{platsFamille.length > 1 ? 's' : ''}</span>
                    </div>
                    <div className="p-5 flex items-center justify-between gap-4">
                      <div>
                        <h3 className="font-display text-2xl font-bold text-mosaique-terre">{cat.nom}</h3>
                        <p className="text-sm text-mosaique-gris mt-1">Découvrir la famille</p>
                      </div>
                      <span className="flex items-center justify-center w-10 h-10 rounded-full bg-mosaique-creme text-mosaique-ocre group-hover:bg-mosaique-ocre group-hover:text-white transition-colors" aria-hidden="true"><ChevronRight size={20} /></span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        ) : (
          <section aria-labelledby="varietes-title">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <button onClick={revenirAuxFamilles} className="inline-flex items-center gap-2 text-sm text-mosaique-ocre font-medium hover:underline mb-3"><ArrowLeft size={16} /> Retour aux familles</button>
                <h2 id="varietes-title" className="font-display text-3xl font-bold text-mosaique-terre">{categorieActive === 'tous' ? 'Toutes les variétés' : categories.find((c) => c.id === categorieActive)?.nom}</h2>
              </div>
              <p className="text-sm text-mosaique-gris">{platsFiltres.length} plat{platsFiltres.length > 1 ? 's' : ''} au menu</p>
            </div>

            {platsFiltres.length === 0 ? (
              <div className="text-center py-20"><p className="text-mosaique-gris text-lg">Aucun plat ne correspond à ce filtre.</p><button onClick={() => setFiltre('tous')} className="mt-4 btn-secondary">Réinitialiser le filtre</button></div>
            ) : (
              <div className="space-y-16">
                {parCategorie.map((groupe, gi) => (
                  <section key={groupe.categorie.id} aria-labelledby={`cat-${groupe.categorie.slug}`}>
                    {categorieActive === 'tous' && <h3 id={`cat-${groupe.categorie.slug}`} className="font-display text-2xl font-bold text-mosaique-terre mb-6 pb-4 border-b border-mosaique-creme">{groupe.categorie.nom}</h3>}
                    <PlatsAvecRuptures plats={groupe.plats} offsetRupture={gi} />
                  </section>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </>
  );
}

function PlatsAvecRuptures({ plats, offsetRupture }: { plats: Plat[]; offsetRupture: number }) {
  const RUPTURE_TOUS_LES = 10;
  const elements: React.ReactNode[] = [];
  let ruptureIndex = 0;

  plats.forEach((plat, i) => {
    elements.push(<li key={plat.id}><CartePlat plat={plat} /></li>);
    if ((i + 1) % RUPTURE_TOUS_LES === 0 && i < plats.length - 1) {
      const photo = PHOTOS_RUPTURE[(ruptureIndex + offsetRupture) % PHOTOS_RUPTURE.length];
      ruptureIndex++;
      elements.push(<li key={`rupture-${i}`} className="col-span-full"><RuptureEditoriale photo={photo.url} legende={photo.legende} /></li>);
    }
  });

  return <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{elements}</ul>;
}

function RuptureEditoriale({ photo, legende }: { photo: string; legende: string }) {
  return (
    <div className="relative h-48 sm:h-64 rounded-card overflow-hidden my-2">
      <Image src={photo} alt={legende} fill className="object-cover" sizes="(max-width: 1280px) 100vw, 1280px" />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(28,20,16,0.7) 0%, transparent 60%)' }} aria-hidden="true" />
      <p className="absolute left-8 bottom-8 font-display text-xl font-semibold text-white max-w-sm">{legende}</p>
    </div>
  );
}
