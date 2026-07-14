import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { type ArticlePanier } from '@/types';
import { calculerTotalPanier } from '@/lib/utils';

interface EtatPanier {
  articles: ArticlePanier[];
  ouvert: boolean;

  // Actions
  ajouterArticle: (article: ArticlePanier) => void;
  retirerArticle: (platId: string, options?: Record<string, string>) => void;
  modifierQuantite: (platId: string, quantite: number, options?: Record<string, string>) => void;
  viderPanier: () => void;
  ouvrirPanier: () => void;
  fermerPanier: () => void;

  // Computed
  totalArticles: () => number;
  sousTotal: () => number;
}

function memeOptions(a?: Record<string, string>, b?: Record<string, string>): boolean {
  if (!a && !b) return true;
  if (!a || !b) return false;
  return JSON.stringify(a) === JSON.stringify(b);
}

export const usePanier = create<EtatPanier>()(
  persist(
    (set, get) => ({
      articles: [],
      ouvert: false,

      ajouterArticle: (nouvelArticle) => {
        set((state) => {
          const existant = state.articles.findIndex(
            (a) =>
              a.platId === nouvelArticle.platId &&
              memeOptions(a.options, nouvelArticle.options)
          );

          if (existant !== -1) {
            const articles = [...state.articles];
            articles[existant] = {
              ...articles[existant],
              quantite: articles[existant].quantite + nouvelArticle.quantite,
            };
            return { articles, ouvert: true };
          }

          return { articles: [...state.articles, nouvelArticle], ouvert: true };
        });
      },

      retirerArticle: (platId, options) => {
        set((state) => ({
          articles: state.articles.filter(
            (a) => !(a.platId === platId && memeOptions(a.options, options))
          ),
        }));
      },

      modifierQuantite: (platId, quantite, options) => {
        if (quantite <= 0) {
          get().retirerArticle(platId, options);
          return;
        }
        set((state) => ({
          articles: state.articles.map((a) =>
            a.platId === platId && memeOptions(a.options, options)
              ? { ...a, quantite }
              : a
          ),
        }));
      },

      viderPanier: () => set({ articles: [] }),
      ouvrirPanier: () => set({ ouvert: true }),
      fermerPanier: () => set({ ouvert: false }),

      totalArticles: () => get().articles.reduce((n, a) => n + a.quantite, 0),

      sousTotal: () => calculerTotalPanier(get().articles),
    }),
    {
      name: 'mosaique-panier',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
