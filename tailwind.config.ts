import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Palette « Noir & Or » — reprise de l'identité Le Mosaïque (affiches noires, lettres dorées)
        mosaique: {
          nuit:    '#14110E', // noir chaud : en-têtes, boutons sombres
          brun:    '#221C16', // surfaces sombres secondaires
          trait:   '#3A3128', // bordures sur fond sombre
          or:      '#D4AF5A', // or : accent sur fond sombre, boutons dorés (texte noir)
          'or-pale': '#F1DFA8',
          ocre:    '#8A6A1F', // or foncé : texte doré lisible sur fond clair (et texte blanc dessus)
          'ocre-fonce': '#5E4712',
          terre:   '#1C1712', // titres sur fond clair
          ivoire:  '#FAF7F1', // fond général
          creme:   '#ECE4D6', // bordures, séparateurs
          sable:   '#F4EEE3', // fonds secondaires
          dore:    '#F1E6CC', // pastilles dorées pâles
          gris:    '#6B6056', // texte secondaire (contraste AA sur ivoire)
          epice:   '#B4441E', // badge épicé / erreurs
          vert:    '#3D6B4A', // badge végétarien / succès
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        prix: ['1.0625rem', { lineHeight: '1', fontWeight: '800' }],
        'prix-lg': ['1.375rem', { lineHeight: '1', fontWeight: '800' }],
      },
      borderRadius: {
        card: '1.125rem',
        btn: '0.875rem',
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(20,17,14,0.05)',
        'card-hover': '0 10px 30px -8px rgba(20,17,14,0.18)',
        flottant: '0 10px 30px rgba(20,17,14,0.28)',
      },
    },
  },
  plugins: [],
};

export default config;
