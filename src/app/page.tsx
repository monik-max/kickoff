import Link from "next/link";
import { ArrowRight, ListTree } from "lucide-react";

import { GuidedForm } from "@/components/guided-form";
import { Card, EmptyState, SectionTitle } from "@/components/ui";
import { listProjects } from "@/db/queries";
import { hasApiKey } from "@/lib/planner";

export const dynamic = "force-dynamic";

export default async function Home() {
  const projects = await listProjects();

  return (
    <div className="flex flex-col gap-12">
      {/* Two-Column Hero + Form Section */}
      <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
        {/* Left: Hero Section */}
        <section className="flex flex-col justify-center">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Descreva o projeto. Receba o plano de execução.
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-300">
            O Kickoff transforma a descrição de um projeto de software em épicos,
            tarefas estimadas em três pontos, riscos com mitigação, marcos e uma
            faixa de prazo baseada na capacidade real do time. Depois é tudo
            editável — o plano é o começo da conversa, não o fim.
          </p>
        </section>

        {/* Right: Form Section */}
        <section>
          <GuidedForm hasKey={hasApiKey()} />
        </section>
      </div>

      {/* Projects Section */}
      <section>
        <SectionTitle hint={`${projects.length} no histórico`}>
          Projetos
        </SectionTitle>

        {projects.length === 0 ? (
          <EmptyState title="Nenhum projeto ainda">
            O primeiro plano que você gerar aparece aqui.
          </EmptyState>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {projects.map((project) => (
              <li key={project.id}>
                <Link href={`/projetos/${project.id}`} className="block">
                  <Card className="group h-full p-5 transition-colors hover:border-ink-600">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-medium tracking-tight">
                        {project.name}
                      </h3>
                      <ArrowRight
                        className="mt-0.5 size-4 shrink-0 text-ink-600 transition-colors group-hover:text-brand-300"
                        aria-hidden
                      />
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-400">
                      {project.summary ?? project.description}
                    </p>
                    <div className="mt-4 flex items-center gap-3 text-xs text-ink-400">
                      <span className="inline-flex items-center gap-1.5">
                        <ListTree className="size-3.5" aria-hidden />
                        <span className="tnum">{project.taskCount}</span>{" "}
                        tarefas
                      </span>
                      <span aria-hidden>·</span>
                      <span className="tnum">
                        {project.teamSize} pessoa
                        {project.teamSize > 1 ? "s" : ""}
                      </span>
                      <span aria-hidden>·</span>
                      <span>
                        {project.source === "claude"
                          ? "Claude Opus 5"
                          : "heurístico"}
                      </span>
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
