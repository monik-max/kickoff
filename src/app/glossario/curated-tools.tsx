import { cn } from "@/lib/utils";
import { CATEGORIES, PRICING_HINT, PRICING_LABEL, toolSlug, type Pricing } from "@/lib/glossary";

const PRICING_TONE: Record<Pricing, string> = {
  gratis: "border-green-200 bg-green-50 text-green-700",
  freemium: "border-blue-200 bg-blue-50 text-blue-700",
  pago: "border-amber-200 bg-amber-50 text-amber-700",
};

/**
 * Camada de profundidade: as ferramentas com descrição, diferencial e preço.
 *
 * É também onde vivem as âncoras `#ferramenta-<slug>` — os chips da biblioteca,
 * as sugestões do formulário e as recomendações do projeto apontam para cá.
 * Se esta seção sumir, aqueles links deixam de levar a lugar nenhum.
 */
export function CuratedTools() {
  return (
    <div className="flex flex-col gap-6">
      {CATEGORIES.map((category) => (
        <section key={category.slug}>
          <div className="mb-3">
            <h3 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-ink-300">
              {category.name}
            </h3>
            <p className="mt-1 text-justify text-[13px] leading-relaxed text-ink-500 hyphens-auto">
              {category.when}
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {category.tools.map((tool) => (
              <div
                key={tool.name}
                id={`ferramenta-${toolSlug(tool.name)}`}
                className="scroll-mt-24 rounded-lg border border-ink-800 bg-white p-4 target:border-brand-500/50 target:ring-4 target:ring-brand-500/12"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h4 className="text-sm font-semibold text-ink-100">{tool.name}</h4>
                  <span
                    title={PRICING_HINT[tool.pricing]}
                    className={cn(
                      "shrink-0 rounded-md border px-1.5 py-0.5 text-[11px] font-medium",
                      PRICING_TONE[tool.pricing],
                    )}
                  >
                    {PRICING_LABEL[tool.pricing]}
                  </span>
                </div>

                <p className="mt-1.5 text-justify text-[13px] leading-relaxed text-ink-400 hyphens-auto">
                  {tool.what}
                </p>

                <p className="mt-2 border-l-2 border-brand-500/30 pl-3 text-justify text-[13px] leading-relaxed text-ink-500 hyphens-auto">
                  <span className="font-medium text-ink-300">Diferencial: </span>
                  {tool.edge}
                </p>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
