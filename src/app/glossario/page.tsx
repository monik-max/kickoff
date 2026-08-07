import type { Metadata } from "next";

import { ALL_TOOLS_COUNT, CATEGORIES, PRICING_HINT, PRICING_LABEL } from "@/lib/glossary";
import { GlossaryBrowser } from "./glossary-browser";

export const metadata: Metadata = {
  title: "Glossário de ferramentas — Kickoff",
  description:
    "O que cada ferramenta de desenvolvimento e design faz, se é grátis ou paga, e o que a diferencia das outras da mesma categoria.",
};

export default function GlossarioPage() {
  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-ink-100 sm:text-[1.7rem]">
          Glossário de ferramentas
        </h1>
        <p className="mt-2.5 max-w-[70ch] text-[13.5px] leading-relaxed text-ink-500">
          {ALL_TOOLS_COUNT} ferramentas em {CATEGORIES.length} categorias, com o que cada uma faz e
          o que a separa das concorrentes. A ideia não é decorar: é ter onde olhar na hora de
          escolher.
        </p>

        <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-ink-500">
          {(["gratis", "freemium", "pago"] as const).map((p) => (
            <div key={p} className="flex items-baseline gap-1.5">
              <dt className="font-medium text-ink-300">{PRICING_LABEL[p]}:</dt>
              <dd>{PRICING_HINT[p]}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-3 text-xs leading-relaxed text-ink-500">
          Preço muda com o tempo — confirme no site antes de decidir.
        </p>
      </header>

      <GlossaryBrowser total={ALL_TOOLS_COUNT} />
    </div>
  );
}
