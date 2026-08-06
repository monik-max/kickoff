"use client";

import { useMemo, useOptimistic, useState, useTransition } from "react";
import { Check, ChevronRight, Circle, Edit2, Timer } from "lucide-react";

import { setTaskEstimate, setTaskStatus } from "@/app/actions";
import { TaskEditModal } from "@/components/task-edit-modal";
import { PriorityDot, RoleBadge } from "@/components/ui";
import { formatHours, pertExpected } from "@/lib/estimate";
import type { Epic, Task } from "@/db/schema";
import { cn } from "@/lib/utils";

type EpicWithTasks = Epic & { tasks: Task[] };

const NEXT_STATUS: Record<string, string> = {
  pendente: "fazendo",
  fazendo: "feito",
  feito: "pendente",
};

function StatusButton({
  status,
  onClick,
}: {
  status: string;
  onClick: () => void;
}) {
  const label =
    status === "feito"
      ? "Concluída — clique para voltar a pendente"
      : status === "fazendo"
        ? "Em andamento — clique para concluir"
        : "Pendente — clique para iniciar";

  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={cn(
        "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border transition-colors",
        status === "feito"
          ? "border-go-400 bg-go-400 text-ink-950"
          : status === "fazendo"
            ? "border-brand-500 text-brand-400"
            : "border-ink-600 text-transparent hover:border-ink-400",
      )}
    >
      {status === "feito" ? (
        <Check className="size-3" strokeWidth={3} aria-hidden />
      ) : status === "fazendo" ? (
        <Circle className="size-2 fill-current" aria-hidden />
      ) : (
        <Circle className="size-2" aria-hidden />
      )}
    </button>
  );
}

function EstimateEditor({
  task,
  projectId,
}: {
  task: Task;
  projectId: string;
}) {
  const [values, setValues] = useState({
    optimistic: task.optimisticHours,
    likely: task.likelyHours,
    pessimistic: task.pessimisticHours,
  });
  const [, startTransition] = useTransition();

  function commit(next: typeof values) {
    setValues(next);
    startTransition(() => {
      void setTaskEstimate(task.id, projectId, next);
    });
  }

  const fields = [
    { key: "optimistic" as const, label: "otimista" },
    { key: "likely" as const, label: "provável" },
    { key: "pessimistic" as const, label: "pessimista" },
  ];

  return (
    <div className="mt-3 flex flex-wrap items-end gap-3">
      {fields.map((field) => (
        <label key={field.key} className="flex flex-col gap-1">
          <span className="text-[11px] uppercase tracking-wider text-ink-400">
            {field.label}
          </span>
          <input
            type="number"
            min={0}
            max={400}
            step={0.5}
            value={values[field.key]}
            onChange={(event) =>
              commit({ ...values, [field.key]: Number(event.target.value) })
            }
            className="tnum w-20 rounded-md border border-ink-700 bg-ink-850 px-2 py-1 text-sm"
          />
        </label>
      ))}
      <span className="pb-1.5 text-xs text-ink-400">
        PERT:{" "}
        <span className="tnum text-brand-300">
          {formatHours(
            pertExpected({
              optimisticHours: values.optimistic,
              likelyHours: values.likely,
              pessimisticHours: values.pessimistic,
            }),
          )}
        </span>
      </span>
    </div>
  );
}

function TaskRow({
  task,
  projectId,
  status,
  onToggle,
}: {
  task: Task;
  projectId: string;
  status: string;
  onToggle: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
      <li className="border-t border-ink-800/70 first:border-t-0">
        <div className="flex items-start gap-3 px-4 py-3">
          <StatusButton status={status} onClick={onToggle} />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <PriorityDot priority={task.priority} />
              <button
                type="button"
                onClick={() => setExpanded((value) => !value)}
                className={cn(
                  "text-left text-sm font-medium transition-colors hover:text-brand-300",
                  status === "feito" && "text-ink-400 line-through",
                )}
              >
                {task.title}
              </button>
              <RoleBadge role={task.role} />
            </div>

            {expanded ? (
              <>
                <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-ink-300">
                  {task.description}
                </p>
                <EstimateEditor task={task} projectId={projectId} />
              </>
            ) : null}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setEditOpen(true)}
              className="rounded-md p-1 text-ink-400 transition-colors hover:bg-ink-800 hover:text-brand-300"
              title="Editar tarefa"
              aria-label="Editar tarefa"
            >
              <Edit2 className="size-4" />
            </button>
            <span
              className="tnum text-xs text-ink-400"
              title="Estimativa PERT esperada"
            >
              {formatHours(pertExpected(task))}
            </span>
          </div>
        </div>
      </li>

      {editOpen && (
        <TaskEditModal
          task={task}
          projectId={projectId}
          onClose={() => setEditOpen(false)}
          onSave={() => setExpanded(false)}
        />
      )}
    </>
  );
}

export function TaskBoard({
  epics,
  projectId,
}: {
  epics: EpicWithTasks[];
  projectId: string;
}) {
  const initial = useMemo(
    () =>
      Object.fromEntries(
        epics.flatMap((epic) => epic.tasks.map((t) => [t.id, t.status])),
      ) as Record<string, string>,
    [epics],
  );

  const [statuses, applyStatus] = useOptimistic(
    initial,
    (state, update: { id: string; status: string }) => ({
      ...state,
      [update.id]: update.status,
    }),
  );
  const [, startTransition] = useTransition();

  function toggle(task: Task) {
    const next = NEXT_STATUS[statuses[task.id] ?? task.status] ?? "pendente";
    startTransition(async () => {
      applyStatus({ id: task.id, status: next });
      await setTaskStatus(task.id, projectId, next);
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {epics.map((epic) => {
        const done = epic.tasks.filter(
          (t) => (statuses[t.id] ?? t.status) === "feito",
        ).length;
        const hours = epic.tasks.reduce(
          (sum, task) => sum + pertExpected(task),
          0,
        );

        return (
          <section
            key={epic.id}
            className="overflow-hidden rounded-xl border border-ink-800 bg-ink-900/60"
          >
            <header className="flex flex-wrap items-start justify-between gap-3 border-b border-ink-800 bg-ink-850/60 px-4 py-3">
              <div className="min-w-0">
                <h3 className="flex items-center gap-1.5 font-medium tracking-tight">
                  <ChevronRight
                    className="size-4 text-brand-400"
                    aria-hidden
                  />
                  {epic.title}
                </h3>
                <p className="mt-1 text-sm text-ink-400">{epic.summary}</p>
              </div>
              <div className="flex shrink-0 items-center gap-3 text-xs text-ink-400">
                <span className="tnum">
                  {done}/{epic.tasks.length}
                </span>
                <span className="tnum inline-flex items-center gap-1">
                  <Timer className="size-3.5" aria-hidden />
                  {formatHours(hours)}
                </span>
              </div>
            </header>

            <ul>
              {epic.tasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  projectId={projectId}
                  status={statuses[task.id] ?? task.status}
                  onToggle={() => toggle(task)}
                />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
