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
        // Palette Mosaïque — tirée de la chaleur des plats cuisinés :
        // ocre chaud, terre de Sienne, blanc cassé ivoire, accent épice
        mosaique: {
          ocre:    '#C8792A', // accent principal, prix, CTA
          terre:   '#7A3B1E', // texte foncé, titres
          ivoire:  '#FAF6EF', // fond général
          creme:   '#F0E8D8', // fonds de carte, sections alternées
          epice:   '#E8481C', // badge "épicé", erreurs
          vert:    '#4A7C59', // badge "végétarien"
          gris:    '#9E9084', // texte secondaire, placeholders
          nuit:    '#1C1410', // texte principal sur fond clair
          or:      '#C8A94A', // doré — logo, accents placeholder
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body:    ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'prix':   ['1.25rem', { lineHeight: '1', fontWeight: '700', letterSpacing: '-0.01em' }],
        'prix-lg':['1.5rem',  { lineHeight: '1', fontWeight: '700', letterSpacing: '-0.02em' }],
      },
      borderRadius: {
        'card': '0.75rem',
        'btn':  '0.5rem',
      },
      boxShadow: {
        'card':  '0 2px 12px 0 rgba(28,20,16,0.08)',
        'card-hover': '0 6px 24px 0 rgba(28,20,16,0.14)',
      },
    },
  },
  plugins: [],
};

export default config;
