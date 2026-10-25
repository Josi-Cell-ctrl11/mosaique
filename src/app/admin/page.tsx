import Link from 'next/link';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { formatPrix } from '@/lib/utils';
import { BoutonAvancerStatut } from '@/components/admin/BoutonAvancerStatut';
import type { Commande, StatutCommande } from '@/types';

export const metadata: Metadata = { title: 'Tableau de bord' };
export const dynamic = 'force-dynamic';

const FUSEAU = 'Africa/Porto-Novo';
const jourBenin = (d: Date) => new Intl.DateTimeFormat('fr-CA', { timeZone: FUSEAU }).format(d); // AAAA-MM-JJ
const depuis = (iso: string) => {
  const min = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  return min < 60 ? `${min} min` : min < 1440 ? `${Math.floor(min / 60)} h` : `${Math.floor(min / 1440)} j`;
};

type CommandeAvecClient = Commande & { profiles: { nom: string } | null; lignes_commande: Array<{ nom_plat: string; quantite: number }> };

export default async function AdminDashboard() {
  const supabase = createClient();
  const il_y_a_7j = new Date(Date.now() - 7 * 86400000).toISOString();

  const [{ data: aTraiterData }, { data: recentesData }] = await Promise.all([
    supabase
      .from('commandes')
      .select('*, profiles(nom), lignes_commande(nom_plat, quantite)')
      .in('statut', ['payee', 'en_preparation', 'en_livraison'])
      .order('created_at', { ascending: true }),
    supabase
      .from('commandes')
      .select('id, total, statut_paiement, created_at, lignes_commande(nom_plat, quantite)')
      .gte('created_at', il_y_a_7j),
  ]);
  const aTraiter = (aTraiterData ?? []) as CommandeAvecClient[];
  const recentes = (recentesData ?? []) as Array<{ id: string; total: number; statut_paiement: string; created_at: string; lignes_commande: Array<{ nom_plat: string; quantite: number }> }>;

  const aujourdhui = jourBenin(new Date());
  const payees = recentes.filter((c) => c.statut_paiement === 'paye');
  const payeesJour = payees.filter((c) => jourBenin(new Date(c.created_at)) === aujourdhui);
  const caJour = payeesJour.reduce((t, c) => t + c.total, 0);
  const enAttente = recentes.filter((c) => c.statut_paiement === 'en_attente').length;
  const panierMoyen = payees.length ? Math.round(payees.reduce((t, c) => t + c.total, 0) / payees.length) : 0;

  // Ventes des 7 derniers jours
  const jours = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - (6 - i) * 86400000);
    const cle = jourBenin(d);
    const total = payees.filter((c) => jourBenin(new Date(c.created_at)) === cle).reduce((t, c) => t + c.total, 0);
    return { cle, libelle: new Intl.DateTimeFormat('fr-FR', { weekday: 'short', timeZone: FUSEAU }).format(d).replace('.', ''), total };
  });
  const max = Math.max(1, ...jours.map((j) => j.total));

  // Plats les plus vendus (7 jours, commandes payées)
  const compte = new Map<string, number>();
  payees.forEach((c) => c.lignes_commande.forEach((l) => compte.set(l.nom_plat, (compte.get(l.nom_plat) ?? 0) + l.quantite)));
  const top = Array.from(compte.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const colonnes: Array<{ titre: string; statut: StatutCommande }> = [
    { titre: 'Payées · à lancer', statut: 'payee' },
    { titre: 'En préparation', statut: 'en_preparation' },
    { titre: 'En livraison', statut: 'en_livraison' },
  ];

  const dateDuJour = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: FUSEAU }).format(new Date());

  return (
    <div className="flex flex-col gap-6">
      <header>
        <p className="text-sm text-mosaique-gris first-letter:uppercase">{dateDuJour}</p>
        <h1 className="font-display text-[2rem] font-semibold mt-1">Tableau de bord</h1>
      </header>

      <section aria-label="Chiffres du jour" className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3.5">
        <div className="bg-mosaique-nuit text-mosaique-ivoire rounded-[18px] p-[18px] flex flex-col gap-2">
          <span className="text-[13px] text-[#C9BFAF]">Chiffre d’affaires du jour</span>
          <span className="text-[26px] font-extrabold text-mosaique-or tabular-nums">{formatPrix(caJour)}</span>
        </div>
        {[
          ['Commandes payées aujourd’hui', String(payeesJour.length), ''],
          ['Panier moyen (7 jours)', formatPrix(panierMoyen), ''],
          ['Paiements en attente (7 jours)', String(enAttente), enAttente ? 'À relancer ou annuler' : ''],
        ].map(([titre, valeur, note]) => (
          <div key={titre} className="carte p-[18px] flex flex-col gap-2">
            <span className="text-[13px] text-mosaique-gris">{titre}</span>
            <span className="text-[26px] font-extrabold tabular-nums">{valeur}</span>
            {note && <span className="text-[13px] text-[#7A4B00]">{note}</span>}
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-3.5">
        <div className="flex justify-between items-baseline gap-3 flex-wrap">
          <h2 className="font-body text-[19px] font-extrabold">À traiter maintenant</h2>
          <Link href="/admin/commandes" className="text-sm font-extrabold text-mosaique-ocre">Toutes les commandes →</Link>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-3.5">
          {colonnes.map((col) => {
            const cartes = aTraiter.filter((c) => c.statut === col.statut);
            return (
              <div key={col.statut} className="bg-[#EDE6DA] rounded-[18px] p-3 flex flex-col gap-2.5 min-h-[200px]">
                <div className="flex justify-between items-center px-1.5 py-1"><span className="text-sm font-extrabold">{col.titre}</span><span className="text-[13px] font-extrabold text-mosaique-gris">{cartes.length}</span></div>
                {cartes.length === 0 && <p className="text-[13px] text-mosaique-gris px-1.5">Rien pour l’instant.</p>}
                {cartes.map((c) => (
                  <div key={c.id} className="bg-white rounded-[14px] p-3.5 flex flex-col gap-2 shadow-card">
                    <div className="flex justify-between items-center"><Link href={`/admin/commandes/${c.id}`} className="text-sm font-extrabold hover:text-mosaique-ocre tabular-nums">{c.numero}</Link><span className="text-xs font-bold text-mosaique-gris">{depuis(c.created_at)}</span></div>
                    <span className="text-[13px] text-mosaique-gris">{c.profiles?.nom || 'Client'} · {c.ville_livraison}</span>
                    <span className="text-sm font-semibold">{c.lignes_commande.map((l) => `${l.nom_plat}${l.quantite > 1 ? ` × ${l.quantite}` : ''}`).join(', ')}</span>
                    <div className="flex justify-between items-center pt-1"><span className="text-sm font-extrabold text-mosaique-ocre">{formatPrix(c.total)}</span><BoutonAvancerStatut commandeId={c.id} statut={c.statut} /></div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </section>

      <div className="flex flex-wrap gap-3.5">
        <section className="flex-[2_1_420px] carte p-5 flex flex-col gap-4">
          <div className="flex justify-between items-baseline"><h2 className="font-body text-[17px] font-extrabold">Ventes · 7 derniers jours</h2><span className="text-[13px] text-mosaique-gris">commandes payées</span></div>
          <div role="img" aria-label={`Ventes des 7 derniers jours : ${jours.map((j) => `${j.libelle} ${formatPrix(j.total)}`).join(', ')}`} className="grid grid-cols-7 gap-3 items-end h-[190px]">
            {jours.map((j, i) => (
              <div key={j.cle} className="flex flex-col items-center gap-1.5 h-full justify-end">
                <span className="text-[11px] font-bold text-mosaique-gris tabular-nums">{j.total ? `${Math.round(j.total / 1000)}k` : '–'}</span>
                <span className={`w-full max-w-[44px] rounded-t-lg rounded-b-[3px] ${i === 6 ? 'bg-mosaique-or' : 'bg-[#2A231C]'}`} style={{ height: `${Math.max(3, Math.round((j.total / max) * 130))}px` }} />
                <span className="text-xs font-bold first-letter:uppercase">{j.libelle}</span>
              </div>
            ))}
          </div>
        </section>
        <section className="flex-[1_1_280px] carte p-5 flex flex-col gap-3">
          <h2 className="font-body text-[17px] font-extrabold">Plats les plus vendus (7 jours)</h2>
          {top.length === 0 ? <p className="text-sm text-mosaique-gris">Pas encore de vente payée cette semaine.</p> : top.map(([nom, n], i) => (
            <div key={nom} className="flex items-center gap-3"><span className="w-6 font-extrabold text-mosaique-ocre">{i + 1}</span><span className="flex-1 text-sm font-bold">{nom}</span><span className="text-sm font-extrabold">× {n}</span></div>
          ))}
        </section>
      </div>
    </div>
  );
}
