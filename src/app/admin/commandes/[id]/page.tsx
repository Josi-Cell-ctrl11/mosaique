import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { CommandeDetailAdminClient } from '@/components/admin/CommandeDetailAdminClient';
import type { Commande } from '@/types';

export const revalidate = 0;

export default async function AdminCommandeDetail({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data } = await supabase.from('commandes').select('*, profiles(*), lignes:lignes_commande(*)').eq('id', params.id).single();
  if (!data) notFound();
  return <CommandeDetailAdminClient commande={data as Commande} />;
}
