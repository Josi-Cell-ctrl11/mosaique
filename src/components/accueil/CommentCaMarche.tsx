const ETAPES = [
  ['Choisissez vos plats', 'Garniture, quantité, note pour la cuisine.'],
  ['Payez par Mobile Money', 'MTN MoMo, Moov Money ou carte, sécurisé par FedaPay.'],
  ['Suivez votre commande', 'De la cuisine jusqu’à votre porte.'],
];

export function CommentCaMarche() {
  return (
    <section className="container-site py-10 lg:py-20" aria-labelledby="titre-etapes">
      <h2 id="titre-etapes" className="font-display text-2xl lg:text-4xl font-semibold mb-5 lg:mb-8">Comment ça marche</h2>
      <ol className="grid gap-3 lg:grid-cols-3 lg:gap-6">
        {ETAPES.map(([titre, texte], i) => (
          <li key={titre} className="flex lg:flex-col gap-3.5 lg:gap-2 lg:border-t-2 lg:border-mosaique-terre lg:pt-5">
            <span className="shrink-0 w-8 h-8 lg:w-auto lg:h-auto rounded-[10px] lg:rounded-none bg-mosaique-dore lg:bg-transparent text-mosaique-ocre-fonce lg:text-mosaique-ocre font-extrabold lg:font-display lg:text-3xl flex items-center justify-center lg:justify-start">
              <span className="lg:hidden">{i + 1}</span>
              <span className="hidden lg:inline">0{i + 1}</span>
            </span>
            <div>
              <h3 className="font-body font-extrabold text-[15px] lg:text-lg">{titre}</h3>
              <p className="text-sm lg:text-[15px] text-mosaique-gris mt-0.5 leading-relaxed">{texte}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
