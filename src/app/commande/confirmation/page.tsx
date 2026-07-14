import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, Clock } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Commande confirmée' };

interface Props {
  searchParams: { commande?: string; status?: string; id?: string };
}

export default async function PageConfirmation({ searchParams }: Props) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/connexion');

  const commandeId = searchParams.commande;
  const fedapayStatus = searchParams.status; // 'approved' | 'declined' | 'canceled'
  const fedapayTxId = searchParams.id;

  // Si FedaPay retourne approved, mettre à jour le statut directement
  if (commandeId && fedapayStatus === 'approved' && fedapayTxId) {
    const { createAdminClient } = await import('@/lib/supabase/server');
    const supabaseAdmin = createAdminClient();
    await supabaseAdmin
      .from('commandes')
      .update({ statut_paiement: 'paye', statut: 'en_preparation' })
      .eq('id', commandeId)
      .eq('utilisateur_id', user.id);
  }

  let commande = null;

  if (commandeId) {
    const { data } = await supabase
      .from('commandes')
      .select('*, lignes_commande(*)')
      .eq('id', commandeId)
      .eq('utilisateur_id', user.id)
      .single();
    commande = data;
  }

  const delaiEstime = commande?.heure_livraison
    ? new Date(commande.heure_livraison).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    : 'environ 45 minutes';

  return (
    <div className="pt-16 lg:pt-20 min-h-screen bg-mosaique-ivoire">
      <div className="container-site py-16">
        <div className="max-w-lg mx-auto text-center">
          {/* Icône succès */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-mosaique-vert/10 rounded-full flex items-center justify-center">
              <CheckCircle size={40} className="text-mosaique-vert" />
            </div>
          </div>

          <h1 className="font-display text-3xl font-bold text-mosaique-terre mb-3">
            Commande confirmée
          </h1>

          {commande && (
            <p className="text-mosaique-gris text-lg mb-8">
              N° <span className="font-semibold text-mosaique-ocre">{commande.numero}</span>
            </p>
          )}

          {/* Ce qui se passe maintenant — concret, pas "bientôt" */}
          <div className="bg-white rounded-card shadow-card p-6 text-left space-y-4 mb-8">
            <div className="flex items-start gap-4">
              <Package size={20} className="text-mosaique-ocre mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-mosaique-nuit">Votre commande est en préparation</p>
                <p className="text-sm text-mosaique-gris mt-0.5">
                  Notre équipe prépare votre repas dès maintenant.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Clock size={20} className="text-mosaique-ocre mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-mosaique-nuit">
                  Livraison prévue dans {delaiEstime}
                </p>
                <p className="text-sm text-mosaique-gris mt-0.5">
                  Vous recevrez une notification quand votre livreur sera en route.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/compte/commandes" className="btn-primary flex-1">
              Suivre ma commande
            </Link>
            <Link href="/menu" className="btn-secondary flex-1">
              Continuer à commander
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
