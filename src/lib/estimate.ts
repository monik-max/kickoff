import type { Task } from "@/db/schema";

export type Estimate = {
  /** Soma das estimativas PERT esperadas, em horas */
  expectedHours: number;
  /** Desvio-padrão agregado, em horas */
  stdDevHours: number;
  /** Horas com 85% de confiança (esperado + 1,04σ) */
  confidentHours: number;
  /** Duração em semanas corridas, dado o time e a carga semanal */
  expectedWeeks: number;
  confidentWeeks: number;
};

/** PERT: valor esperado de uma tarefa. */
export function pertExpected(task: {
  optimisticHours: number;
  likelyHours: number;
  pessimisticHours: number;
}): number {
  return (
    (task.optimisticHours + 4 * task.likelyHours + task.pessimisticHours) / 6
  );
}

/** PERT: desvio-padrão de uma tarefa. */
export function pertStdDev(task: {
  optimisticHours: number;
  pessimisticHours: number;
}): number {
  return (task.pessimisticHours - task.optimisticHours) / 6;
}

export function estimate(
  tasks: Pick<
    Task,
    "optimisticHours" | "likelyHours" | "pessimisticHours" | "status"
  >[],
  teamSize: number,
  weeklyHours: number,
): Estimate {
  const pending = tasks.filter((t) => t.status !== "feito");

  const expectedHours = pending.reduce((sum, t) => sum + pertExpected(t), 0);
  // Variâncias somam; desvios-padrão não. Daí a raiz da soma dos quadrados.
  const variance = pending.reduce((sum, t) => sum + pertStdDev(t) ** 2, 0);
  const stdDevHours = Math.sqrt(variance);
  const confidentHours = expectedHours + 1.04 * stdDevHours;

  const capacity = Math.max(1, teamSize * weeklyHours);

  return {
    expectedHours,
    stdDevHours,
    confidentHours,
    expectedWeeks: expectedHours / capacity,
    confidentWeeks: confidentHours / capacity,
  };
}

export function formatHours(hours: number): string {
  if (hours < 10) return `${hours.toFixed(1)}h`;
  return `${Math.round(hours)}h`;
}

export function formatWeeks(weeks: number): string {
  if (weeks < 1) return `${Math.max(1, Math.round(weeks * 5))} dias`;
  return `${weeks.toFixed(1)} sem`;
}

export function addWeeks(from: Date, weeks: number): Date {
  const result = new Date(from);
  result.setDate(result.getDate() + Math.round(weeks * 7));
  return result;
}
