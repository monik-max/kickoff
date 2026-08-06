import type { ProjectDetail } from "@/db/queries";
import { estimate, formatHours, pertExpected } from "./estimate";

/** Converte o plano inteiro em Markdown, para colar em wiki, PR ou ticket. */
export function planToMarkdown(detail: ProjectDetail): string {
  const { project, epics, risks, milestones, questions } = detail;
  const allTasks = epics.flatMap((epic) => epic.tasks);
  const totals = estimate(allTasks, project.teamSize, project.weeklyHours);

  const lines: string[] = [
    `# ${project.name}`,
    "",
    project.summary ?? project.description,
    "",
    "## Capacidade e prazo",
    "",
    `- Time: ${project.teamSize} pessoa(s) × ${project.weeklyHours}h/semana`,
    `- Esforço esperado (PERT): ${formatHours(totals.expectedHours)}`,
    `- Esforço com 85% de confiança: ${formatHours(totals.confidentHours)}`,
    `- Duração esperada: ${totals.expectedWeeks.toFixed(1)} semanas`,
    `- Duração com 85% de confiança: ${totals.confidentWeeks.toFixed(1)} semanas`,
    "",
    "## Plano de execução",
    "",
  ];

  for (const epic of epics) {
    lines.push(`### ${epic.title}`, "");
    if (epic.summary) lines.push(`${epic.summary}`, "");
    lines.push("| Tarefa | Papel | Prio | O | M | P | PERT |");
    lines.push("| --- | --- | --- | ---: | ---: | ---: | ---: |");
    for (const task of epic.tasks) {
      lines.push(
        `| ${task.status === "feito" ? "~~" : ""}${task.title}${
          task.status === "feito" ? "~~" : ""
        } | ${task.role} | ${task.priority} | ${task.optimisticHours} | ${
          task.likelyHours
        } | ${task.pessimisticHours} | ${pertExpected(task).toFixed(1)} |`,
      );
    }
    lines.push("");
  }

  if (milestones.length > 0) {
    lines.push("## Marcos", "");
    for (const milestone of milestones) {
      lines.push(
        `- **Semana ${milestone.week} — ${milestone.title}**: ${milestone.description ?? ""}`,
      );
    }
    lines.push("");
  }

  if (risks.length > 0) {
    lines.push("## Riscos", "");
    lines.push("| Risco | Impacto | Probabilidade | Mitigação |");
    lines.push("| --- | ---: | ---: | --- |");
    for (const risk of risks) {
      lines.push(
        `| ${risk.title} | ${risk.impact} | ${risk.probability} | ${risk.mitigation ?? ""} |`,
      );
    }
    lines.push("");
  }

  const premissas = questions.filter((q) => q.kind === "premissa");
  const perguntas = questions.filter((q) => q.kind === "pergunta");

  if (premissas.length > 0) {
    lines.push("## Premissas assumidas", "");
    for (const item of premissas) lines.push(`- ${item.text}`);
    lines.push("");
  }

  if (perguntas.length > 0) {
    lines.push("## Perguntas em aberto", "");
    for (const item of perguntas) lines.push(`- [ ] ${item.text}`);
    lines.push("");
  }

  lines.push(
    "---",
    "",
    `Plano gerado pelo Kickoff (${
      project.source === "claude" ? "Claude Opus 5" : "motor heurístico local"
    }). Estimativas em três pontos, agregadas por PERT.`,
  );

  return lines.join("\n");
}
