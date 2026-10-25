'use client';

import { X, Minus, Plus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { usePanier } from '@/store/panier';
import { formatPrix } from '@/lib/utils';
import { ImagePlat } from '@/components/ui/ImagePlat';

export function Panier() {
  const { articles, ouvert, fermerPanier, modifierQuantite, sousTotal, totalArticles } = usePanier();
  const fermerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && ouvert) fermerPanier();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [ouvert, fermerPanier]);

  useEffect(() => {
    document.body.style.overflow = ouvert ? 'hidden' : '';
    if (ouvert) fermerRef.current?.focus();
    return () => { document.body.style.overflow = ''; };
  }, [ouvert]);

  if (!ouvert) return null;
  const nb = totalArticles();

  return (
    <>
      <div className="fixed inset-0 z-[55] bg-mosaique-nuit/50 backdrop-blur-[2px]" onClick={fermerPanier} aria-hidden="true" />
      <div role="dialog" aria-modal="true" aria-labelledby="titre-panier" className="fixed right-0 inset-y-0 z-[56] w-full max-w-md bg-mosaique-ivoire flex flex-col animer-glisser-droite">
        <header className="px-5 pt-4 pb-3 flex items-center gap-2">
          <button ref={fermerRef} onClick={fermerPanier} aria-label="Fermer le panier" className="-ml-2.5 w-11 h-11 flex items-center justify-center rounded-xl hover:bg-mosaique-sable">
            <ArrowLeft size={22} className="sm:hidden" aria-hidden="true" />
            <X size={22} className="hidden sm:block" aria-hidden="true" />
          </button>
          <h2 id="titre-panier" className="flex-1 font-display text-[1.6rem] font-semibold">Votre panier</h2>
          <span className="text-sm font-bold text-mosaique-gris">{nb} article{nb > 1 ? 's' : ''}</span>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-1.5 flex flex-col gap-3">
          {articles.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center py-16">
              <span className="grid grid-cols-2 gap-1 w-12 h-12" aria-hidden="true">
                <span className="bg-mosaique-or rounded" /><span className="bg-[#E9DDBF] rounded" /><span className="bg-[#E9DDBF] rounded" /><span className="bg-mosaique-or rounded" />
              </span>
              <p className="font-display text-[1.4rem]">Votre panier est vide</p>
              <Link href="/menu" onClick={fermerPanier} className="font-extrabold text-mosaique-ocre">Découvrir le menu</Link>
            </div>
          ) : (
            <>
              <ul className="flex flex-col gap-3">
                {articles.map((a) => {
                  const cle = `${a.platId}-${JSON.stringify(a.options ?? {})}`;
                  return (
                    <li key={cle} className="carte p-3 flex gap-3">
                      <ImagePlat src={a.image_url} alt="" libelle="" sizes="76px" className="w-[76px] h-[76px] rounded-xl shrink-0" />
                      <div className="flex-1 min-w-0 flex flex-col gap-1">
                        <span className="font-extrabold leading-snug">{a.nom}</span>
                        <div className="mt-auto flex items-center justify-between gap-2">
                          <span className="prix text-[15px]">{formatPrix((a.prix + a.prixOptions) * a.quantite)}</span>
                          <div className="flex items-center bg-mosaique-sable rounded-xl">
                            <button onClick={() => modifierQuantite(a.platId, a.quantite - 1, a.options)} aria-label={a.quantite === 1 ? `Retirer ${a.nom} du panier` : 'Retirer une portion'} className="w-11 h-11 flex items-center justify-center">
                              <Minus size={16} strokeWidth={2.4} aria-hidden="true" />
                            </button>
                            <span className="min-w-[20px] text-center font-extrabold tabular-nums">{a.quantite}</span>
                            <button onClick={() => modifierQuantite(a.platId, a.quantite + 1, a.options)} aria-label="Ajouter une portion" className="w-11 h-11 flex items-center justify-center">
                              <Plus size={16} strokeWidth={2.4} aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <Link href="/menu" onClick={fermerPanier} className="min-h-[48px] border-[1.5px] border-dashed border-[#D9CDB8] rounded-[14px] flex items-center justify-center gap-2 font-extrabold text-sm text-mosaique-ocre-fonce">
                <Plus size={16} strokeWidth={2.4} aria-hidden="true" /> Ajouter d’autres plats
              </Link>
            </>
          )}
        </div>

        {articles.length > 0 && (
          <footer className="bg-white border-t border-mosaique-creme px-5 pt-4 pb-[max(env(safe-area-inset-bottom),24px)] flex flex-col gap-2.5">
            <div className="flex justify-between text-sm text-mosaique-gris"><span>Sous-total</span><span className="font-bold text-mosaique-terre tabular-nums">{formatPrix(sousTotal())}</span></div>
            <div className="flex justify-between text-sm text-mosaique-gris"><span>Livraison</span><span>Calculée à l’étape suivante</span></div>
            <Link href="/checkout" onClick={fermerPanier} className="btn-primary justify-between px-[18px] mt-1.5 text-base">
              <span>Passer la commande</span>
              <span className="text-mosaique-or tabular-nums">{formatPrix(sousTotal())}</span>
            </Link>
          </footer>
        )}
      </div>
    </>
  );
}
