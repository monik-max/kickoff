"use client";

import { useEffect, useState } from "react";
import { Clock, ChevronDown } from "lucide-react";
import type { ProjectVersion } from "@/db/schema";
import { Button } from "@/components/ui";

interface VersionHistoryProps {
  projectId: string;
  versions: ProjectVersion[];
}

export function VersionHistory({ projectId, versions }: VersionHistoryProps) {
  const [expanded, setExpanded] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<ProjectVersion | null>(null);

  const dateFormat = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case "criação":
        return "✨";
      case "edição-tarefa":
        return "✏️";
      case "edição-projeto":
        return "⚙️";
      case "edição-risco":
        return "⚠️";
      case "edição-marco":
        return "🚩";
      default:
        return "📝";
    }
  };

  const getChangeLabel = (changeType: string) => {
    switch (changeType) {
      case "criação":
        return "Projeto criado";
      case "edição-tarefa":
        return "Tarefa editada";
      case "edição-projeto":
        return "Projeto editado";
      case "edição-risco":
        return "Risco editado";
      case "edição-marco":
        return "Marco editado";
      default:
        return "Alteração";
    }
  };

  return (
    <div className="border-t border-ink-800 pt-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-sm font-medium text-ink-300 hover:text-ink-100 transition-colors"
      >
        <Clock className="size-4" aria-hidden />
        Histórico de versões
        <ChevronDown
          className={`size-4 transition-transform ${expanded ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {expanded && (
        <div className="mt-4 space-y-2">
          {versions.length === 0 ? (
            <p className="text-xs text-ink-500">Nenhuma versão salva ainda</p>
          ) : (
            <div className="max-h-64 overflow-y-auto space-y-1">
              {versions.map((version, idx) => (
                <button
                  key={version.id}
                  onClick={() => setSelectedVersion(version)}
                  className={`w-full text-left px-3 py-2 rounded-md text-xs transition-colors ${
                    selectedVersion?.id === version.id
                      ? "bg-brand-500/20 text-brand-300"
                      : "hover:bg-ink-800 text-ink-400"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{getChangeIcon(version.changeType)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">
                        {getChangeLabel(version.changeType)}
                      </div>
                      <div className="text-[10px] text-ink-500">
                        {dateFormat.format(new Date(version.createdAt))}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedVersion && (
        <div className="mt-4 p-3 bg-ink-800/50 rounded-md text-xs">
          <div className="space-y-2">
            <div>
              <strong className="text-ink-300">Tipo:</strong>{" "}
              <span className="text-ink-400">{getChangeLabel(selectedVersion.changeType)}</span>
            </div>
            <div>
              <strong className="text-ink-300">Data:</strong>{" "}
              <span className="text-ink-400">
                {dateFormat.format(new Date(selectedVersion.createdAt))}
              </span>
            </div>
            {selectedVersion.description && (
              <div>
                <strong className="text-ink-300">Descrição:</strong>{" "}
                <span className="text-ink-400">{selectedVersion.description}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
