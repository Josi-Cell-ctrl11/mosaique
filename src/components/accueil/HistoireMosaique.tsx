export function HistoireMosaique() {
  return (
    <section
      id="histoire"
      className="py-20 lg:py-28 bg-mosaique-creme"
      aria-labelledby="titre-histoire"
    >
      <div className="container-site">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-xs font-semibold tracking-widest uppercase text-mosaique-ocre">
            Qui nous sommes
          </span>

          <h2
            id="titre-histoire"
            className="font-display text-3xl lg:text-4xl font-bold text-mosaique-terre mt-4 mb-8"
          >
            Mosaïque, une carte qui rassemble
            <br className="hidden lg:block" />
            <em className="not-italic">les envies et les saveurs.</em>
          </h2>

          <div className="space-y-5 text-mosaique-nuit/80 text-lg leading-relaxed text-left">
            <p>
              Mosaïque met en avant une carte généreuse et variée : pâtes, poulets,
              brochettes, poissons braisés, chawarmas, kébabs, sauces, crêpes et
              gaufres. Chaque famille possède ses propres variétés afin de rendre le
              choix plus simple et de laisser chaque recette trouver sa place.
            </p>
            <p>
              Cette page sera complétée avec la véritable histoire de Mosaïque,
              racontée avec les mots de son fondateur. Nous préférons présenter une
              histoire authentique plutôt que d’inventer une origine ou un récit qui
              ne correspond pas à la réalité de la maison.
            </p>
          </div>

          <div className="mt-12 grid sm:grid-cols-3 gap-6 text-left">
            {[
              { chiffre: '9', detail: 'Familles de recettes actuellement présentes dans la carte.' },
              { chiffre: '69', detail: 'Variétés disponibles dans le catalogue connecté.' },
              { chiffre: '45 min', detail: 'Délai de livraison configuré actuellement dans Supabase.' },
            ].map((item) => (
              <div key={item.chiffre} className="bg-white rounded-card px-6 py-5 shadow-card">
                <p className="font-display text-2xl font-bold text-mosaique-ocre mb-1">{item.chiffre}</p>
                <p className="text-sm text-mosaique-gris leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
