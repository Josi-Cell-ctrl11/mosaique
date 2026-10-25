import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin } from 'lucide-react';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { synchroniserPaiement } from '@/lib/fedapay';
import { formatPrix, formatDate, cn } from '@/lib/utils';
import { COULEUR_STATUT, LIBELLE_STATUT_COURT } from '@/lib/statuts';
import { SuiviCommande } from '@/components/commande/SuiviCommande';
import { ActionsCommandeEnAttente } from '@/components/compte/ActionsCommandeEnAttente';
import type { Commande, LigneCommande } from '@/types';

export const metadata: Metadata = { title: 'Détail de commande' };
export const dynamic = 'force-dynamic';

export default async function PageDetailCommande({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const lire = () => supabase.from('commandes').select('*, lignes_commande(*)').eq('id', params.id).eq('utilisateur_id', user!.id).maybeSingle();
  let { data } = await lire();
  if (!data) notFound();
  if (data.statut_paiement === 'en_attente' && data.fedapay_transaction_id) {
    await synchroniserPaiement(data.id);
    ({ data } = await lire());
  }
  const c = data as Commande & { lignes_commande: LigneCommande[] };

  return (
    <div className="flex flex-col gap-4">
      <Link href="/compte/commandes" className="self-start text-sm font-extrabold text-mosaique-ocre">← Mes commandes</Link>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold tabular-nums">{c.numero}</h1>
          <p className="text-sm text-mosaique-gris">{formatDate(c.created_at)}</p>
        </div>
        <span className={cn('pastille', COULEUR_STATUT[c.statut])}>{LIBELLE_STATUT_COURT[c.statut]}</span>
      </div>

      {c.statut === 'en_attente_paiement' ? (
        <div className="carte p-[18px]">
          <p className="text-sm text-mosaique-gris">Le paiement n’a pas encore été confirmé.</p>
          <ActionsCommandeEnAttente commandeId={c.id} fedapayTransactionId={c.fedapay_transaction_id} />
        </div>
      ) : (
        <section className="carte p-[18px] flex flex-col gap-4">
          <h2 className="font-body text-[17px] font-extrabold">Suivi</h2>
          <SuiviCommande statut={c.statut} />
        </section>
      )}

      <section className="carte p-[18px] flex flex-col gap-2.5">
        <h2 className="font-body text-[17px] font-extrabold mb-1">Articles</h2>
        {c.lignes_commande.map((l) => (
          <div key={l.id} className="flex justify-between gap-3 text-sm">
            <span>
              {l.nom_plat} × {l.quantite}
              {l.options && Object.keys(l.options).length > 0 && (
                <span className="block text-xs text-mosaique-gris">{Object.entries(l.options).map(([k, v]) => `${k} : ${v}`).join(' · ')}</span>
              )}
            </span>
            <span className="font-bold tabular-nums shrink-0">{formatPrix(l.sous_total)}</span>
          </div>
        ))}
        <div className="flex justify-between text-sm text-mosaique-gris"><span>Livraison</span><span className="tabular-nums">{formatPrix(c.frais_livraison)}</span></div>
        <div className="h-px bg-mosaique-creme my-1" />
        <div className="flex justify-between items-baseline"><span className="font-extrabold">Total</span><span className="prix text-[19px]">{formatPrix(c.total)}</span></div>
        <div className="flex gap-2.5 items-start mt-1.5 p-3 rounded-xl bg-mosaique-sable text-[13px] leading-relaxed">
          <MapPin size={18} className="text-mosaique-ocre-fonce shrink-0 mt-px" aria-hidden="true" />
          <span>{c.adresse_livraison} · {c.ville_livraison}<br />{c.telephone_livraison}{c.notes ? <><br />Note : {c.notes}</> : null}</span>
        </div>
      </section>
    </div>
  );
}
