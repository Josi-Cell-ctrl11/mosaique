import Link from 'next/link';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { formatPrix, formatDate, cn } from '@/lib/utils';
import { COULEUR_STATUT, LIBELLE_STATUT_COURT } from '@/lib/statuts';
import type { Commande, LigneCommande } from '@/types';
import { ActionsCommandeEnAttente } from '@/components/compte/ActionsCommandeEnAttente';

export const metadata: Metadata = { title: 'Mes commandes' };
export const dynamic = 'force-dynamic';

const RANG: Record<string, number> = { payee: 1, en_preparation: 2, en_livraison: 3, livree: 4 };

export default async function PageCommandes() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data } = await supabase
    .from('commandes')
    .select('*, lignes_commande(*)')
    .eq('utilisateur_id', user!.id)
    .order('created_at', { ascending: false });
  const commandes = (data ?? []) as Array<Commande & { lignes_commande: LigneCommande[] }>;

  if (commandes.length === 0) {
    return (
      <div className="carte p-10 text-center">
        <p className="font-display text-xl mb-4">Pas encore de commande</p>
        <Link href="/menu" className="btn-primary">Voir le menu</Link>
      </div>
    );
  }

  const enCours = commandes.filter((c) => ['payee', 'en_preparation', 'en_livraison'].includes(c.statut));
  const historique = commandes.filter((c) => !enCours.includes(c));
  const resume = (c: (typeof commandes)[number]) => {
    const n = c.lignes_commande.reduce((t, l) => t + l.quantite, 0);
    return `${c.lignes_commande.map((l) => `${l.nom_plat}${l.quantite > 1 ? ` × ${l.quantite}` : ''}`).join(', ') || `${n} article(s)`} · ${formatPrix(c.total)}`;
  };

  return (
    <div className="flex flex-col gap-6">
      {enCours.length > 0 && (
        <section className="flex flex-col gap-2.5">
          <h2 className="font-body text-[13px] font-extrabold uppercase tracking-[0.12em] text-mosaique-gris">En cours</h2>
          {enCours.map((c) => (
            <Link key={c.id} href={`/compte/commandes/${c.id}`} className="bg-white border-2 border-mosaique-nuit rounded-[20px] p-4 flex flex-col gap-3">
              <div className="flex justify-between items-center gap-3">
                <span className="text-sm font-extrabold tabular-nums">{c.numero}</span>
                <span className={cn('pastille', COULEUR_STATUT[c.statut])}>{LIBELLE_STATUT_COURT[c.statut]}</span>
              </div>
              <div className="grid grid-cols-4 gap-1" aria-hidden="true">
                {[1, 2, 3, 4].map((i) => (
                  <span key={i} className={cn('h-[5px] rounded-full', i < RANG[c.statut] ? 'bg-mosaique-nuit' : i === RANG[c.statut] ? 'bg-mosaique-or' : 'bg-[#E2D8C6]')} />
                ))}
              </div>
              <div className="flex justify-between items-center gap-3 text-sm">
                <span className="text-mosaique-gris truncate">{resume(c)}</span>
                <span className="font-extrabold text-mosaique-ocre shrink-0">Suivre →</span>
              </div>
            </Link>
          ))}
        </section>
      )}

      <section className="flex flex-col gap-2.5">
        <h2 className="font-body text-[13px] font-extrabold uppercase tracking-[0.12em] text-mosaique-gris">Historique</h2>
        {historique.map((c) => (
          <div key={c.id} className="carte p-4 flex flex-col gap-2">
            <div className="flex justify-between items-center gap-3">
              <Link href={`/compte/commandes/${c.id}`} className="text-sm font-extrabold tabular-nums hover:text-mosaique-ocre">{c.numero}</Link>
              <span className={cn('pastille', COULEUR_STATUT[c.statut])}>{LIBELLE_STATUT_COURT[c.statut]}</span>
            </div>
            <p className="text-sm text-mosaique-gris">{resume(c)}</p>
            <p className="text-[13px] text-mosaique-gris">{formatDate(c.created_at)}</p>
            {c.statut === 'en_attente_paiement' && (
              <ActionsCommandeEnAttente commandeId={c.id} fedapayTransactionId={c.fedapay_transaction_id} />
            )}
          </div>
        ))}
      </section>
    </div>
  );
}
