import Image from 'next/image';
import { cn } from '@/lib/utils';

type Taille = 'sm' | 'md' | 'lg';

const EMBLEME: Record<Taille, number> = { sm: 32, md: 40, lg: 96 };

/**
 * Logo Le Mosaïque : emblème doré (toque, couteau, fourchettes) + nom en capitales.
 * L'emblème est sur fond noir : à utiliser sur les surfaces sombres (en-tête, pied de page, back-office).
 * En taille « lg », l'emblème est au-dessus du nom.
 */
export function Logo({ taille = 'md', className, avecNom = true }: { taille?: Taille; className?: string; avecNom?: boolean }) {
  const px = EMBLEME[taille];
  const texte = { sm: 'text-base', md: 'text-lg lg:text-xl', lg: 'text-2xl' }[taille];
  return (
    <span className={cn('inline-flex items-center', taille === 'lg' ? 'flex-col gap-3' : 'gap-2.5', className)}>
      <Image
        src="/assets/logo.jpg"
        alt=""
        width={px}
        height={px}
        priority={taille !== 'sm'}
        className={cn('shrink-0 object-cover', taille === 'lg' ? 'rounded-2xl' : 'rounded-lg')}
      />
      {avecNom && (
        <span className={cn('font-display font-semibold tracking-[0.14em] text-mosaique-or whitespace-nowrap', texte)}>LE MOSAÏQUE</span>
      )}
    </span>
  );
}
