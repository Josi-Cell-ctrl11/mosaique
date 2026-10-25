/**
 * Photos des plats.
 * Les anciennes images étaient des affiches du menu (avec texte et prix).
 * On les remplace par les photos de plats découpées dans ces affiches.
 */
const CORRESPONDANCES: Array<[RegExp, string]> = [
  [/sauce-gombo/i, '/assets/plats/sauce-gombo.jpg'],
  [/sauce-assrokouin/i, '/assets/plats/sauce-assrokouin.jpg'],
  [/sauce-arachide/i, '/assets/plats/sauce-arachide.jpg'],
  [/sauce-crin-crin/i, '/assets/plats/sauce-crin-crin.jpg'],
  [/michoui/i, '/assets/plats/michoui.jpg'],
  [/Brochettes\./i, '/assets/plats/brochettes.jpg'],
  [/Chawarma\./i, '/assets/plats/chawarma.jpg'],
  [/Crepes\./i, '/assets/plats/crepes.jpg'],
  [/Gaufres\./i, '/assets/plats/gaufres.jpg'],
  [/Kebab\./i, '/assets/plats/kebab.jpg'],
  [/Pate\./i, '/assets/plats/pate.jpg'],
  [/Poisson\./i, '/assets/plats/poisson.jpg'],
  [/Poulets\./i, '/assets/plats/poulets.jpg'],
  [/Sandwich\./i, '/assets/plats/sandwich.jpg'],
];

export function imageDuPlat(url?: string | null): string | null {
  if (!url) return null;
  for (const [motif, remplacement] of CORRESPONDANCES) {
    if (motif.test(url) && !url.startsWith('/assets/plats/')) return remplacement;
  }
  return url;
}
