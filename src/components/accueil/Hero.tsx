import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ImagePlat } from '@/components/ui/ImagePlat';
import { formatPrix } from '@/lib/utils';

interface Props {
  image: string | null;
  nomPlat?: string;
  prixDes?: number;
}

export function Hero({ image, nomPlat, prixDes }: Props) {
  return (
    <section className="bg-mosaique-nuit pt-16 lg:pt-20">
      <div className="container-site pt-4 pb-10 lg:py-20 grid lg:grid-cols-2 gap-8 lg:gap-14 items-center">
        <div className="order-2 lg:order-1 flex flex-col gap-5 lg:gap-6">
          <p className="text-xs lg:text-[13px] font-extrabold uppercase tracking-[0.18em] text-mosaique-or">
            Abomey-Calavi · Livraison possible
          </p>
          <h1 className="font-display text-[2.4rem] leading-[1.06] lg:text-[4rem] font-semibold text-mosaique-ivoire">
            L’élégance du goût, livrée chez vous.
          </h1>
          <p className="text-[15px] lg:text-lg leading-relaxed text-[#C9BFAF] max-w-xl">
            Sauces maison, michoui de mouton, kébabs, chawarmas et sandwichs. Commandez en deux minutes, payez par Mobile Money.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/menu" className="btn-or text-base">
              Commander maintenant <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/menu?categorie=michoui-mouton" className="inline-flex items-center justify-center min-h-[52px] px-6 rounded-btn border border-[#4A3F33] text-mosaique-ivoire font-extrabold hover:border-mosaique-or">
              Réserver un michoui
            </Link>
          </div>
          <dl className="grid grid-cols-3 gap-2 lg:gap-8 lg:flex pt-2 lg:pt-4 lg:border-t lg:border-mosaique-brun">
            {[
              ['Paiement', 'MoMo · Moov · Carte'],
              ['Livraison', 'Calavi & environs'],
              ['Commande', 'En ligne · WhatsApp'],
            ].map(([titre, valeur]) => (
              <div key={titre} className="border border-mosaique-trait lg:border-0 rounded-xl p-2.5 lg:p-0 lg:pt-4">
                <dt className="text-[11px] lg:text-[13px] text-[#A89C8B]">{titre}</dt>
                <dd className="text-[13px] lg:text-[15px] font-bold text-mosaique-ivoire mt-0.5">{valeur}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="order-1 lg:order-2 relative">
          <ImagePlat src={image} alt={nomPlat ?? 'Plat du Mosaïque'} priority sizes="(max-width: 1024px) 100vw, 50vw" className="h-[250px] sm:h-[340px] lg:h-[480px] rounded-[22px]" />
          {nomPlat && prixDes ? (
            <span className="absolute left-3 bottom-3 bg-mosaique-nuit/85 text-mosaique-or-pale text-xs font-bold px-3 py-2 rounded-full">
              {nomPlat} · dès {formatPrix(prixDes)}
            </span>
          ) : null}
        </div>
      </div>
    </section>
  );
}
