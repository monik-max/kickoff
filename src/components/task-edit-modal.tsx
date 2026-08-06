"use client";

import { useActionState, useState } from "react";
import { X } from "lucide-react";

import { updateTask } from "@/app/actions";
import { Button, Input, Textarea } from "@/components/ui";
import { cn } from "@/lib/utils";

interface TaskEditModalProps {
  task: {
    id: string;
    title: string;
    description: string;
    optimisticHours: number;
    likelyHours: number;
    pessimisticHours: number;
    priority: "alta" | "media" | "baixa";
  };
  projectId: string;
  onClose: () => void;
  onSave?: () => void;
}

export function TaskEditModal({
  task,
  projectId,
  onClose,
  onSave,
}: TaskEditModalProps) {
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description,
    optimisticHours: task.optimisticHours,
    likelyHours: task.likelyHours,
    pessimisticHours: task.pessimisticHours,
    priority: task.priority,
  });

  const [state, formAction] = useActionState(
    async () => {
      const result = await updateTask(task.id, projectId, formData);
      if (result?.success) {
        onSave?.();
        onClose();
      }
      return result;
    },
    null as any,
  );

  const handleChange = (
    field: keyof typeof formData,
    value: any,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-lg bg-ink-900 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-ink-800 px-6 py-4">
          <h2 className="text-lg font-semibold">Editar tarefa</h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 transition-colors hover:bg-ink-800"
            aria-label="Fechar"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Form */}
        <form action={formAction} className="space-y-4 p-6">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-ink-100">
              Título
            </label>
            <Input
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="mt-1"
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-ink-100">
              Descrição
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={4}
              className="mt-1"
            />
          </div>

          {/* Estimativas */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-ink-400">
                Otimista (h)
              </label>
              <Input
                type="number"
                value={formData.optimisticHours}
                onChange={(e) =>
                  handleChange("optimisticHours", parseInt(e.target.value) || 0)
                }
                min={0}
                max={400}
                className="mt-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-ink-400">
                Provável (h)
              </label>
              <Input
                type="number"
                value={formData.likelyHours}
                onChange={(e) =>
                  handleChange("likelyHours", parseInt(e.target.value) || 0)
                }
                min={0}
                max={400}
                className="mt-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-ink-400">
                Pessimista (h)
              </label>
              <Input
                type="number"
                value={formData.pessimisticHours}
                onChange={(e) =>
                  handleChange("pessimisticHours", parseInt(e.target.value) || 0)
                }
                min={0}
                max={400}
                className="mt-1"
              />
            </div>
          </div>

          {/* Prioridade */}
          <div>
            <label className="block text-sm font-medium text-ink-100">
              Prioridade
            </label>
            <div className="mt-2 flex gap-2">
              {(["alta", "media", "baixa"] as const).map((priority) => (
                <button
                  key={priority}
                  type="button"
                  onClick={() => handleChange("priority", priority)}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    formData.priority === priority
                      ? "bg-brand-500 text-white"
                      : "border border-ink-700 text-ink-300 hover:border-ink-600",
                  )}
                >
                  {priority === "alta"
                    ? "Alta"
                    : priority === "media"
                      ? "Média"
                      : "Baixa"}
                </button>
              ))}
            </div>
          </div>

          {/* Ações */}
          <div className="flex justify-end gap-2 border-t border-ink-800 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button type="submit">
              Salvar mudanças
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
