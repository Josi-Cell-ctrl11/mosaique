import { cn } from '@/lib/utils';

/** Logo Le Mosaïque : quatre tuiles dorées + nom en capitales. */
export function Logo({ taille = 'md', className, avecNom = true }: { taille?: 'sm' | 'md' | 'lg'; className?: string; avecNom?: boolean }) {
  const tuile = { sm: 'w-5 h-5', md: 'w-6 h-6', lg: 'w-10 h-10' }[taille];
  const texte = { sm: 'text-base', md: 'text-lg lg:text-xl', lg: 'text-2xl' }[taille];
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span className={cn('grid grid-cols-2 gap-[2px] shrink-0', tuile)} aria-hidden="true">
        <span className="bg-mosaique-or rounded-[2px]" />
        <span className="bg-mosaique-ocre rounded-[2px]" />
        <span className="bg-mosaique-or-pale rounded-[2px]" />
        <span className="bg-mosaique-or rounded-[2px]" />
      </span>
      {avecNom && (
        <span className={cn('font-display font-semibold tracking-[0.14em] text-mosaique-or', texte)}>LE MOSAÏQUE</span>
      )}
    </span>
  );
}
