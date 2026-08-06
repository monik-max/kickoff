"use client";

import { useState, useTransition } from "react";
import { Download, FileText, Trash2 } from "lucide-react";

import { deleteProject, setCapacity } from "@/app/actions";
import { generatePlanPDF } from "@/lib/export-pdf";
import type { ProjectDetail } from "@/db/queries";
import { Button } from "@/components/ui";

export function CapacityControls({
  projectId,
  teamSize,
  weeklyHours,
}: {
  projectId: string;
  teamSize: number;
  weeklyHours: number;
}) {
  const [values, setValues] = useState({ teamSize, weeklyHours });
  const [pending, startTransition] = useTransition();

  function commit(next: typeof values) {
    setValues(next);
    startTransition(() => {
      void setCapacity(projectId, next.teamSize, next.weeklyHours);
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-4 text-sm">
      <label className="flex items-center gap-2">
        <span className="text-ink-400">Pessoas</span>
        <input
          type="number"
          min={1}
          max={50}
          value={values.teamSize}
          onChange={(event) =>
            commit({ ...values, teamSize: Number(event.target.value) || 1 })
          }
          className="tnum w-16 rounded-md border border-ink-700 bg-ink-850 px-2 py-1"
        />
      </label>
      <label className="flex items-center gap-2">
        <span className="text-ink-400">Horas/semana</span>
        <input
          type="number"
          min={1}
          max={60}
          value={values.weeklyHours}
          onChange={(event) =>
            commit({ ...values, weeklyHours: Number(event.target.value) || 1 })
          }
          className="tnum w-16 rounded-md border border-ink-700 bg-ink-850 px-2 py-1"
        />
      </label>
      <span className="text-xs text-ink-400">
        {pending ? "recalculando…" : "o prazo recalcula sozinho"}
      </span>
    </div>
  );
}

export function ExportButton({
  markdown,
  filename,
}: {
  markdown: string;
  filename: string;
}) {
  function download() {
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Button variant="ghost" onClick={download}>
      <Download className="size-4" aria-hidden />
      Exportar Markdown
    </Button>
  );
}

export function ExportPDFButton({ detail }: { detail: ProjectDetail }) {
  function downloadPDF() {
    const slug =
      detail.project.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") || "plano";

    generatePlanPDF(detail, `plano-${slug}.pdf`);
  }

  return (
    <Button variant="ghost" onClick={downloadPDF}>
      <FileText className="size-4" aria-hidden />
      Exportar PDF
    </Button>
  );
}

export function DeleteProjectButton({ projectId }: { projectId: string }) {
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  if (!confirming) {
    return (
      <Button variant="ghost" onClick={() => setConfirming(true)}>
        <Trash2 className="size-4" aria-hidden />
        Excluir
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="danger"
        disabled={pending}
        onClick={() =>
          startTransition(() => {
            void deleteProject(projectId);
          })
        }
      >
        {pending ? "Excluindo…" : "Confirmar exclusão"}
      </Button>
      <Button variant="ghost" onClick={() => setConfirming(false)}>
        Cancelar
      </Button>
    </div>
  );
}
