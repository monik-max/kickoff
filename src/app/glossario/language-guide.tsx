import { LANGUAGE_PICKS } from "@/lib/glossary";

/* Guia de linguagem por objetivo. Fica acima do catálogo de ferramentas porque
   é a decisão que vem primeiro — e é a que mais trava quem está começando. */
export function LanguageGuide() {
  return (
    <section>
      <div className="mb-4">
        <h2 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-ink-300">
          Qual linguagem, para qual objetivo
        </h2>
        <p className="mt-1 max-w-[70ch] text-[13px] leading-relaxed text-ink-500">
          A linguagem importa menos do que parece: lógica, banco de dados e saber decompor problema
          são o que transferem entre todas elas. A segunda linguagem se aprende em semanas. Escolha
          uma que caiba no seu objetivo e comece.
        </p>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {LANGUAGE_PICKS.map((pick) => (
          <article key={pick.slug} className="rounded-lg border border-ink-800 bg-white p-4">
            <h3 className="text-sm font-semibold text-ink-100">{pick.goal}</h3>

            <div className="mt-2.5 flex flex-wrap items-baseline gap-x-2">
              <span className="rounded-md border border-brand-500/40 bg-brand-500/10 px-2 py-0.5 text-xs font-semibold text-brand-400">
                {pick.main}
              </span>
              <span className="text-[11px] uppercase tracking-wide text-ink-500">
                aposta mais segura
              </span>
            </div>
            <p className="mt-1.5 text-[13px] leading-relaxed text-ink-400">{pick.mainWhy}</p>

            {pick.others.length > 0 ? (
              <dl className="mt-3 space-y-1.5 border-t border-ink-800 pt-3">
                {pick.others.map((alt) => (
                  <div key={alt.lang} className="text-[13px] leading-relaxed">
                    <dt className="inline font-medium text-ink-200">{alt.lang} — </dt>
                    <dd className="inline text-ink-500">{alt.why}</dd>
                  </div>
                ))}
              </dl>
            ) : null}

            <p className="mt-3 border-l-2 border-amber-300 pl-3 text-[13px] leading-relaxed text-ink-500">
              <span className="font-medium text-ink-300">Cilada comum: </span>
              {pick.trap}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
