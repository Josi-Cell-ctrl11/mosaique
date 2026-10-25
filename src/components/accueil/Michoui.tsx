import Link from 'next/link';
import { ImagePlat } from '@/components/ui/ImagePlat';
import { formatPrix } from '@/lib/utils';
import type { Plat } from '@/types';

export function Michoui({ plats, slugCategorie }: { plats: Plat[]; slugCategorie: string }) {
  const image = plats.find((p) => p.image_url)?.image_url ?? null;
  const prixMin = Math.min(...plats.map((p) => p.prix));
  const vitrine = [...plats].sort((a, b) => a.prix - b.prix).filter((p) => !/^Sauce/i.test(p.nom)).slice(0, 2);

  return (
    <section className="container-site pt-10 lg:pt-16" aria-labelledby="titre-michoui">
      <div className="bg-mosaique-nuit rounded-[22px] lg:rounded-[28px] overflow-hidden flex flex-col lg:flex-row">
        <ImagePlat src={image} alt="Mouton entier rôti à la broche" sizes="(max-width: 1024px) 100vw, 50vw" className="h-[200px] lg:h-auto lg:min-h-[380px] lg:flex-1" />
        <div className="p-5 lg:p-12 flex flex-col gap-3 lg:gap-4 lg:flex-1 lg:justify-center">
          <span className="self-start text-[11px] font-extrabold uppercase tracking-[0.14em] text-mosaique-nuit bg-mosaique-or px-2.5 py-1 rounded-md">Sur commande</span>
          <h2 id="titre-michoui" className="font-display text-[1.65rem] lg:text-[2.4rem] font-semibold text-mosaique-ivoire">Michoui de mouton</h2>
          <p className="text-sm lg:text-[17px] leading-relaxed text-[#C9BFAF]">
            Mouton entier ou demi, rôti à la broche, avec sauce gbôta ou sauce triple de mouton. Idéal pour vos mariages, baptêmes et fêtes.
          </p>
          {vitrine.length > 0 && (
            <dl className="hidden lg:flex gap-8 py-2">
              {vitrine.map((p) => (
                <div key={p.id}>
                  <dt className="text-[13px] text-[#A89C8B]">{p.nom.replace(/^Michoui de /i, '').replace(/^./, (c) => c.toUpperCase())}</dt>
                  <dd className="mt-1 font-extrabold text-lg text-mosaique-or-pale">{formatPrix(p.prix)}</dd>
                </div>
              ))}
            </dl>
          )}
          <div className="flex items-center justify-between gap-3 pt-1">
            <span className="lg:hidden font-extrabold text-mosaique-or-pale whitespace-nowrap">dès {formatPrix(prixMin)}</span>
            <Link href={`/menu?categorie=${slugCategorie}`} className="inline-flex items-center min-h-[48px] px-5 rounded-btn border-[1.5px] border-mosaique-or text-mosaique-or font-extrabold whitespace-nowrap hover:bg-mosaique-or hover:text-mosaique-nuit transition-colors">
              Réserver<span className="hidden sm:inline">&nbsp;mon michoui</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
