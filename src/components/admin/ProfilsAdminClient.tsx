'use client';

import { useState } from 'react';
import { Pencil, ShieldCheck, ShieldOff, Save, X } from 'lucide-react';
import type { Profile } from '@/types';
import { createClient } from '@/lib/supabase/client';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';

interface Props { profils: Profile[]; currentUserId: string }
type FormProfil = { nom: string; telephone: string; adresse: string; ville: string; is_admin: boolean };

export function ProfilsAdminClient({ profils: initial, currentUserId }: Props) {
  const supabase = createClient();
  const [profils, setProfils] = useState(initial);
  const [edition, setEdition] = useState<Profile | null>(null);
  const [form, setForm] = useState<FormProfil | null>(null);
  const [chargement, setChargement] = useState(false);

  function ouvrir(profil: Profile) {
    setEdition(profil);
    setForm({ nom: profil.nom, telephone: profil.telephone, adresse: profil.adresse ?? '', ville: profil.ville ?? '', is_admin: profil.is_admin });
  }

  function fermer() { setEdition(null); setForm(null); }

  async function sauvegarder() {
    if (!edition || !form || !form.nom.trim() || !form.telephone.trim()) { toast.error('Le nom et le téléphone sont obligatoires.'); return; }
    if (edition.id === currentUserId && !form.is_admin) { toast.error('Tu ne peux pas retirer tes propres droits admin.'); return; }
    setChargement(true);
    const { data, error } = await supabase.from('profiles').update({ nom: form.nom.trim(), telephone: form.telephone.trim(), adresse: form.adresse.trim() || null, ville: form.ville.trim() || null, is_admin: form.is_admin }).eq('id', edition.id).select().single();
    setChargement(false);
    if (error) { toast.error('Impossible de mettre à jour ce profil.'); return; }
    setProfils((items) => items.map((item) => item.id === edition.id ? data as Profile : item));
    toast.success('Profil mis à jour.');
    fermer();
  }

  return <div className="bg-white rounded-card shadow-card overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="bg-mosaique-ivoire border-b border-mosaique-creme text-xs text-mosaique-gris uppercase"><th className="text-left px-4 py-3">Profil</th><th className="text-left px-4 py-3">Contact</th><th className="text-center px-4 py-3">Droits</th><th className="text-left px-4 py-3">Créé le</th><th className="text-right px-4 py-3">Actions</th></tr></thead><tbody className="divide-y divide-mosaique-creme">{profils.map((profil) => <tr key={profil.id}><td className="px-4 py-3"><div className="font-medium text-mosaique-nuit">{profil.nom || 'Sans nom'}</div><div className="text-xs text-mosaique-gris">{profil.email}</div></td><td className="px-4 py-3 text-mosaique-gris">{profil.telephone || '—'}<br />{profil.ville || 'Ville non renseignée'}</td><td className="px-4 py-3 text-center">{profil.is_admin ? <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-green-100 text-green-800"><ShieldCheck size={13} /> Admin</span> : <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600"><ShieldOff size={13} /> Client</span>}</td><td className="px-4 py-3 text-mosaique-gris">{formatDate(profil.created_at)}</td><td className="px-4 py-3 text-right"><button onClick={() => ouvrir(profil)} className="p-2 text-mosaique-gris hover:text-mosaique-ocre" aria-label={`Modifier ${profil.nom}`}><Pencil size={15} /></button></td></tr>)}</tbody></table></div>{edition && form && <div className="fixed inset-0 z-50 flex items-center justify-center p-4"><button className="absolute inset-0 bg-mosaique-nuit/50" onClick={fermer} aria-label="Fermer" /><div className="relative bg-white rounded-card shadow-2xl w-full max-w-lg p-6 space-y-4"><div className="flex items-center justify-between"><h2 className="font-display text-xl font-bold text-mosaique-terre">Modifier le profil</h2><button onClick={fermer} aria-label="Fermer"><X size={20} /></button></div><p className="text-sm text-mosaique-gris">{edition.email}</p><div><label className="label-field">Nom</label><input className="input-field" value={form.nom} onChange={(e) => setForm((f) => f && ({ ...f, nom: e.target.value }))} /></div><div><label className="label-field">Téléphone</label><input className="input-field" value={form.telephone} onChange={(e) => setForm((f) => f && ({ ...f, telephone: e.target.value }))} /></div><div className="grid sm:grid-cols-2 gap-3"><div><label className="label-field">Adresse</label><input className="input-field" value={form.adresse} onChange={(e) => setForm((f) => f && ({ ...f, adresse: e.target.value }))} /></div><div><label className="label-field">Ville</label><input className="input-field" value={form.ville} onChange={(e) => setForm((f) => f && ({ ...f, ville: e.target.value }))} /></div></div><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_admin} onChange={(e) => setForm((f) => f && ({ ...f, is_admin: e.target.checked }))} disabled={edition.id === currentUserId} /> Compte administrateur</label><button onClick={sauvegarder} disabled={chargement} className="btn-primary w-full justify-center"><Save size={16} /> {chargement ? 'Enregistrement…' : 'Enregistrer'}</button></div></div>}</div>;
}
