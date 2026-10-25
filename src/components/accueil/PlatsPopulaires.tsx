import Link from 'next/link';
import { ImagePlat } from '@/components/ui/ImagePlat';
import { BoutonAjoutRapide } from '@/components/menu/BoutonAjoutRapide';
import { formatPrix } from '@/lib/utils';
import type { Plat } from '@/types';

export function PlatsPopulaires({ plats }: { plats: Plat[] }) {
  if (plats.length === 0) return null;
  return (
    <section className="container-site pt-10 lg:pt-16" aria-labelledby="titre-populaires">
      <h2 id="titre-populaires" className="font-display text-2xl lg:text-4xl font-semibold mb-5">Les plus demandés</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
        {plats.map((p) => (
          <li key={p.id} className="carte p-2.5 flex items-center gap-3 min-w-0">
            <ImagePlat src={p.image_url} alt="" libelle="Photo" sizes="96px" className="w-[76px] h-[76px] lg:w-24 lg:h-24 rounded-xl shrink-0" />
            <Link href={`/menu/${p.slug}`} className="flex-1 min-w-0 flex flex-col gap-0.5">
              <span className="font-extrabold leading-snug">{p.nom}</span>
              <span className="text-[13px] text-mosaique-gris truncate">{p.description}</span>
              <span className="prix text-sm">{formatPrix(p.prix)}</span>
            </Link>
            <BoutonAjoutRapide plat={p} />
          </li>
        ))}
      </ul>
    </section>
  );
}
