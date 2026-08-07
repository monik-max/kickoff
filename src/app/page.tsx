import Link from "next/link";
import { ArrowRight, ListTree, Sparkles, TrendingUp, ShieldCheck, Flag } from "lucide-react";

import { GuidedForm } from "@/components/guided-form";
import { Card, EmptyState, SectionTitle } from "@/components/ui";
import { listProjects } from "@/db/queries";

export const dynamic = "force-dynamic";

const highlights = [
  { icon: Sparkles, label: "Plano de execução completo", tone: "text-violet-600 bg-violet-100" },
  { icon: TrendingUp, label: "Estimativas realistas", tone: "text-blue-600 bg-blue-100" },
  { icon: ShieldCheck, label: "Riscos e mitigações", tone: "text-green-600 bg-green-100" },
  { icon: Flag, label: "Marcos e prazos", tone: "text-indigo-600 bg-indigo-100" },
];

export default async function Home() {
  const projects = await listProjects();

  return (
    <div className="flex flex-col gap-5">
      {/* Hero à esquerda, faixa de destaques à direita. A faixa é mantida
          estreita (rótulos quebram em duas linhas) para sobrar largura ao h1,
          que assim cabe em uma linha só. */}
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        <section>
          <h1 className="text-2xl font-semibold tracking-tight text-ink-100 sm:text-[1.7rem]">
            Descreva o projeto. Receba o plano de execução.
          </h1>
          <p className="mt-2.5 text-justify text-[13.5px] leading-relaxed text-ink-500 hyphens-auto">
            O Kickoff transforma a descrição de um projeto de software em épicos, tarefas estimadas
            em três pontos, riscos com mitigação, marcos e uma faixa de prazo baseada na capacidade
            real do time. Depois é tudo editável — o plano é o começo da conversa, não o fim.
          </p>
        </section>

        <div className="rounded-xl border border-ink-800 bg-white px-4 py-3.5">
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 xl:grid-cols-4">
            {highlights.map(({ icon: Icon, label, tone }) => (
              <div key={label} className="flex items-center gap-2.5">
                <span className={`grid size-9 shrink-0 place-items-center rounded-full ${tone}`}>
                  <Icon className="size-4" aria-hidden />
                </span>
                <span className="text-[12.5px] font-medium leading-snug text-ink-200">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <GuidedForm />

      <section className="mt-4">
        <SectionTitle hint={`${projects.length} no histórico`}>Projetos</SectionTitle>

        {projects.length === 0 ? (
          <EmptyState title="Nenhum projeto ainda">
            O primeiro plano que você gerar aparece aqui.
          </EmptyState>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <li key={project.id}>
                <Link href={`/projetos/${project.id}`} className="block">
                  <Card className="group h-full p-5 transition-colors hover:border-ink-600">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-medium tracking-tight text-ink-100">{project.name}</h3>
                      <ArrowRight
                        className="mt-0.5 size-4 shrink-0 text-ink-600 transition-colors group-hover:text-brand-400"
                        aria-hidden
                      />
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-500">
                      {project.summary ?? project.description}
                    </p>
                    <div className="mt-4 flex items-center gap-3 text-xs text-ink-500">
                      <span className="inline-flex items-center gap-1.5">
                        <ListTree className="size-3.5" aria-hidden />
                        <span className="tnum">{project.taskCount}</span> tarefas
                      </span>
                      <span aria-hidden>·</span>
                      <span className="tnum">
                        {project.teamSize} pessoa
                        {project.teamSize > 1 ? "s" : ""}
                      </span>
                      <span aria-hidden>·</span>
                      <span>{project.source === "claude" ? "Claude Opus 5" : "heurístico"}</span>
                    </div>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
