"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { findTool, PRICING_HINT, PRICING_LABEL, toolSlug, type Pricing } from "@/lib/glossary";
import { LIBRARY } from "@/lib/tool-library";

const PRICING_TONE: Record<Pricing, string> = {
  gratis: "border-green-200 bg-green-50 text-green-700",
  freemium: "border-blue-200 bg-blue-50 text-blue-700",
  pago: "border-amber-200 bg-amber-50 text-amber-700",
};

const PRICINGS: Pricing[] = ["gratis", "freemium", "pago"];

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

/* Cada ferramenta da biblioteca é cruzada com o glossário curado: onde existe
   verba, ganha preço e diferencial; onde não existe, aparece só o nome. Assim a
   largura das 400 categorias convive com a profundidade das 101 detalhadas. */
function ToolChip({ name }: { name: string }) {
  const found = findTool(name);

  if (!found) {
    return (
      <span className="rounded-md border border-ink-800 bg-ink-850 px-2 py-0.5 text-[12.5px] text-ink-400">
        {name}
      </span>
    );
  }

  return (
    <a
      href={`#ferramenta-${found.slug}`}
      title={`${found.tool.what} — ${PRICING_LABEL[found.tool.pricing]}`}
      className={cn(
        "rounded-md border px-2 py-0.5 text-[12.5px] font-medium transition-opacity hover:opacity-75",
        PRICING_TONE[found.tool.pricing],
      )}
    >
      {name}
    </a>
  );
}

export function GlossaryBrowser({ totalTools }: { totalTools: number }) {
  const [query, setQuery] = useState("");
  const [pricing, setPricing] = useState<Pricing | null>(null);

  const filtered = useMemo(() => {
    const q = normalize(query.trim());

    return LIBRARY.map((category) => {
      const tools = category.tools.filter((tool) => {
        if (!pricing) return true;
        // Filtro de preço só consegue julgar o que tem verba no glossário.
        const found = findTool(tool);
        return found?.tool.pricing === pricing;
      });

      if (tools.length === 0) return null;
      if (!q) return { ...category, tools };

      const haystack = normalize(
        `${category.name} ${category.does} ${category.when} ${category.tools.join(" ")}`,
      );
      if (!haystack.includes(q)) return null;

      return { ...category, tools };
    }).filter((c): c is NonNullable<typeof c> => c !== null);
  }, [query, pricing]);

  const shown = filtered.reduce((n, c) => n + c.tools.length, 0);
  const filtrando = query.trim() !== "" || pricing !== null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-600"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por ferramenta, necessidade ou categoria — ex.: pagamento, teste, deploy"
            aria-label="Buscar no glossário"
            className="h-11 w-full rounded-lg border border-ink-700 bg-white pl-9 pr-9 text-sm text-ink-100 placeholder:text-ink-600 transition-shadow hover:border-ink-600 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/12"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Limpar busca"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-ink-500 transition-colors hover:text-ink-200"
            >
              <X className="size-4" aria-hidden />
            </button>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setPricing(null)}
            className={cn(
              "rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
              pricing === null
                ? "border-brand-500/40 bg-brand-500/10 text-brand-400"
                : "border-ink-800 bg-white text-ink-500 hover:border-ink-600",
            )}
          >
            Todas
          </button>
          {PRICINGS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPricing(pricing === p ? null : p)}
              title={PRICING_HINT[p]}
              className={cn(
                "rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
                pricing === p
                  ? PRICING_TONE[p]
                  : "border-ink-800 bg-white text-ink-500 hover:border-ink-600",
              )}
            >
              {PRICING_LABEL[p]}
            </button>
          ))}

          <span className="ml-auto text-xs text-ink-500">
            {filtrando ? (
              <>
                <span className="tnum">{shown}</span> de <span className="tnum">{totalTools}</span>
              </>
            ) : (
              <>
                <span className="tnum">{filtered.length}</span> categorias
              </>
            )}
          </span>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-ink-800 bg-white px-6 py-10 text-center">
          <p className="text-sm font-medium text-ink-100">Nada encontrado</p>
          <p className="mx-auto mt-1.5 max-w-md text-sm text-ink-500">
            Tente um termo mais geral, como &quot;banco&quot;, &quot;deploy&quot; ou
            &quot;teste&quot;.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 xl:grid-cols-2">
          {filtered.map((category) => (
            <section
              key={category.n}
              id={`categoria-${toolSlug(category.name)}`}
              className="scroll-mt-24 rounded-xl border border-ink-800 bg-white p-4"
            >
              <h3 className="text-sm font-semibold text-ink-100">
                <span className="tnum mr-1.5 text-ink-600">{category.n}.</span>
                {category.name}
              </h3>

              <p className="mt-1 text-justify text-[13px] leading-relaxed text-ink-400 hyphens-auto">
                {category.does}
              </p>
              <p className="mt-1.5 text-justify text-[13px] leading-relaxed text-ink-500 hyphens-auto">
                <span className="font-medium text-ink-300">Use quando: </span>
                {category.when}
              </p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {category.tools.map((tool) => (
                  <ToolChip key={tool} name={tool} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
