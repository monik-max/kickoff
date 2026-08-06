/**
 * Cria um snapshot completo do projeto pra arquivo histórico
 */
export function createProjectSnapshot(detail: any) {
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
    epics: detail.epics.map((epic: any) => ({
      id: epic.id,
      title: epic.title,
      summary: epic.summary,
      orderIndex: epic.orderIndex,
      tasks: epic.tasks.map((task: any) => ({
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
    risks: detail.risks.map((risk: any) => ({
      id: risk.id,
      title: risk.title,
      impact: risk.impact,
      probability: risk.probability,
      mitigation: risk.mitigation,
    })),
    milestones: detail.milestones.map((milestone: any) => ({
      id: milestone.id,
      title: milestone.title,
      description: milestone.description,
      week: milestone.week,
    })),
    questions: detail.questions.map((q: any) => ({
      id: q.id,
      text: q.text,
      kind: q.kind,
    })),
  };
}

/**
 * Detecta mudanças entre dois snapshots
 */
export function detectChanges(oldSnapshot: any, newSnapshot: any) {
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
  const oldTaskIds = new Set(oldSnapshot.epics.flatMap((e: any) => e.tasks.map((t: any) => t.id)));
  const newTasks = newSnapshot.epics.flatMap((e: any) => e.tasks);

  newTasks.forEach((task: any) => {
    if (!oldTaskIds.has(task.id)) {
      changes.push(`✓ Tarefa adicionada: "${task.title}"`);
    } else {
      const oldTask = oldSnapshot.epics
        .flatMap((e: any) => e.tasks)
        .find((t: any) => t.id === task.id);
      if (oldTask && oldTask.status !== task.status) {
        changes.push(`Status de "${task.title}": ${oldTask.status} → ${task.status}`);
      }
    }
  });

  return changes;
}
