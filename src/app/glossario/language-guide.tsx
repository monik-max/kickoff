import { LANGUAGE_PICKS } from "@/lib/glossary";

/* Guia de linguagem por objetivo. Fica acima do catálogo porque é a decisão que
   vem primeiro — e é a que mais trava quem está começando.

   Layout denso de propósito: são 11 cartões e o conteúdo é de consulta, não de
   leitura corrida. Espaço generoso aqui só empurra o catálogo para longe. */
export function LanguageGuide() {
  return (
    <section>
      <h2 className="mb-1 text-[13px] font-semibold uppercase tracking-[0.08em] text-ink-300">
        Qual linguagem, para qual objetivo
      </h2>
      <p className="mb-4 text-justify text-[13px] leading-relaxed text-ink-500 hyphens-auto">
        A linguagem importa menos do que parece: lógica, banco de dados e saber decompor problema
        são o que transferem entre todas elas. A segunda linguagem se aprende em semanas. Escolha
        uma que caiba no seu objetivo e comece.
      </p>

      <div className="grid gap-2.5 md:grid-cols-2 xl:grid-cols-3">
        {LANGUAGE_PICKS.map((pick) => (
          <article
            key={pick.slug}
            className="flex flex-col rounded-lg border border-ink-800 bg-white p-3.5"
          >
            <h3 className="text-[13px] font-semibold leading-snug text-ink-100">{pick.goal}</h3>

            <p className="mt-2 text-justify text-[12.5px] leading-relaxed text-ink-400 hyphens-auto">
              <span className="mr-1.5 rounded border border-brand-500/40 bg-brand-500/10 px-1.5 py-0.5 text-[11px] font-semibold text-brand-400">
                {pick.main}
              </span>
              {pick.mainWhy}
            </p>

            {/* Cada alternativa em seu próprio parágrafo. Corridas na mesma
                linha, viravam parede de texto: não dava para varrer a lista e
                achar a linguagem que interessa. */}
            {pick.others.length > 0 ? (
              <dl className="mt-2 space-y-1.5 border-t border-ink-800 pt-2 text-[12.5px] leading-relaxed">
                {pick.others.map((alt) => (
                  <div key={alt.lang}>
                    <dt className="inline font-medium text-ink-200">{alt.lang} — </dt>
                    <dd className="inline text-justify text-ink-500 hyphens-auto">{alt.why}</dd>
                  </div>
                ))}
              </dl>
            ) : null}

            <p className="mt-2 border-l-2 border-amber-300 pl-2.5 text-justify text-[12.5px] leading-relaxed text-ink-500 hyphens-auto">
              <span className="font-medium text-ink-300">Cilada: </span>
              {pick.trap}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
