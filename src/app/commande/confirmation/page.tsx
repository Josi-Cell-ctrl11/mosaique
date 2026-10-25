import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Check, Clock, MapPin } from 'lucide-react';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { synchroniserPaiement } from '@/lib/fedapay';
import { SuiviCommande } from '@/components/commande/SuiviCommande';
import { formatPrix } from '@/lib/utils';
import type { Commande, LigneCommande } from '@/types';

export const metadata: Metadata = { title: 'Votre commande' };
export const dynamic = 'force-dynamic';

interface Props {
  searchParams: { commande?: string };
}

export default async function PageConfirmation({ searchParams }: Props) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/connexion');

  const commandeId = searchParams.commande;
  if (!commandeId) redirect('/compte/commandes');

  // Vérifier que la commande appartient bien au visiteur AVANT toute action
  const { data: proprietaire } = await supabase.from('commandes').select('id').eq('id', commandeId).eq('utilisateur_id', user.id).maybeSingle();
  if (!proprietaire) redirect('/compte/commandes');

  // Les paramètres d'URL renvoyés par FedaPay sont ignorés : on interroge FedaPay directement
  await synchroniserPaiement(commandeId);

  const { data } = await supabase
    .from('commandes')
    .select('*, lignes_commande(*)')
    .eq('id', commandeId)
    .single();
  const commande = data as (Commande & { lignes_commande: LigneCommande[] }) | null;
  if (!commande) redirect('/compte/commandes');

  const { data: profil } = await supabase.from('profiles').select('nom').eq('id', user.id).maybeSingle();
  const prenom = (profil?.nom ?? '').split(' ')[0];
  const paye = commande.statut_paiement === 'paye';
  const echoue = commande.statut_paiement === 'echoue';

  const heure = commande.heure_livraison
    ? new Date(commande.heure_livraison).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Porto-Novo' })
    : null;

  return (
    <div className="pt-16 lg:pt-20 min-h-screen">
      <section className="bg-mosaique-nuit px-6 pt-10 pb-9 flex flex-col items-center gap-3.5 text-center">
        <span className={`w-[68px] h-[68px] rounded-[22px] flex items-center justify-center ${paye ? 'bg-mosaique-or text-mosaique-nuit' : 'bg-mosaique-brun text-mosaique-or'}`}>
          {paye ? <Check size={34} strokeWidth={2.6} aria-hidden="true" /> : <Clock size={30} aria-hidden="true" />}
        </span>
        <h1 className="font-display text-[1.9rem] lg:text-4xl font-semibold text-mosaique-ivoire">
          {paye ? `Merci${prenom ? `, ${prenom}` : ''} !` : echoue ? 'Paiement non abouti' : 'Paiement en cours de vérification'}
        </h1>
        <p className="text-[15px] text-[#C9BFAF] max-w-sm">
          {paye
            ? 'Paiement reçu. Votre commande est en cuisine.'
            : echoue
              ? 'Le paiement a été refusé ou annulé. Vous pouvez réessayer depuis vos commandes.'
              : 'Si vous venez de payer, actualisez cette page dans quelques secondes.'}
        </p>
        <span className="text-[13px] font-extrabold tracking-wide text-mosaique-or-pale border border-mosaique-trait rounded-[10px] px-3.5 py-2 tabular-nums">{commande.numero}</span>
      </section>

      <div className="container-site max-w-xl py-6 flex flex-col gap-4">
        <section className="carte p-[18px] flex flex-col gap-4">
          <div className="flex justify-between items-center gap-3">
            <h2 className="font-body text-[17px] font-extrabold">Suivi</h2>
            {heure && <span className="text-[13px] font-bold text-mosaique-gris">Livraison prévue <strong className="text-mosaique-terre">{heure}</strong></span>}
          </div>
          {paye || commande.statut !== 'en_attente_paiement'
            ? <SuiviCommande statut={commande.statut} />
            : <p className="text-sm text-mosaique-gris">Le suivi démarre dès que le paiement est confirmé.</p>}
        </section>

        <section className="carte p-[18px] flex flex-col gap-2.5">
          <h2 className="font-body text-[17px] font-extrabold mb-1">Votre commande</h2>
          {commande.lignes_commande.map((l) => (
            <div key={l.id} className="flex justify-between gap-3 text-sm">
              <span>{l.nom_plat} × {l.quantite}</span>
              <span className="font-bold tabular-nums shrink-0">{formatPrix(l.sous_total)}</span>
            </div>
          ))}
          <div className="flex justify-between gap-3 text-sm text-mosaique-gris"><span>Livraison</span><span className="tabular-nums">{formatPrix(commande.frais_livraison)}</span></div>
          <div className="h-px bg-mosaique-creme my-1" />
          <div className="flex justify-between items-baseline"><span className="font-extrabold">{paye ? 'Total payé' : 'Total'}</span><span className="prix text-[19px]">{formatPrix(commande.total)}</span></div>
          <div className="flex gap-2.5 items-start mt-1.5 p-3 rounded-xl bg-mosaique-sable text-[13px] leading-relaxed">
            <MapPin size={18} className="text-mosaique-ocre-fonce shrink-0 mt-px" aria-hidden="true" />
            <span>{commande.adresse_livraison} · {commande.ville_livraison}<br />{commande.telephone_livraison}</span>
          </div>
        </section>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/compte/commandes" className="btn-primary flex-1">Mes commandes</Link>
          <Link href="/menu" className="btn-secondary flex-1">Continuer à commander</Link>
        </div>
      </div>
    </div>
  );
}
