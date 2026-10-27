'use client';

import { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import type { OptionPlat, ValeurOption, Plat } from '@/types';
import { createClient } from '@/lib/supabase/client';
import { formatPrix } from '@/lib/utils';
import { toast } from 'sonner';

type AdminOption = OptionPlat & { platNom?: string };
interface Props { options: AdminOption[]; plats: Pick<Plat, 'id' | 'nom'>[] }

export function OptionsAdminClient({ options: initial, plats }: Props) {
  const supabase = createClient();
  const [options, setOptions] = useState(initial);
  const [ouvertes, setOuvertes] = useState<Record<string, boolean>>({});
  const [nouvelle, setNouvelle] = useState({ plat_id: '', nom: '', type: 'select' as 'select' | 'checkbox', required: false });
  const [valeurs, setValeurs] = useState<Record<string, { label: string; prix_sup: string }>>({});
  const [chargement, setChargement] = useState(false);

  async function ajouterOption() {
    if (!nouvelle.plat_id || !nouvelle.nom.trim()) { toast.error('Choisis un plat et donne un nom à l’option.'); return; }
    setChargement(true);
    const { data, error } = await supabase.from('options_plat').insert({ ...nouvelle, nom: nouvelle.nom.trim() }).select().single();
    setChargement(false);
    if (error) { toast.error('Impossible de créer cette option.'); return; }
    const platNom = plats.find((p) => p.id === nouvelle.plat_id)?.nom;
    setOptions((items) => [...items, { ...(data as OptionPlat), valeurs: [], platNom }]);
    setNouvelle({ plat_id: '', nom: '', type: 'select', required: false });
    toast.success('Option créée.');
  }

  async function supprimerOption(option: AdminOption) {
    if (!window.confirm(`Supprimer l’option « ${option.nom} » ?`)) return;
    const { error } = await supabase.from('options_plat').delete().eq('id', option.id);
    if (error) { toast.error('Impossible de supprimer cette option.'); return; }
    setOptions((items) => items.filter((item) => item.id !== option.id));
    toast.success('Option supprimée.');
  }

  async function ajouterValeur(option: AdminOption) {
    const form = valeurs[option.id] ?? { label: '', prix_sup: '0' };
    if (!form.label.trim()) { toast.error('Indique le nom de la valeur.'); return; }
    const { data, error } = await supabase.from('valeurs_option').insert({ option_id: option.id, label: form.label.trim(), prix_sup: Number(form.prix_sup || 0) }).select().single();
    if (error) { toast.error('Impossible d’ajouter cette valeur.'); return; }
    setOptions((items) => items.map((item) => item.id === option.id ? { ...item, valeurs: [...(item.valeurs ?? []), data as ValeurOption] } : item));
    setValeurs((state) => ({ ...state, [option.id]: { label: '', prix_sup: '0' } }));
    toast.success('Valeur ajoutée.');
  }

  async function supprimerValeur(optionId: string, valeur: ValeurOption) {
    const { error } = await supabase.from('valeurs_option').delete().eq('id', valeur.id);
    if (error) { toast.error('Impossible de supprimer cette valeur.'); return; }
    setOptions((items) => items.map((item) => item.id === optionId ? { ...item, valeurs: item.valeurs.filter((v) => v.id !== valeur.id) } : item));
    toast.success('Valeur supprimée.');
  }

  return <div className="space-y-8">
    <div className="bg-white rounded-card shadow-card p-6 space-y-4">
      <h2 className="font-semibold text-mosaique-nuit">Créer une option de plat</h2>
      <div className="grid md:grid-cols-4 gap-3">
        <select className="input-field" value={nouvelle.plat_id} onChange={(e) => setNouvelle((f) => ({ ...f, plat_id: e.target.value }))}><option value="">Choisir un plat…</option>{plats.map((plat) => <option key={plat.id} value={plat.id}>{plat.nom}</option>)}</select>
        <input className="input-field" placeholder="Nom : Taille, supplément…" value={nouvelle.nom} onChange={(e) => setNouvelle((f) => ({ ...f, nom: e.target.value }))} />
        <select className="input-field" value={nouvelle.type} onChange={(e) => setNouvelle((f) => ({ ...f, type: e.target.value as 'select' | 'checkbox' }))}><option value="select">Choix unique</option><option value="checkbox">Case à cocher</option></select>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={nouvelle.required} onChange={(e) => setNouvelle((f) => ({ ...f, required: e.target.checked }))} /> Obligatoire</label>
      </div>
      <button onClick={ajouterOption} disabled={chargement} className="btn-primary"><Plus size={16} /> {chargement ? 'Création…' : 'Ajouter l’option'}</button>
    </div>
    <div className="space-y-3">
      {options.length === 0 ? <p className="text-sm text-mosaique-gris">Aucune option configurée.</p> : options.map((option) => {
        const ouvert = Boolean(ouvertes[option.id]);
        const form = valeurs[option.id] ?? { label: '', prix_sup: '0' };
        return <div key={option.id} className="bg-white rounded-card shadow-card overflow-hidden">
          <div className="flex items-center justify-between gap-3 p-4"><button className="flex items-center gap-3 text-left" onClick={() => setOuvertes((s) => ({ ...s, [option.id]: !ouvert }))}>{ouvert ? <ChevronDown size={18} /> : <ChevronRight size={18} />}<span className="font-medium text-mosaique-nuit">{option.nom}</span><span className="text-xs text-mosaique-gris">{option.platNom ?? 'Plat'} · {option.required ? 'obligatoire' : 'facultative'}</span></button><button onClick={() => supprimerOption(option)} className="p-2 text-mosaique-gris hover:text-mosaique-epice" aria-label={`Supprimer ${option.nom}`}><Trash2 size={16} /></button></div>
          {ouvert && <div className="border-t border-mosaique-creme p-4 space-y-3">
            {(option.valeurs ?? []).map((valeur) => <div key={valeur.id} className="flex items-center justify-between text-sm"><span>{valeur.label}</span><span className="flex items-center gap-3"><span className="prix">{valeur.prix_sup ? `+ ${formatPrix(valeur.prix_sup)}` : 'Inclus'}</span><button onClick={() => supprimerValeur(option.id, valeur)} className="text-mosaique-gris hover:text-mosaique-epice" aria-label={`Supprimer ${valeur.label}`}><Trash2 size={14} /></button></span></div>)}
            <div className="flex gap-2 pt-2"><input className="input-field flex-1" placeholder="Nouvelle valeur" value={form.label} onChange={(e) => setValeurs((s) => ({ ...s, [option.id]: { ...form, label: e.target.value } }))} /><input className="input-field w-36" type="number" placeholder="Supplément" value={form.prix_sup} onChange={(e) => setValeurs((s) => ({ ...s, [option.id]: { ...form, prix_sup: e.target.value } }))} /><button onClick={() => ajouterValeur(option)} className="btn-primary px-4" aria-label="Ajouter la valeur"><Plus size={16} /></button></div>
          </div>}
        </div>;
      })}
    </div>
  </div>;
}
