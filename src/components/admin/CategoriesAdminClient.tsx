'use client';

import { useState } from 'react';
import { Pencil, Plus, Save, Trash2, X } from 'lucide-react';
import type { Categorie } from '@/types';
import { slugify } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface Props { categories: Categorie[] }
type FormCategorie = { nom: string; slug: string; ordre: number | '' };
const VIDE: FormCategorie = { nom: '', slug: '', ordre: 0 };

export function CategoriesAdminClient({ categories: initial }: Props) {
  const supabase = createClient();
  const [categories, setCategories] = useState(initial);
  const [form, setForm] = useState<FormCategorie>(VIDE);
  const [edition, setEdition] = useState<Categorie | null>(null);
  const [ouvert, setOuvert] = useState(false);
  const [chargement, setChargement] = useState(false);

  function ouvrir(categorie?: Categorie) {
    setEdition(categorie ?? null);
    setForm(categorie ? { nom: categorie.nom, slug: categorie.slug, ordre: categorie.ordre } : VIDE);
    setOuvert(true);
  }

  function fermer() { setOuvert(false); setEdition(null); setForm(VIDE); }

  async function sauvegarder() {
    if (!form.nom.trim()) { toast.error('Le nom de la catégorie est obligatoire.'); return; }
    setChargement(true);
    const data = { nom: form.nom.trim(), slug: slugify(form.slug || form.nom), ordre: Number(form.ordre || 0) };
    const result = edition
      ? await supabase.from('categories').update(data).eq('id', edition.id).select().single()
      : await supabase.from('categories').insert(data).select().single();
    setChargement(false);
    if (result.error) { toast.error(result.error.message.includes('duplicate') ? 'Ce slug existe déjà.' : 'Impossible d’enregistrer la catégorie.'); return; }
    if (edition) setCategories((items) => items.map((item) => item.id === edition.id ? result.data as Categorie : item));
    else setCategories((items) => [...items, result.data as Categorie].sort((a, b) => a.ordre - b.ordre));
    toast.success(edition ? 'Catégorie mise à jour.' : 'Catégorie créée.');
    fermer();
  }

  async function supprimer(categorie: Categorie) {
    if (!window.confirm(`Supprimer « ${categorie.nom} » ? Les plats liés doivent d’abord être déplacés.`)) return;
    const { error } = await supabase.from('categories').delete().eq('id', categorie.id);
    if (error) { toast.error('Suppression impossible : vérifie les plats liés à cette catégorie.'); return; }
    setCategories((items) => items.filter((item) => item.id !== categorie.id));
    toast.success('Catégorie supprimée.');
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <button onClick={() => ouvrir()} className="btn-primary"><Plus size={16} /> Ajouter une catégorie</button>
      </div>
      <div className="bg-white rounded-card shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="bg-mosaique-ivoire border-b border-mosaique-creme text-xs text-mosaique-gris uppercase">
            <th className="text-left px-4 py-3">Nom</th><th className="text-left px-4 py-3">Slug</th><th className="text-center px-4 py-3">Ordre</th><th className="text-right px-4 py-3">Actions</th>
          </tr></thead>
          <tbody className="divide-y divide-mosaique-creme">
            {categories.sort((a, b) => a.ordre - b.ordre).map((categorie) => (
              <tr key={categorie.id}>
                <td className="px-4 py-3 font-medium text-mosaique-nuit">{categorie.nom}</td>
                <td className="px-4 py-3 text-mosaique-gris font-mono text-xs">{categorie.slug}</td>
                <td className="px-4 py-3 text-center">{categorie.ordre}</td>
                <td className="px-4 py-3 text-right"><div className="flex justify-end gap-2">
                  <button onClick={() => ouvrir(categorie)} className="p-2 text-mosaique-gris hover:text-mosaique-ocre" aria-label={`Modifier ${categorie.nom}`}><Pencil size={15} /></button>
                  <button onClick={() => supprimer(categorie)} className="p-2 text-mosaique-gris hover:text-mosaique-epice" aria-label={`Supprimer ${categorie.nom}`}><Trash2 size={15} /></button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {ouvert && <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <button className="absolute inset-0 bg-mosaique-nuit/50" onClick={fermer} aria-label="Fermer" />
        <div className="relative bg-white rounded-card shadow-2xl w-full max-w-lg p-6 space-y-4">
          <div className="flex items-center justify-between"><h2 className="font-display text-xl font-bold text-mosaique-terre">{edition ? 'Modifier la catégorie' : 'Nouvelle catégorie'}</h2><button onClick={fermer} aria-label="Fermer"><X size={20} /></button></div>
          <div><label className="label-field">Nom *</label><input className="input-field" value={form.nom} onChange={(e) => setForm((f) => ({ ...f, nom: e.target.value, slug: f.slug || slugify(e.target.value) }))} /></div>
          <div><label className="label-field">Slug</label><input className="input-field" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} /></div>
          <div><label className="label-field">Ordre</label><input className="input-field" type="number" value={form.ordre} onChange={(e) => setForm((f) => ({ ...f, ordre: e.target.value ? Number(e.target.value) : '' }))} /></div>
          <button onClick={sauvegarder} disabled={chargement} className="btn-primary w-full justify-center"><Save size={16} /> {chargement ? 'Enregistrement…' : 'Enregistrer'}</button>
        </div>
      </div>}
    </div>
  );
}
