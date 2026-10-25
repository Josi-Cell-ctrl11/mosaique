import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { StatutCommande } from '@/types';

const ETAPES: Array<{ cle: StatutCommande[]; titre: string; detail: string }> = [
  { cle: ['payee'], titre: 'Paiement confirmé', detail: 'Vérifié auprès de FedaPay' },
  { cle: ['en_preparation'], titre: 'En préparation', detail: 'La cuisine s’occupe de vos plats' },
  { cle: ['en_livraison'], titre: 'En livraison', detail: 'Le livreur est en route' },
  { cle: ['livree'], titre: 'Livrée', detail: 'Bon appétit !' },
];

const RANG: Record<StatutCommande, number> = {
  en_attente_paiement: -1,
  payee: 0,
  en_preparation: 1,
  en_livraison: 2,
  livree: 3,
  annulee: -2,
};

/** Frise de suivi : étapes passées en noir, étape en cours en or. */
export function SuiviCommande({ statut }: { statut: StatutCommande }) {
  const rang = RANG[statut];
  if (rang === -2) {
    return <p className="text-sm font-bold text-mosaique-epice">Cette commande a été annulée.</p>;
  }
  return (
    <ol className="flex flex-col">
      {ETAPES.map((e, i) => {
        const fait = i < rang || (i === rang && statut === 'livree');
        const enCours = i === rang && statut !== 'livree';
        const dernier = i === ETAPES.length - 1;
        return (
          <li key={e.titre} aria-current={enCours ? 'step' : undefined} className="flex gap-3.5">
            <div className="flex flex-col items-center">
              <span className={cn(
                'w-[26px] h-[26px] rounded-full flex items-center justify-center shrink-0',
                fait && 'bg-mosaique-nuit text-mosaique-or',
                enCours && 'bg-mosaique-or ring-4 ring-mosaique-dore',
                !fait && !enCours && 'border-2 border-[#D9CDB8]'
              )}>
                {fait && <Check size={14} strokeWidth={3} aria-hidden="true" />}
              </span>
              {!dernier && <span className={cn('w-0.5 flex-1 min-h-[24px]', fait ? 'bg-mosaique-nuit' : 'bg-[#E2D8C6]')} />}
            </div>
            <div className={cn(!dernier && 'pb-4')}>
              <p className={cn('text-[15px]', fait || enCours ? 'font-extrabold' : 'font-bold text-mosaique-gris')}>{e.titre}</p>
              {(fait || enCours) && <p className="text-[13px] text-mosaique-gris mt-0.5">{e.detail}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
