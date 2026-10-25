import Link from 'next/link';
import { ImagePlat } from '@/components/ui/ImagePlat';
import { formatPrix } from '@/lib/utils';

export type FamilleSauce = {
  slug: string;
  nom: string;
  nbGarnitures: number;
  prixMin: number;
  image: string | null;
  premierPlat: string | null;
};

export function SaucesMaison({ sauces }: { sauces: FamilleSauce[] }) {
  return (
    <section className="pt-10 lg:pt-16" aria-labelledby="titre-sauces">
      <div className="container-site mb-5">
        <h2 id="titre-sauces" className="font-display text-2xl lg:text-4xl font-semibold">Nos sauces maison</h2>
        <p className="text-sm lg:text-base text-mosaique-gris mt-1">Mouton, bœuf, poulet, poisson fumé, tripes ou double viande : vous choisissez la garniture.</p>
      </div>
      <ul className="container-site flex lg:grid lg:grid-cols-4 gap-3 lg:gap-5 overflow-x-auto scrollbar-none pb-1">
        {sauces.map((s) => (
          <li key={s.slug} className="flex-[0_0_200px] lg:flex-auto">
            <Link href={`/menu?categorie=${s.slug}`} className="carte-plat flex flex-col h-full">
              <ImagePlat src={s.image} alt={s.nom} sizes="(max-width: 1024px) 200px, 25vw" className="h-[140px] lg:h-[200px]" />
              <div className="p-3.5 lg:p-4 flex flex-col gap-1">
                <span className="font-extrabold lg:text-lg">{s.nom}</span>
                <span className="text-[13px] text-mosaique-gris">{s.nbGarnitures} garniture{s.nbGarnitures > 1 ? 's' : ''} au choix</span>
                <span className="prix text-sm lg:text-base">dès {formatPrix(s.prixMin)}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
