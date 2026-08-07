import type { ProjectDetail } from "@/db/queries";

/**
 * Cria um snapshot completo do projeto pra arquivo histórico.
 *
 * `import type` é intencional: queries.ts é server-only e a importação de tipo
 * some na compilação, então nada de servidor vaza pro bundle.
 */
export function createProjectSnapshot(detail: ProjectDetail) {
  return {
    project: {
      id: detail.project.id,
      name: detail.project.name,
      description: detail.project.description,
      stack: detail.project.stack,
      teamSize: detail.project.teamSize,
      weeklyHours: detail.project.weeklyHours,
      targetDate: detail.project.targetDate,
      summary: detail.project.summary,
    },
    epics: detail.epics.map((epic) => ({
      id: epic.id,
      title: epic.title,
      summary: epic.summary,
      orderIndex: epic.orderIndex,
      tasks: epic.tasks.map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        role: task.role,
        priority: task.priority,
        status: task.status,
        optimisticHours: task.optimisticHours,
        likelyHours: task.likelyHours,
        pessimisticHours: task.pessimisticHours,
      })),
    })),
    risks: detail.risks.map((risk) => ({
      id: risk.id,
      title: risk.title,
      impact: risk.impact,
      probability: risk.probability,
      mitigation: risk.mitigation,
    })),
    milestones: detail.milestones.map((milestone) => ({
      id: milestone.id,
      title: milestone.title,
      description: milestone.description,
      week: milestone.week,
    })),
    questions: detail.questions.map((q) => ({
      id: q.id,
      text: q.text,
      kind: q.kind,
    })),
  };
}

/** O formato gravado em project_versions.snapshot. */
export type ProjectSnapshot = ReturnType<typeof createProjectSnapshot>;

/**
 * Detecta mudanças entre dois snapshots.
 *
 * NOTA: ainda não é chamada em lugar nenhum — a UI de histórico
 * (components/version-history.tsx) só lista metadados das versões, sem comparar
 * conteúdo.
 */
export function detectChanges(oldSnapshot: ProjectSnapshot, newSnapshot: ProjectSnapshot) {
  const changes: string[] = [];

  // Projeto
  if (oldSnapshot.project.name !== newSnapshot.project.name) {
    changes.push(`Nome: "${oldSnapshot.project.name}" → "${newSnapshot.project.name}"`);
  }
  if (oldSnapshot.project.teamSize !== newSnapshot.project.teamSize) {
    changes.push(`Time: ${oldSnapshot.project.teamSize} → ${newSnapshot.project.teamSize} pessoas`);
  }
  if (oldSnapshot.project.weeklyHours !== newSnapshot.project.weeklyHours) {
    changes.push(`Horas/semana: ${oldSnapshot.project.weeklyHours}h → ${newSnapshot.project.weeklyHours}h`);
  }

  // Tarefas adicionadas/modificadas
  const oldTaskIds = new Set(oldSnapshot.epics.flatMap((e) => e.tasks.map((t) => t.id)));
  const newTasks = newSnapshot.epics.flatMap((e) => e.tasks);

  newTasks.forEach((task) => {
    if (!oldTaskIds.has(task.id)) {
      changes.push(`✓ Tarefa adicionada: "${task.title}"`);
    } else {
      const oldTask = oldSnapshot.epics
        .flatMap((e) => e.tasks)
        .find((t) => t.id === task.id);
      if (oldTask && oldTask.status !== task.status) {
        changes.push(`Status de "${task.title}": ${oldTask.status} → ${task.status}`);
      }
    }
  });

  return changes;
}
