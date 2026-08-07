import Link from "next/link";
import { Wrench } from "lucide-react";

import { Card } from "@/components/ui";
import { findTool } from "@/lib/glossary";
import { matchLibrary } from "@/lib/tool-library";

/**
 * Ferramentas sugeridas para o projeto, derivadas da descrição salva.
 *
 * Calculado na renderização, no servidor: não guarda nada no banco, então vale
 * também para projetos criados antes desta seção existir, e acompanha
 * automaticamente qualquer melhoria no matcher.
 */
export function ToolRecommendations({ description }: { description: string }) {
  const matches = matchLibrary(description, 8);
  if (matches.length === 0) return null;

  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <Wrench className="size-4 text-brand-400" aria-hidden />
        <h2 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-ink-300">
          Ferramentas para considerar
        </h2>
      </div>

      <p className="mb-4 max-w-[70ch] text-[13px] leading-relaxed text-ink-500">
        Categorias que a descrição deste projeto sugere, com as opções de cada uma. É ponto de
        partida para pesquisar, não recomendação fechada — confira no{" "}
        <Link href="/glossario" className="underline decoration-brand-500/40 underline-offset-2 hover:text-brand-400">
          glossário
        </Link>{" "}
        o que cada ferramenta faz antes de decidir.
      </p>

      <div className="grid gap-3 md:grid-cols-2">
        {matches.map(({ category }) => (
          <Card key={category.n} className="p-4">
            <h3 className="text-sm font-semibold text-ink-100">{category.name}</h3>
            <p className="mt-1 text-[13px] leading-relaxed text-ink-500">{category.does}</p>

            <p className="mt-2.5 text-[13px] leading-relaxed text-ink-400">
              {category.tools.slice(0, 8).map((tool, i) => {
                const found = findTool(tool);
                return (
                  <span key={tool}>
                    {i > 0 ? " · " : ""}
                    {found ? (
                      <Link
                        href={`/glossario#ferramenta-${found.slug}`}
                        title={found.tool.what}
                        className="underline decoration-brand-500/40 underline-offset-2 transition-colors hover:text-brand-400"
                      >
                        {tool}
                      </Link>
                    ) : (
                      tool
                    )}
                  </span>
                );
              })}
              {category.tools.length > 8 ? (
                <span className="text-ink-600"> · +{category.tools.length - 8}</span>
              ) : null}
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
}
