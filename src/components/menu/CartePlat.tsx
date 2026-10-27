'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Flame, Leaf, Plus, UtensilsCrossed } from 'lucide-react';
import type { Plat } from '@/types';
import { formatPrix } from '@/lib/utils';
import { usePanier } from '@/store/panier';
import { toast } from 'sonner';

interface CartePlatProps {
  plat: Plat;
}

export function CartePlat({ plat }: CartePlatProps) {
  const { ajouterArticle } = usePanier();

  function ajouterAuPanier(e: React.MouseEvent) {
    e.preventDefault();
    ajouterArticle({
      platId: plat.id,
      nom: plat.nom,
      prix: plat.prix,
      image_url: plat.image_url,
      quantite: 1,
      prixOptions: 0,
    });
    toast.success('Ajouté au panier', {
      duration: 1200,
      style: { pointerEvents: 'none' },
    });
  }

  return (
    <article className="carte-plat group">
      <Link href={`/menu/${plat.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-mosaique-nuit">
          {plat.image_url ? (
            <>
              <Image
                src={plat.image_url}
                alt={plat.nom}
                fill
                className="object-contain transition-transform duration-300 ease-mosaique group-hover:scale-[1.03]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" aria-hidden="true" />
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 group-hover:bg-mosaique-terre transition-colors">
              <UtensilsCrossed size={28} className="text-mosaique-or/60" aria-hidden="true" />
              <span className="text-xs text-mosaique-or/40 font-medium tracking-widest uppercase">Mosaïque</span>
            </div>
          )}

          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {plat.est_vegetarien && (
              <span className="badge-vegetarien" title="Plat végétarien">
                <Leaf size={12} strokeWidth={2.2} aria-hidden="true" /> Végétarien
              </span>
            )}
            {plat.est_epice && (
              <span className="badge-epice" title="Plat épicé">
                <Flame size={12} strokeWidth={2.2} aria-hidden="true" /> Épicé
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/menu/${plat.slug}`} className="block">
          <h3 className="font-semibold text-mosaique-nuit text-base leading-snug mb-1 hover:text-mosaique-ocre transition-colors">
            {plat.nom}
          </h3>
          <p className="text-sm text-mosaique-gris line-clamp-2 leading-relaxed">
            {plat.description}
          </p>
        </Link>

        <div className="flex items-center justify-between mt-4">
          <span className="prix text-prix">{formatPrix(plat.prix)}</span>
          <button
            onClick={ajouterAuPanier}
            aria-label={`Ajouter ${plat.nom} au panier`}
            className="flex items-center gap-1.5 bg-mosaique-ocre text-white text-sm font-medium px-3 py-2 rounded-btn min-h-[40px] hover:bg-mosaique-terre transition-colors active:scale-95"
          >
            <Plus size={16} aria-hidden="true" />
            Ajouter
          </button>
        </div>
      </div>
    </article>
  );
}
