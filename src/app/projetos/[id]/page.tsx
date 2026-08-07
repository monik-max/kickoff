import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, ArrowLeft, Flag, HelpCircle } from "lucide-react";

import { TaskBoard } from "@/components/task-board";
import {
  CapacityControls,
  DeleteProjectButton,
  ExportButton,
  ExportPDFButton,
} from "@/components/project-tools";
import { SaveButton } from "@/components/save-button";
import { NewProjectButton } from "@/components/new-project-button";
import { Card, EmptyState, SectionTitle, Stat } from "@/components/ui";
import { getProject } from "@/db/queries";
import { addWeeks, estimate, formatHours } from "@/lib/estimate";
import { planToMarkdown } from "@/lib/export-markdown";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const dateFormat = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

function severityTone(score: number) {
  if (score >= 15) return "border-stop-400/40 bg-stop-400/10 text-stop-400";
  if (score >= 8) return "border-warn-400/40 bg-warn-400/10 text-warn-400";
  return "border-ink-700 bg-ink-800 text-ink-300";
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const detail = await getProject(id);
  if (!detail) notFound();

  const { project, epics, risks, milestones, questions } = detail;
  const allTasks = epics.flatMap((epic) => epic.tasks);
  const totals = estimate(allTasks, project.teamSize, project.weeklyHours);
  const doneCount = allTasks.filter((task) => task.status === "feito").length;

  const sortedRisks = [...risks].sort(
    (a, b) => b.impact * b.probability - a.impact * a.probability,
  );
  const premissas = questions.filter((q) => q.kind === "premissa");
  const perguntas = questions.filter((q) => q.kind === "pergunta");

  const today = new Date();
  const slug =
    project.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "plano";

  return (
    <div className="flex flex-col gap-10">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-ink-400 transition-colors hover:text-ink-100"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Todos os projetos
        </Link>

        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {project.name}
            </h1>
            <p className="mt-1 text-xs text-ink-400">
              {project.source === "claude"
                ? "Plano gerado por Claude Opus 5"
                : "Plano gerado pelo motor heurístico local"}
              {project.projectManager ? ` · gerente: ${project.projectManager}` : ""}
              {project.stack ? ` · ${project.stack}` : ""}
              {project.targetDate ? ` · prazo desejado ${project.targetDate}` : ""}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <SaveButton />
            <ExportButton
              markdown={planToMarkdown(detail)}
              filename={`plano-${slug}.md`}
            />
            <ExportPDFButton detail={detail} />
            <NewProjectButton />
            <DeleteProjectButton projectId={project.id} />
          </div>
        </div>


        {project.summary ? (
          <p className="mt-5 leading-relaxed text-ink-300 text-justify">
            {project.summary}
          </p>
        ) : null}
      </div>

      <section>
        <SectionTitle hint={<CapacityControls
          projectId={project.id}
          teamSize={project.teamSize}
          weeklyHours={project.weeklyHours}
        />}>
          Prazo e esforço
        </SectionTitle>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat
            label="Esforço restante"
            value={formatHours(totals.expectedHours)}
            sub={`± ${formatHours(totals.stdDevHours)} de desvio-padrão`}
          />
          <Stat
            label="Duração esperada"
            value={`${totals.expectedWeeks.toFixed(1)} sem`}
            sub={`termina ~${dateFormat.format(addWeeks(today, totals.expectedWeeks))}`}
          />
          <Stat
            label="Prazo com 85% de confiança"
            value={`${totals.confidentWeeks.toFixed(1)} sem`}
            sub={`termina ~${dateFormat.format(addWeeks(today, totals.confidentWeeks))}`}
            tone="brand"
          />
          <Stat
            label="Progresso"
            value={`${doneCount}/${allTasks.length}`}
            sub={`${allTasks.length > 0 ? Math.round((doneCount / allTasks.length) * 100) : 0}% das tarefas concluídas`}
          />
        </div>

        <p className="mt-3 text-xs leading-relaxed text-ink-400 text-justify">
          O esforço soma a estimativa PERT de cada tarefa ainda não concluída. A faixa de 85% adiciona 1,04 desvio-padrão — é o número que você leva para a reunião, não o esperado.
        </p>
      </section>

      <section>
        <SectionTitle hint={`${epics.length} épicos · ${allTasks.length} tarefas`}>
          Plano de execução
        </SectionTitle>
        {epics.length === 0 ? (
          <EmptyState title="Sem tarefas neste plano" />
        ) : (
          <TaskBoard epics={epics} projectId={project.id} />
        )}
      </section>

      {milestones.length > 0 ? (
        <section>
          <SectionTitle>Marcos</SectionTitle>
          <ol className="relative flex flex-col gap-4 border-l border-ink-800 pl-6">
            {milestones.map((milestone) => (
              <li key={milestone.id} className="relative">
                <span
                  aria-hidden
                  className="absolute -left-[1.9rem] top-1.5 grid size-4 place-items-center rounded-full border border-brand-500 bg-ink-950"
                >
                  <Flag className="size-2 text-brand-400" />
                </span>
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="tnum rounded-md border border-ink-700 bg-ink-850 px-1.5 py-0.5 text-[11px] text-ink-300">
                    semana {milestone.week}
                  </span>
                  <h3 className="font-medium tracking-tight">
                    {milestone.title}
                  </h3>
                  <span className="text-xs text-ink-400">
                    ~{dateFormat.format(addWeeks(today, milestone.week))}
                  </span>
                </div>
                <p className="mt-1 max-w-3xl text-sm leading-relaxed text-ink-400">
                  {milestone.description}
                </p>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {sortedRisks.length > 0 ? (
        <section>
          <SectionTitle hint="ordenados por impacto × probabilidade">
            Riscos
          </SectionTitle>
          <div className="flex flex-col gap-3">
            {sortedRisks.map((risk) => {
              const score = risk.impact * risk.probability;
              return (
                <Card key={risk.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle
                      className="mt-0.5 size-4 shrink-0 text-warn-400"
                      aria-hidden
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-medium">{risk.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink-400">
                        <span className="text-ink-300">Mitigação:</span>{" "}
                        {risk.mitigation}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "tnum shrink-0 rounded-md border px-2 py-0.5 text-xs font-medium",
                        severityTone(score),
                      )}
                      title={`Impacto ${risk.impact} × probabilidade ${risk.probability}`}
                    >
                      {score}
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>
      ) : null}

      {questions.length > 0 ? (
        <section className="grid gap-6 lg:grid-cols-2">
          {premissas.length > 0 ? (
            <div>
              <SectionTitle>Premissas assumidas</SectionTitle>
              <Card className="divide-y divide-ink-800">
                {premissas.map((item) => (
                  <p
                    key={item.id}
                    className="px-4 py-3 text-sm leading-relaxed text-ink-300"
                  >
                    {item.text}
                  </p>
                ))}
              </Card>
            </div>
          ) : null}

          {perguntas.length > 0 ? (
            <div>
              <SectionTitle>Perguntas em aberto</SectionTitle>
              <Card className="divide-y divide-ink-800">
                {perguntas.map((item) => (
                  <p
                    key={item.id}
                    className="flex items-start gap-2 px-4 py-3 text-sm leading-relaxed text-ink-300"
                  >
                    <HelpCircle
                      className="mt-0.5 size-4 shrink-0 text-brand-400"
                      aria-hidden
                    />
                    {item.text}
                  </p>
                ))}
              </Card>
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
