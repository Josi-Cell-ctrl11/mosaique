'use client';

import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePanier } from '@/store/panier';
import { formatPrix, imagePlaceholder } from '@/lib/utils';
import { useEffect, useRef } from 'react';

export function Panier() {
  const {
    articles,
    ouvert,
    fermerPanier,
    modifierQuantite,
    retirerArticle,
    sousTotal,
  } = usePanier();

  const drawerRef = useRef<HTMLDivElement>(null);

  // Fermer avec Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && ouvert) fermerPanier();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [ouvert, fermerPanier]);

  // Bloquer le scroll du body
  useEffect(() => {
    if (ouvert) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [ouvert]);

  if (!ouvert) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-mosaique-nuit/40 backdrop-blur-sm"
        onClick={fermerPanier}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-label="Votre panier"
        aria-modal="true"
        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-mosaique-ivoire shadow-2xl flex flex-col animer-glisser-droite"
      >
        {/* En-tête */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-mosaique-creme">
          <h2 className="font-display text-xl font-semibold text-mosaique-terre">
            Votre panier
          </h2>
          <button
            onClick={fermerPanier}
            aria-label="Fermer le panier"
            className="flex items-center justify-center w-10 h-10 rounded-btn text-mosaique-gris hover:bg-mosaique-creme hover:text-mosaique-nuit transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Contenu */}
        {articles.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
            <ShoppingBag size={48} className="text-mosaique-creme" />
            <p className="font-display text-lg text-mosaique-gris">Votre panier est vide</p>
            <button
              onClick={fermerPanier}
              className="btn-primary"
            >
              Voir le menu
            </button>
          </div>
        ) : (
          <>
            {/* Liste des articles */}
            <ul className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
              {articles.map((article) => {
                const cle = `${article.platId}-${JSON.stringify(article.options ?? {})}`;
                const prixTotal = (article.prix + article.prixOptions) * article.quantite;

                return (
                  <li key={cle} className="flex gap-4">
                    {/* Photo */}
                    <div className="relative w-20 h-20 rounded-card overflow-hidden flex-shrink-0 bg-mosaique-creme">
                      <Image
                        src={article.image_url || imagePlaceholder(article.nom)}
                        alt={article.nom}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>

                    {/* Infos */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-mosaique-nuit truncate">{article.nom}</p>
                      {article.options && Object.keys(article.options).length > 0 && (
                        <p className="text-xs text-mosaique-gris mt-0.5">
                          {Object.values(article.options).join(', ')}
                        </p>
                      )}

                      {/* Prix + quantité */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              modifierQuantite(article.platId, article.quantite - 1, article.options)
                            }
                            aria-label="Diminuer la quantité"
                            className="flex items-center justify-center w-8 h-8 rounded-full border border-mosaique-creme text-mosaique-nuit hover:bg-mosaique-creme transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-6 text-center font-medium text-sm tabular-nums">
                            {article.quantite}
                          </span>
                          <button
                            onClick={() =>
                              modifierQuantite(article.platId, article.quantite + 1, article.options)
                            }
                            aria-label="Augmenter la quantité"
                            className="flex items-center justify-center w-8 h-8 rounded-full border border-mosaique-creme text-mosaique-nuit hover:bg-mosaique-creme transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="prix text-sm">{formatPrix(prixTotal)}</span>
                          <button
                            onClick={() => retirerArticle(article.platId, article.options)}
                            aria-label={`Supprimer ${article.nom}`}
                            className="text-mosaique-gris hover:text-mosaique-epice transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Pied de panier */}
            <div className="px-6 py-5 border-t border-mosaique-creme bg-white space-y-4">
              {/* Sous-total */}
              <div className="flex items-center justify-between text-sm text-mosaique-gris">
                <span>Sous-total</span>
                <span className="tabular-nums font-medium text-mosaique-nuit">{formatPrix(sousTotal())}</span>
              </div>
              <p className="text-xs text-mosaique-gris">
                Les frais de livraison seront calculés selon votre adresse.
              </p>

              {/* CTA */}
              <Link
                href="/checkout"
                onClick={fermerPanier}
                className="btn-primary w-full text-center"
              >
                Valider la commande
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}
