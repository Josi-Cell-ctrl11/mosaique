import Link from 'next/link';
import type { Plat } from '@/types';
import { formatPrix } from '@/lib/utils';
import { ImagePlat } from '@/components/ui/ImagePlat';
import { BoutonAjoutRapide } from './BoutonAjoutRapide';

const estSignature = (p: Plat) => /mosa[iï]que/i.test(p.nom) || p.est_vedette;

/** Carte de plat : en ligne sur mobile (texte + photo à droite), en colonne sur grand écran. */
export function CartePlat({ plat }: { plat: Plat }) {
  return (
    <article className="carte-plat h-full flex flex-row-reverse lg:flex-col gap-3.5 lg:gap-0 p-3 lg:p-0">
      <div className="relative shrink-0">
        <ImagePlat
          src={plat.image_url}
          alt={plat.nom}
          sizes="(max-width: 1024px) 108px, 33vw"
          className="w-[108px] h-[108px] lg:w-full lg:h-[180px] rounded-[14px] lg:rounded-none"
        />
        <BoutonAjoutRapide plat={plat} variante="or" className="absolute -right-1.5 -bottom-1.5 lg:hidden" />
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-1.5 lg:p-4">
        {(estSignature(plat) || plat.est_epice || plat.est_vegetarien) && (
          <div className="flex flex-wrap gap-1.5">
            {estSignature(plat) && <span className="badge-signature">Signature</span>}
            {plat.est_epice && <span className="badge-epice">Épicé</span>}
            {plat.est_vegetarien && <span className="badge-vegetarien">Végé</span>}
          </div>
        )}
        <h3 className="font-body font-extrabold text-base leading-snug">
          <Link href={`/menu/${plat.slug}`} className="after:absolute after:inset-0 lg:after:hidden hover:text-mosaique-ocre">
            {plat.nom}
          </Link>
        </h3>
        <p className="text-[13px] lg:text-sm leading-relaxed text-mosaique-gris line-clamp-2">{plat.description}</p>
        <div className="mt-auto pt-1 flex items-center justify-between gap-3">
          <span className="prix text-[15px] lg:text-base">{formatPrix(plat.prix)}</span>
          <BoutonAjoutRapide plat={plat} className="hidden lg:flex relative z-10" />
        </div>
      </div>
    </article>
  );
}
