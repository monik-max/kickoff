"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  CATEGORIES,
  PRICING_HINT,
  PRICING_LABEL,
  type Pricing,
  type Tool,
} from "@/lib/glossary";

const PRICING_TONE: Record<Pricing, string> = {
  gratis: "border-green-200 bg-green-50 text-green-700",
  freemium: "border-blue-200 bg-blue-50 text-blue-700",
  pago: "border-amber-200 bg-amber-50 text-amber-700",
};

const PRICINGS: Pricing[] = ["gratis", "freemium", "pago"];

function normalize(text: string) {
  // Sem acento e em minúscula: buscar "integracao" acha "integração".
  // NFD separa a letra do acento; o range ̀-ͯ é o bloco de sinais
  // diacríticos combinantes, então remove só o acento e preserva a letra.
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function ToolCard({ tool }: { tool: Tool }) {
  return (
    <div className="rounded-lg border border-ink-800 bg-white p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-sm font-semibold text-ink-100">{tool.name}</h3>
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

      <p className="mt-1.5 text-[13px] leading-relaxed text-ink-400">{tool.what}</p>

      <p className="mt-2 border-l-2 border-brand-500/30 pl-3 text-[13px] leading-relaxed text-ink-500">
        <span className="font-medium text-ink-300">Diferencial: </span>
        {tool.edge}
      </p>
    </div>
  );
}

export function GlossaryBrowser({ total }: { total: number }) {
  const [query, setQuery] = useState("");
  const [pricing, setPricing] = useState<Pricing | null>(null);

  const filtered = useMemo(() => {
    const q = normalize(query.trim());

    return CATEGORIES.map((category) => ({
      ...category,
      tools: category.tools.filter((tool) => {
        if (pricing && tool.pricing !== pricing) return false;
        if (!q) return true;
        // Busca também no nome da categoria: "banco" acha PostgreSQL.
        const haystack = normalize(
          `${tool.name} ${tool.what} ${tool.edge} ${category.name} ${category.when}`,
        );
        return haystack.includes(q);
      }),
    })).filter((category) => category.tools.length > 0);
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
                <span className="tnum">{shown}</span> de{" "}
                <span className="tnum">{total}</span>
              </>
            ) : (
              <>
                <span className="tnum">{total}</span> ferramentas
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
        filtered.map((category) => (
          <section key={category.slug}>
            <div className="mb-3">
              <h2 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-ink-300">
                {category.name}
              </h2>
              <p className="mt-1 text-[13px] leading-relaxed text-ink-500">{category.when}</p>
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {category.tools.map((tool) => (
                <ToolCard key={tool.name} tool={tool} />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
