'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { formatPrix } from '@/lib/utils';
import type { ConfigLivraison, ZoneLivraison } from '@/types';
import { Plus, Trash2 } from 'lucide-react';

interface Props { config: ConfigLivraison }

export function LivraisonAdminClient({ config: initialConfig }: Props) {
  const supabase = createClient();
  const [config, setConfig] = useState(initialConfig);
  const [sauvegarde, setSauvegarde] = useState(false);
  const [nouvelleZone, setNouvelleZone] = useState({ nom: '', frais: '' });

  async function sauvegarderConfig() {
    setSauvegarde(true);
    const { error } = await supabase
      .from('config_livraison')
      .update({
        type:          config.type,
        frais_fixe:    config.frais_fixe,
        delai_minutes: config.delai_minutes,
      })
      .eq('id', config.id);

    if (error) {
      toast.error('Erreur lors de la sauvegarde.');
    } else {
      toast.success('Configuration sauvegardée.');
    }
    setSauvegarde(false);
  }

  async function ajouterZone() {
    if (!nouvelleZone.nom || !nouvelleZone.frais) {
      toast.error('Remplissez le nom et les frais de la zone.');
      return;
    }
    const { data, error } = await supabase
      .from('zones_livraison')
      .insert({ config_id: config.id, nom: nouvelleZone.nom, frais: Number(nouvelleZone.frais) })
      .select()
      .single();

    if (error) { toast.error('Erreur ajout zone.'); return; }
    setConfig((c) => ({ ...c, zones: [...(c.zones ?? []), data as ZoneLivraison] }));
    setNouvelleZone({ nom: '', frais: '' });
    toast.success('Zone ajoutée.');
  }

  async function supprimerZone(id: string) {
    const { error } = await supabase.from('zones_livraison').delete().eq('id', id);
    if (error) { toast.error('Erreur.'); return; }
    setConfig((c) => ({ ...c, zones: c.zones?.filter((z) => z.id !== id) }));
    toast.success('Zone supprimée.');
  }

  if (!config) return <p className="text-mosaique-gris">Aucune configuration trouvée.</p>;

  return (
    <div className="max-w-2xl space-y-8">
      {/* Config principale */}
      <div className="bg-white rounded-card shadow-card p-6 space-y-5">
        <h2 className="font-semibold text-mosaique-nuit">Paramètres généraux</h2>

        {/* Type */}
        <div>
          <label className="label-field">Type de tarification</label>
          <div className="flex gap-4">
            {(['fixe', 'par_zone'] as const).map((t) => (
              <label key={t} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio" name="type" value={t}
                  checked={config.type === t}
                  onChange={() => setConfig((c) => ({ ...c, type: t }))}
                  className="accent-mosaique-ocre"
                />
                {t === 'fixe' ? 'Frais fixe' : 'Par zone'}
              </label>
            ))}
          </div>
        </div>

        {/* Frais fixe */}
        <div>
          <label className="label-field" htmlFor="frais_fixe">
            {config.type === 'fixe' ? 'Frais de livraison (FCFA)' : 'Frais par défaut (FCFA)'}
          </label>
          <input
            id="frais_fixe" type="number" inputMode="numeric"
            value={config.frais_fixe}
            onChange={(e) => setConfig((c) => ({ ...c, frais_fixe: Number(e.target.value) }))}
            className="input-field"
          />
        </div>

        {/* Délai */}
        <div>
          <label className="label-field" htmlFor="delai">Délai de livraison estimé (minutes)</label>
          <input
            id="delai" type="number" inputMode="numeric"
            value={config.delai_minutes}
            onChange={(e) => setConfig((c) => ({ ...c, delai_minutes: Number(e.target.value) }))}
            className="input-field"
          />
        </div>

        <button onClick={sauvegarderConfig} disabled={sauvegarde} className="btn-primary">
          {sauvegarde ? 'Sauvegarde…' : 'Enregistrer'}
        </button>
      </div>

      {/* Zones (si par zone) */}
      {config.type === 'par_zone' && (
        <div className="bg-white rounded-card shadow-card p-6 space-y-4">
          <h2 className="font-semibold text-mosaique-nuit">Zones de livraison</h2>

          {/* Zones existantes */}
          {(config.zones ?? []).length === 0 ? (
            <p className="text-sm text-mosaique-gris">Aucune zone définie.</p>
          ) : (
            <ul className="divide-y divide-mosaique-creme">
              {(config.zones ?? []).map((zone) => (
                <li key={zone.id} className="flex items-center justify-between py-3">
                  <span className="text-sm font-medium text-mosaique-nuit">{zone.nom}</span>
                  <div className="flex items-center gap-4">
                    <span className="prix text-sm">{formatPrix(zone.frais)}</span>
                    <button
                      onClick={() => supprimerZone(zone.id)}
                      className="text-mosaique-gris hover:text-mosaique-epice transition-colors"
                      aria-label={`Supprimer la zone ${zone.nom}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Ajouter une zone */}
          <div className="flex gap-3 pt-2">
            <input
              type="text" placeholder="Nom de la zone"
              value={nouvelleZone.nom}
              onChange={(e) => setNouvelleZone((z) => ({ ...z, nom: e.target.value }))}
              className="input-field flex-1"
            />
            <input
              type="number" inputMode="numeric" placeholder="Frais (FCFA)"
              value={nouvelleZone.frais}
              onChange={(e) => setNouvelleZone((z) => ({ ...z, frais: e.target.value }))}
              className="input-field w-36"
            />
            <button onClick={ajouterZone} className="btn-primary px-4">
              <Plus size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
