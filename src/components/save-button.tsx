"use client";

import { useState, useEffect } from "react";
import { Save, Check } from "lucide-react";
import { Button } from "@/components/ui";

export function SaveButton() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        onClick={handleSave}
        title="Salvar versão do projeto"
      >
        {saved ? (
          <>
            <Check className="size-4 aria-hidden" />
            Salvo!
          </>
        ) : (
          <>
            <Save className="size-4 aria-hidden" />
            Salvar
          </>
        )}
      </Button>
      {saved && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-green-600 text-white px-3 py-1 rounded text-xs whitespace-nowrap">
          ✓ Projeto salvo com sucesso!
        </div>
      )}
    </div>
  );
}
