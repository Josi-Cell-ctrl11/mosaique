'use client';

import { useState } from 'react';
import { Check, Star, Trash2, X } from 'lucide-react';
import type { Avis } from '@/types';
import { createClient } from '@/lib/supabase/client';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';

type AvisAdmin = Avis & { platNom?: string; auteur?: string; email?: string };
interface Props { avis: AvisAdmin[] }

export function AvisAdminClient({ avis: initial }: Props) {
  const supabase = createClient();
  const [avis, setAvis] = useState(initial);
  const [filtre, setFiltre] = useState<'tous' | 'en_attente' | 'approuves'>('tous');
  const visibles = avis.filter((item) => filtre === 'tous' || (filtre === 'approuves' ? item.approuve : !item.approuve));

  async function changerApprobation(item: AvisAdmin, approuve: boolean) {
    const { error } = await supabase.from('avis').update({ approuve }).eq('id', item.id);
    if (error) { toast.error('Impossible de modifier cet avis.'); return; }
    setAvis((items) => items.map((avisItem) => avisItem.id === item.id ? { ...avisItem, approuve } : avisItem));
    toast.success(approuve ? 'Avis publié.' : 'Avis retiré de la publication.');
  }

  async function supprimer(item: AvisAdmin) {
    if (!window.confirm('Supprimer définitivement cet avis ?')) return;
    const { error } = await supabase.from('avis').delete().eq('id', item.id);
    if (error) { toast.error('Impossible de supprimer cet avis.'); return; }
    setAvis((items) => items.filter((avisItem) => avisItem.id !== item.id));
    toast.success('Avis supprimé.');
  }

  return <div className="space-y-5">
    <div className="flex gap-2 flex-wrap">{(['tous', 'en_attente', 'approuves'] as const).map((valeur) => <button key={valeur} onClick={() => setFiltre(valeur)} className={`px-3 py-1.5 rounded-full text-xs font-medium border ${filtre === valeur ? 'bg-mosaique-ocre text-white border-mosaique-ocre' : 'bg-white text-mosaique-gris border-mosaique-creme'}`}>{valeur === 'tous' ? 'Tous' : valeur === 'en_attente' ? 'En attente' : 'Publiés'} ({valeur === 'tous' ? avis.length : avis.filter((item) => valeur === 'approuves' ? item.approuve : !item.approuve).length})</button>)}</div>
    {visibles.length === 0 ? <div className="bg-white rounded-card shadow-card p-8 text-center text-mosaique-gris">Aucun avis dans cette catégorie.</div> : <div className="space-y-3">{visibles.map((item) => <article key={item.id} className="bg-white rounded-card shadow-card p-5"><div className="flex items-start justify-between gap-4"><div><div className="flex items-center gap-2"><strong className="text-mosaique-nuit">{item.auteur ?? 'Client'}</strong><span className="text-xs text-mosaique-gris">sur {item.platNom ?? 'un plat'}</span></div><div className="flex items-center gap-1 text-mosaique-ocre mt-1">{[1, 2, 3, 4, 5].map((note) => <Star key={note} size={14} fill={note <= item.note ? 'currentColor' : 'none'} />)}</div></div><span className={`text-xs px-2 py-1 rounded-full ${item.approuve ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{item.approuve ? 'Publié' : 'En attente'}</span></div><p className="text-sm text-mosaique-nuit mt-4">{item.commentaire || 'Aucun commentaire.'}</p><div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-mosaique-creme"><span className="text-xs text-mosaique-gris">{formatDate(item.created_at)}</span><div className="flex gap-2">{item.approuve ? <button onClick={() => changerApprobation(item, false)} className="btn-secondary text-xs py-2"><X size={14} /> Retirer</button> : <button onClick={() => changerApprobation(item, true)} className="btn-primary text-xs py-2"><Check size={14} /> Publier</button>}<button onClick={() => supprimer(item)} className="p-2 text-mosaique-gris hover:text-mosaique-epice" aria-label="Supprimer l’avis"><Trash2 size={16} /></button></div></div></article>)}</div>}
  </div>;
}
