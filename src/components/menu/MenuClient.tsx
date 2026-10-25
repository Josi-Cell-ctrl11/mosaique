'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Flame, Leaf, Search, X } from 'lucide-react';
import type { Plat, Categorie } from '@/types';
import { CartePlat } from './CartePlat';
import { cn, formatPrix } from '@/lib/utils';
import { usePanier } from '@/store/panier';

interface MenuClientProps {
  categories: Categorie[];
  plats: Plat[];
  categorieInitiale?: string;
}

const normaliser = (t: string) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export function MenuClient({ categories, plats, categorieInitiale }: MenuClientProps) {
  const initiale = categories.find((c) => c.slug === categorieInitiale)?.id ?? 'tous';
  const [categorieActive, setCategorieActive] = useState<string>(initiale);
  const [recherche, setRecherche] = useState('');
  const [epice, setEpice] = useState(false);
  const [vege, setVege] = useState(false);

  useEffect(() => setCategorieActive(initiale), [initiale]);

  const platsFiltres = useMemo(() => {
    const q = normaliser(recherche.trim());
    return plats.filter((p) =>
      (categorieActive === 'tous' || p.categorie_id === categorieActive) &&
      (!epice || p.est_epice) &&
      (!vege || p.est_vegetarien) &&
      (!q || normaliser(`${p.nom} ${p.description} ${p.ingredients ?? ''}`).includes(q))
    );
  }, [plats, categorieActive, recherche, epice, vege]);

  const groupes = useMemo(
    () => categories
      .map((categorie) => ({ categorie, plats: platsFiltres.filter((p) => p.categorie_id === categorie.id) }))
      .filter((g) => g.plats.length > 0),
    [categories, platsFiltres]
  );

  const chips = [{ id: 'tous', nom: 'Tout', n: plats.length }, ...categories.map((c) => ({ id: c.id, nom: c.nom, n: plats.filter((p) => p.categorie_id === c.id).length }))].filter((c) => c.n > 0);

  return (
    <>
      <div className="bg-mosaique-nuit pt-16 lg:pt-20">
        <div className="container-site pt-5 pb-5 lg:pt-10 lg:pb-8 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <p className="hidden lg:block text-[13px] font-extrabold uppercase tracking-[0.18em] text-mosaique-or mb-2">La carte du Mosaïque</p>
            <h1 className="font-display text-[1.6rem] lg:text-5xl font-semibold text-mosaique-ivoire">Notre menu</h1>
          </div>
          <label className="relative block w-full lg:max-w-md">
            <span className="sr-only">Rechercher un plat</span>
            <Search size={20} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C8073]" aria-hidden="true" />
            <input
              type="search"
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              placeholder="Gombo, kébab, michoui…"
              className="w-full h-[50px] rounded-[14px] border border-mosaique-trait bg-mosaique-brun text-mosaique-ivoire placeholder-[#8C8073] font-medium pl-11 pr-11 focus:outline-none focus:border-mosaique-or"
            />
            {recherche && (
              <button onClick={() => setRecherche('')} aria-label="Effacer la recherche" className="absolute right-1 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center text-[#C9BFAF]">
                <X size={18} aria-hidden="true" />
              </button>
            )}
          </label>
        </div>
      </div>

      <div className="sticky top-16 lg:top-20 z-30 bg-mosaique-ivoire/95 backdrop-blur-sm border-b border-mosaique-creme">
        <div className="container-site">
          <div role="tablist" aria-label="Catégories" className="flex gap-2 overflow-x-auto scrollbar-none py-3 -mx-4 px-4 sm:mx-0 sm:px-0">
            {chips.map((c) => {
              const actif = categorieActive === c.id;
              return (
                <button
                  key={c.id}
                  role="tab"
                  aria-selected={actif}
                  onClick={() => setCategorieActive(c.id)}
                  className={cn(
                    'shrink-0 min-h-[44px] px-4 rounded-full text-sm font-bold whitespace-nowrap border transition-colors',
                    actif ? 'bg-mosaique-nuit text-mosaique-or border-mosaique-nuit' : 'bg-white text-mosaique-terre border-[#E2D8C6] hover:border-mosaique-terre'
                  )}
                >
                  {c.nom}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container-site pt-3 pb-28 lg:pb-16">
        <div className="flex flex-wrap items-center gap-2 py-2">
          <button onClick={() => setEpice((v) => !v)} aria-pressed={epice} className={cn('inline-flex items-center gap-1.5 min-h-[36px] px-3 rounded-full text-[13px] font-bold border transition-colors', epice ? 'bg-mosaique-epice text-white border-mosaique-epice' : 'border-dashed border-[#D9CDB8] text-mosaique-gris')}>
            <Flame size={14} aria-hidden="true" /> Épicé
          </button>
          <button onClick={() => setVege((v) => !v)} aria-pressed={vege} className={cn('inline-flex items-center gap-1.5 min-h-[36px] px-3 rounded-full text-[13px] font-bold border transition-colors', vege ? 'bg-mosaique-vert text-white border-mosaique-vert' : 'border-dashed border-[#D9CDB8] text-mosaique-gris')}>
            <Leaf size={14} aria-hidden="true" /> Végétarien
          </button>
          <span className="ml-auto text-[13px] text-mosaique-gris" aria-live="polite">{platsFiltres.length} plat{platsFiltres.length > 1 ? 's' : ''}</span>
        </div>

        {groupes.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-display text-2xl">Aucun plat trouvé</p>
            <button onClick={() => { setRecherche(''); setEpice(false); setVege(false); setCategorieActive('tous'); }} className="mt-4 btn-secondary">
              Réinitialiser
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-8 lg:gap-12 mt-2">
            {groupes.map((g) => (
              <section key={g.categorie.id} aria-labelledby={`cat-${g.categorie.slug}`}>
                <h2 id={`cat-${g.categorie.slug}`} className="font-display text-[1.4rem] lg:text-3xl font-semibold mb-3 lg:mb-5">{g.categorie.nom}</h2>
                <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-5">
                  {g.plats.map((p) => (
                    <li key={p.id} className="relative"><CartePlat plat={p} /></li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>

      <BarrePanierFlottante />
    </>
  );
}

function BarrePanierFlottante() {
  const { totalArticles, sousTotal, ouvrirPanier } = usePanier();
  const [monte, setMonte] = useState(false);
  useEffect(() => setMonte(true), []);
  const nb = monte ? totalArticles() : 0;
  if (nb === 0) return null;
  return (
    <div className="md:hidden fixed left-4 right-4 bottom-[88px] z-30">
      <button onClick={ouvrirPanier} className="w-full min-h-[60px] rounded-[18px] bg-mosaique-nuit text-mosaique-ivoire flex items-center justify-between pl-[18px] pr-2.5 shadow-flottant">
        <span className="flex flex-col items-start">
          <span className="text-xs text-[#C9BFAF]">{nb} article{nb > 1 ? 's' : ''}</span>
          <span className="font-extrabold">{formatPrix(sousTotal())}</span>
        </span>
        <span className="min-h-[44px] px-4 rounded-xl bg-mosaique-or text-mosaique-nuit font-extrabold text-[15px] flex items-center">Voir le panier</span>
      </button>
      <Link href="/checkout" className="sr-only">Passer la commande</Link>
    </div>
  );
}
