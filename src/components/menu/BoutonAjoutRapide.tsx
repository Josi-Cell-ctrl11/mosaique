'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { usePanier } from '@/store/panier';
import { cn } from '@/lib/utils';
import type { Plat } from '@/types';

/** « + » : ajoute directement au panier, ou ouvre la fiche si le plat a des choix obligatoires. */
export function BoutonAjoutRapide({ plat, className, variante = 'sombre' }: { plat: Plat; className?: string; variante?: 'sombre' | 'or' }) {
  const { ajouterArticle } = usePanier();
  const classes = cn(
    'shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition active:scale-95',
    variante === 'or' ? 'bg-mosaique-or text-mosaique-nuit border-[3px] border-white' : 'bg-mosaique-nuit text-mosaique-or hover:bg-mosaique-brun',
    className
  );

  if (plat.options?.some((o) => o.required)) {
    return (
      <Link href={`/menu/${plat.slug}`} aria-label={`Choisir les options de ${plat.nom}`} className={classes}>
        <Plus size={20} strokeWidth={2.4} aria-hidden="true" />
      </Link>
    );
  }

  return (
    <button
      type="button"
      aria-label={`Ajouter ${plat.nom} au panier`}
      className={classes}
      onClick={() => {
        ajouterArticle({ platId: plat.id, nom: plat.nom, prix: plat.prix, image_url: plat.image_url, quantite: 1, prixOptions: 0 }, false);
        toast.success(`${plat.nom} ajouté au panier`, { duration: 1400 });
      }}
    >
      <Plus size={20} strokeWidth={2.4} aria-hidden="true" />
    </button>
  );
}
