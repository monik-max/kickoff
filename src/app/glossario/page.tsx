import type { Metadata } from "next";

import { ALL_TOOLS_COUNT, PRICING_HINT, PRICING_LABEL } from "@/lib/glossary";
import { LIBRARY, LIBRARY_UNIQUE_TOOLS } from "@/lib/tool-library";
import { GlossaryBrowser } from "./glossary-browser";
import { CuratedTools } from "./curated-tools";
import { LanguageGuide } from "./language-guide";

export const metadata: Metadata = {
  title: "Glossário de ferramentas — Kickoff",
  description:
    "O que cada ferramenta de desenvolvimento e design faz, se é grátis ou paga, e o que a diferencia das outras da mesma categoria.",
};

export default function GlossarioPage() {
  return (
    <div className="flex flex-col gap-10">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-ink-100 sm:text-[1.7rem]">
          Glossário de ferramentas
        </h1>
        <p className="mt-2.5 text-justify text-[13.5px] leading-relaxed text-ink-500 hyphens-auto">
          {LIBRARY_UNIQUE_TOOLS.toLocaleString("pt-BR")} ferramentas em {LIBRARY.length} categorias,
          organizadas por necessidade. Cada categoria diz o que resolve e em que situação você
          precisa dela. Destas, {ALL_TOOLS_COUNT} têm verba detalhada mais abaixo, com o que fazem,
          o diferencial e a faixa de preço. A ideia não é decorar: é ter onde olhar na hora de
          escolher.
        </p>

        {/* Legenda numa linha só e centralizada. flex-wrap fica para o mobile,
            onde as três definições não cabem lado a lado de jeito nenhum. */}
        <dl className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-center text-xs text-ink-500">
          {(["gratis", "freemium", "pago"] as const).map((p) => (
            <div key={p} className="flex items-baseline gap-1.5">
              <dt className="font-medium text-ink-300">{PRICING_LABEL[p]}:</dt>
              <dd>{PRICING_HINT[p]}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-2 text-center text-xs leading-relaxed text-ink-500">
          Preço muda com o tempo — confirme no site antes de decidir.
        </p>
      </header>

      <LanguageGuide />

      <section>
        <h2 className="mb-1 text-[13px] font-semibold uppercase tracking-[0.08em] text-ink-300">
          Biblioteca por necessidade
        </h2>
        <p className="mb-4 text-justify text-[13px] leading-relaxed text-ink-500 hyphens-auto">
          As {LIBRARY.length} categorias. Ferramentas coloridas têm verba detalhada — clique para
          ir até ela.
        </p>
        <GlossaryBrowser totalTools={LIBRARY_UNIQUE_TOOLS} />
      </section>

      <section>
        <h2 className="mb-1 text-[13px] font-semibold uppercase tracking-[0.08em] text-ink-300">
          Ferramentas em detalhe
        </h2>
        <p className="mb-4 text-justify text-[13px] leading-relaxed text-ink-500 hyphens-auto">
          As {ALL_TOOLS_COUNT} com descrição, diferencial e preço.
        </p>
        <CuratedTools />
      </section>
    </div>
  );
}
