/**
 * Notifications Mosaïque via Novu
 * Envoie email + SMS (selon canaux configurés dans Novu)
 */

import { createAdminClient } from '@/lib/supabase/server';
import type { StatutCommande } from '@/types';

interface NotifParams {
  type: 'nouvelle_commande' | 'commande_confirmee' | 'statut_change';
  commandeId: string;
  commandeNumero: string;
  userId: string;
  nouveauStatut?: StatutCommande;
}

const STATUT_MESSAGES: Record<string, string> = {
  en_preparation: 'Votre commande est en cours de préparation.',
  en_livraison: 'Votre commande est en route ! Le livreur est parti.',
  livree: 'Votre commande a été livrée. Bon appétit !',
  annulee: 'Votre commande a été annulée.',
};

export async function envoyerNotification(params: NotifParams) {
  if (!process.env.NOVU_API_KEY) {
    console.warn('[Novu] Clé API non configurée, notification ignorée.');
    return;
  }

  const supabaseAdmin = createAdminClient();

  // Récupérer le profil pour avoir email + téléphone
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('email, telephone, nom')
    .eq('id', params.userId)
    .single();

  if (!profile) return;

  let workflowId: string;
  let payload: Record<string, string> = {
    nom: profile.nom,
    numero: params.commandeNumero,
    url: `${process.env.NEXT_PUBLIC_APP_URL}/compte/commandes/${params.commandeId}`,
  };

  switch (params.type) {
    case 'nouvelle_commande':
      workflowId = 'mosaique-admin-nouvelle-commande';
      // Notifier l'admin (pas le client)
      await fetch('https://api.novu.co/v1/events/trigger', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `ApiKey ${process.env.NOVU_API_KEY}`,
        },
        body: JSON.stringify({
          name: workflowId,
          to: { subscriberId: 'admin', email: process.env.ADMIN_EMAIL },
          payload: { ...payload, client_nom: profile.nom },
        }),
      });
      return;

    case 'commande_confirmee':
      workflowId = 'mosaique-commande-confirmee';
      payload.delai = '45 minutes';
      break;

    case 'statut_change':
      workflowId = 'mosaique-statut-change';
      payload.statut = STATUT_MESSAGES[params.nouveauStatut ?? ''] ?? 'Votre commande a été mise à jour.';
      break;

    default:
      return;
  }

  // Envoyer au client
  await fetch('https://api.novu.co/v1/events/trigger', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `ApiKey ${process.env.NOVU_API_KEY}`,
    },
    body: JSON.stringify({
      name: workflowId,
      to: {
        subscriberId: params.userId,
        email: profile.email,
        phone: profile.telephone,
      },
      payload,
    }),
  });
}
