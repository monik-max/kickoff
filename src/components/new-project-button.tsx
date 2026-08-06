"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Home } from "lucide-react";
import { Button } from "@/components/ui";

export function NewProjectButton() {
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const handleNewProject = () => {
    setSaving(true);
    setTimeout(() => {
      router.push("/");
    }, 1000);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        onClick={handleNewProject}
        disabled={saving}
      >
        <Home className="size-4" aria-hidden />
        {saving ? "Salvando..." : "Novo Projeto"}
      </Button>
      {saving && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-green-600 text-white px-3 py-1 rounded text-xs whitespace-nowrap">
          ✓ Projeto salvo com sucesso!
        </div>
      )}
    </div>
  );
}
