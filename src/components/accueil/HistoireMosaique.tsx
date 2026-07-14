export function HistoireMosaique() {
  return (
    <section
      id="histoire"
      className="py-20 lg:py-28 bg-mosaique-creme"
      aria-labelledby="titre-histoire"
    >
      <div className="container-site">
        <div className="max-w-3xl mx-auto text-center">
          {/* Chapeau */}
          <span className="text-xs font-semibold tracking-widest uppercase text-mosaique-ocre">
            Qui nous sommes
          </span>

          <h2
            id="titre-histoire"
            className="font-display text-3xl lg:text-4xl font-bold text-mosaique-terre mt-4 mb-8"
          >
            Mosaïque, c&apos;est l&apos;idée que la meilleure table,
            <br className="hidden lg:block" />
            <em className="not-italic"> c&apos;est la vôtre.</em>
          </h2>

          <div className="space-y-5 text-mosaique-nuit/80 text-lg leading-relaxed text-left">
            <p>
              Tout a commencé dans une cuisine trop petite, avec une poêle en fonte
              et des épices rapportées du marché central. L&apos;idée était simple :
              cuisiner chaque jour comme si les gens qu&apos;on allait nourrir étaient de
              la famille.
            </p>
            <p>
              Le nom <strong className="text-mosaique-terre font-semibold">Mosaïque</strong> vient de là —
              de cette envie de rassembler des saveurs qu&apos;on n&apos;aurait pas forcément
              associées, des recettes héritées et des idées du moment, un plat
              sénégalais à côté d&apos;un dessert ivoirien, une grillade au charbon
              servie avec une sauce que personne d&apos;autre ne fait comme ça.
            </p>
            <p>
              On cuisine encore à la main, en petites quantités, avec les produits du
              marché du matin. Les quantités sont limitées parce que c&apos;est fait
              sérieusement — pas parce qu&apos;on a inventé une rareté.
            </p>
          </div>

          {/* Fait concret — pas d'icônes décoratives */}
          <div className="mt-12 grid sm:grid-cols-3 gap-6 text-left">
            {[
              {
                chiffre: '100 %',
                detail: 'Fait maison chaque jour, jamais réchauffé.',
              },
              {
                chiffre: '45 min',
                detail: 'Délai moyen de livraison depuis notre cuisine.',
              },
              {
                chiffre: 'Zéro surprise',
                detail:
                  'Le prix que vous voyez sur la fiche est le prix que vous payez.',
              },
            ].map((item) => (
              <div
                key={item.chiffre}
                className="bg-white rounded-card px-6 py-5 shadow-card"
              >
                <p className="font-display text-2xl font-bold text-mosaique-ocre mb-1">
                  {item.chiffre}
                </p>
                <p className="text-sm text-mosaique-gris leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
