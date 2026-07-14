'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import type { Plat, Categorie } from '@/types';
import { formatPrix, imagePlaceholder, slugify } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface Props {
  plats: Plat[];
  categories: Categorie[];
}

interface FormPlat {
  nom: string;
  categorie_id: string;
  description: string;
  ingredients: string;
  prix: number | '';
  est_vegetarien: boolean;
  est_epice: boolean;
  est_vedette: boolean;
  disponible: boolean;
  image_url: string;
}

const FORM_VIDE: FormPlat = {
  nom: '', categorie_id: '', description: '', ingredients: '',
  prix: '', est_vegetarien: false, est_epice: false,
  est_vedette: false, disponible: true, image_url: '',
};

export function PlatsAdminClient({ plats: initial, categories }: Props) {
  const supabase = createClient();
  const router = useRouter();
  const [plats, setPlats] = useState(initial);
  const [modalOuverte, setModalOuverte] = useState(false);
  const [platEnEdition, setPlatEnEdition] = useState<Plat | null>(null);
  const [form, setForm] = useState<FormPlat>(FORM_VIDE);
  const [uploading, setUploading] = useState(false);
  const [sauvegarde, setSauvegarde] = useState(false);

  function ouvrirCreation() {
    setPlatEnEdition(null);
    setForm(FORM_VIDE);
    setModalOuverte(true);
  }

  function ouvrirEdition(plat: Plat) {
    setPlatEnEdition(plat);
    setForm({
      nom: plat.nom,
      categorie_id: plat.categorie_id,
      description: plat.description,
      ingredients: plat.ingredients ?? '',
      prix: plat.prix,
      est_vegetarien: plat.est_vegetarien,
      est_epice: plat.est_epice,
      est_vedette: plat.est_vedette,
      disponible: plat.disponible,
      image_url: plat.image_url ?? '',
    });
    setModalOuverte(true);
  }

  async function uploadPhoto(file: File) {
    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `plats/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage.from('photos').upload(path, file);
    if (error) {
      toast.error('Erreur upload photo.');
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('photos').getPublicUrl(path);
    setForm((f) => ({ ...f, image_url: publicUrl }));
    setUploading(false);
  }

  async function sauvegarder() {
    if (!form.nom || !form.categorie_id || !form.description || !form.prix) {
      toast.error('Remplissez tous les champs obligatoires.');
      return;
    }

    setSauvegarde(true);
    const data = {
      nom:            form.nom,
      slug:           slugify(form.nom),
      categorie_id:   form.categorie_id,
      description:    form.description,
      ingredients:    form.ingredients,
      prix:           Number(form.prix),
      est_vegetarien: form.est_vegetarien,
      est_epice:      form.est_epice,
      est_vedette:    form.est_vedette,
      disponible:     form.disponible,
      image_url:      form.image_url || null,
    };

    if (platEnEdition) {
      const { error } = await supabase.from('plats').update(data).eq('id', platEnEdition.id);
      if (error) { toast.error('Erreur sauvegarde.'); setSauvegarde(false); return; }
      setPlats((p) => p.map((pl) => pl.id === platEnEdition.id ? { ...pl, ...data } : pl));
      toast.success('Plat mis à jour.');
    } else {
      const { data: nouveau, error } = await supabase.from('plats').insert(data).select().single();
      if (error) { toast.error('Erreur création.'); setSauvegarde(false); return; }
      setPlats((p) => [...p, nouveau as Plat]);
      toast.success('Plat créé.');
    }

    setSauvegarde(false);
    setModalOuverte(false);
    router.refresh();
  }

  async function toggleDisponible(plat: Plat) {
    const { error } = await supabase
      .from('plats')
      .update({ disponible: !plat.disponible })
      .eq('id', plat.id);
    if (error) { toast.error('Erreur.'); return; }
    setPlats((p) => p.map((pl) => pl.id === plat.id ? { ...pl, disponible: !pl.disponible } : pl));
  }

  async function supprimerPlat(plat: Plat) {
    if (!confirm(`Supprimer "${plat.nom}" ? Cette action est irréversible.`)) return;
    const { error } = await supabase.from('plats').delete().eq('id', plat.id);
    if (error) { toast.error('Erreur suppression.'); return; }
    setPlats((p) => p.filter((pl) => pl.id !== plat.id));
    toast.success('Plat supprimé.');
  }

  return (
    <div>
      {/* Bouton créer */}
      <div className="flex justify-end mb-4">
        <button onClick={ouvrirCreation} className="btn-primary">
          <Plus size={16} /> Ajouter un plat
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-card shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-mosaique-ivoire border-b border-mosaique-creme text-xs text-mosaique-gris uppercase">
              <th className="text-left px-4 py-3">Photo</th>
              <th className="text-left px-4 py-3">Nom</th>
              <th className="text-left px-4 py-3">Catégorie</th>
              <th className="text-right px-4 py-3">Prix</th>
              <th className="text-center px-4 py-3">Dispo</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-mosaique-creme">
            {plats.map((plat) => (
              <tr key={plat.id} className="hover:bg-mosaique-ivoire/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-mosaique-creme">
                    <Image
                      src={plat.image_url || imagePlaceholder(plat.nom)}
                      alt={plat.nom}
                      fill className="object-cover" sizes="48px"
                    />
                  </div>
                </td>
                <td className="px-4 py-3 font-medium text-mosaique-nuit">{plat.nom}</td>
                <td className="px-4 py-3 text-mosaique-gris">{plat.categorie?.nom ?? '-'}</td>
                <td className="px-4 py-3 text-right prix text-sm tabular-nums">{formatPrix(plat.prix)}</td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => toggleDisponible(plat)}
                    aria-label={plat.disponible ? 'Désactiver' : 'Activer'}
                    className={plat.disponible ? 'text-mosaique-vert' : 'text-mosaique-gris'}
                  >
                    {plat.disponible ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => ouvrirEdition(plat)}
                      className="p-1.5 text-mosaique-gris hover:text-mosaique-ocre transition-colors"
                      aria-label={`Modifier ${plat.nom}`}
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => supprimerPlat(plat)}
                      className="p-1.5 text-mosaique-gris hover:text-mosaique-epice transition-colors"
                      aria-label={`Supprimer ${plat.nom}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal création/édition */}
      {modalOuverte && (
        <>
          <div
            className="fixed inset-0 bg-mosaique-nuit/50 z-50"
            onClick={() => setModalOuverte(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={platEnEdition ? 'Modifier le plat' : 'Ajouter un plat'}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-card shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
              <h2 className="font-display text-xl font-bold text-mosaique-terre mb-5">
                {platEnEdition ? 'Modifier le plat' : 'Ajouter un plat'}
              </h2>

              <div className="space-y-4">
                {/* Nom */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label-field">Nom *</label>
                    <input type="text" value={form.nom}
                      onChange={(e) => setForm((f) => ({ ...f, nom: e.target.value }))}
                      className="input-field" />
                  </div>
                  <div>
                    <label className="label-field">Catégorie *</label>
                    <select value={form.categorie_id}
                      onChange={(e) => setForm((f) => ({ ...f, categorie_id: e.target.value }))}
                      className="input-field">
                      <option value="">Choisir…</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.nom}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Prix */}
                <div>
                  <label className="label-field">Prix (FCFA) *</label>
                  <input type="number" inputMode="numeric" value={form.prix}
                    onChange={(e) => setForm((f) => ({ ...f, prix: e.target.value ? Number(e.target.value) : '' }))}
                    className="input-field" />
                </div>

                {/* Description */}
                <div>
                  <label className="label-field">Description *</label>
                  <textarea rows={3} value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    className="input-field resize-none" />
                </div>

                {/* Ingrédients */}
                <div>
                  <label className="label-field">Ingrédients</label>
                  <input type="text" value={form.ingredients}
                    onChange={(e) => setForm((f) => ({ ...f, ingredients: e.target.value }))}
                    className="input-field" placeholder="Séparés par des virgules" />
                </div>

                {/* Photo */}
                <div>
                  <label className="label-field">Photo</label>
                  {form.image_url && (
                    <div className="relative w-32 h-24 rounded-lg overflow-hidden mb-2">
                      <Image src={form.image_url} alt="Aperçu" fill className="object-cover" sizes="128px" />
                    </div>
                  )}
                  <input
                    type="file" accept="image/*"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadPhoto(f); }}
                    className="input-field py-2 cursor-pointer"
                  />
                  {uploading && <p className="text-xs text-mosaique-gris mt-1">Upload en cours…</p>}
                  <div className="mt-2">
                    <label className="label-field">Ou URL directe</label>
                    <input type="url" value={form.image_url}
                      onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
                      className="input-field" placeholder="https://…" />
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="flex flex-wrap gap-4">
                  {([
                    { key: 'est_vegetarien', label: '🌿 Végétarien' },
                    { key: 'est_epice',      label: '🌶 Épicé' },
                    { key: 'est_vedette',    label: '⭐ Vedette (accueil)' },
                    { key: 'disponible',     label: '✅ Disponible' },
                  ] as { key: keyof FormPlat; label: string }[]).map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-2 text-sm cursor-pointer select-none">
                      <input type="checkbox"
                        checked={Boolean(form[key])}
                        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.checked }))}
                        className="w-4 h-4 rounded accent-mosaique-ocre"
                      />
                      {label}
                    </label>
                  ))}
                </div>

                {/* Boutons */}
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setModalOuverte(false)} className="btn-secondary flex-1">
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={sauvegarder}
                    disabled={sauvegarde || uploading}
                    className="btn-primary flex-1"
                  >
                    {sauvegarde ? 'Sauvegarde…' : platEnEdition ? 'Enregistrer' : 'Créer le plat'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
