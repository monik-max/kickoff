"use client";

import { useActionState, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, Sparkles, Wand2 } from "lucide-react";

import { createProject, suggestStackAction, type FormState } from "@/app/actions";
import { Button, Card, Field, Input, Textarea } from "@/components/ui";

const EXEMPLO = `Portal interno para a equipe de logística acompanhar as entregas.
Hoje isso é controlado em planilha e cada motorista manda foto do canhoto no WhatsApp.
Precisamos de: cadastro de entregas, app para o motorista dar baixa com foto e assinatura,
painel para o supervisor ver o que está atrasado, e integração com o ERP que já usamos
para puxar os pedidos.`;

function SuggestStackButton({
  descriptionRef,
  stackRef,
}: {
  descriptionRef: React.RefObject<HTMLTextAreaElement | null>;
  stackRef: React.RefObject<HTMLInputElement | null>;
}) {
  const [loading, setLoading] = useState(false);

  const handleSuggest = async () => {
    const description = descriptionRef.current?.value;
    if (!description || description.length < 10) {
      return;
    }

    setLoading(true);
    try {
      const suggestion = await suggestStackAction(description);
      if (stackRef.current) {
        stackRef.current.value = suggestion;
      }
    } catch (error) {
      console.error("Erro ao sugerir stack:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={handleSuggest}
      disabled={loading}
      className="mt-2 px-3 py-1.5 text-xs"
    >
      {loading ? (
        <>
          <Loader2 className="size-3 animate-spin" aria-hidden />
          Sugerindo…
        </>
      ) : (
        <>
          <Wand2 className="size-3" aria-hidden />
          Sugerir Stack
        </>
      )}
    </Button>
  );
}

function SubmitButton({ hasKey, formRef }: { hasKey: boolean; formRef: React.RefObject<HTMLFormElement | null> }) {
  const { pending } = useFormStatus();

  const handleNewProject = () => {
    if (formRef.current) {
      formRef.current.reset();
      const firstInput = formRef.current.querySelector('input[type="text"], textarea') as HTMLInputElement | HTMLTextAreaElement;
      if (firstInput) {
        firstInput.focus();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button type="submit" disabled={pending}>
        {pending ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Analisando o projeto…
          </>
        ) : (
          <>
            <Sparkles className="size-4" aria-hidden />
            Gerar plano
          </>
        )}
      </Button>
      <Button
        type="button"
        variant="ghost"
        onClick={handleNewProject}
        disabled={pending}
      >
        Novo Projeto
      </Button>
      <span className="text-xs text-ink-400">
        {pending
          ? hasKey
            ? "O Claude está quebrando o escopo em épicos, tarefas e riscos. Costuma levar de 30s a 2min."
            : "Montando o plano com o motor heurístico local."
          : hasKey
            ? "Planejamento com Claude Opus 5."
            : "Sem ANTHROPIC_API_KEY — o plano virá do motor heurístico local."}
      </span>
    </div>
  );
}

export function NewProjectForm({ hasKey }: { hasKey: boolean }) {
  const [state, formAction] = useActionState<FormState, FormData>(
    createProject,
    {},
  );
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);
  const stackRef = useRef<HTMLInputElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  return (
    <Card className="p-6">
      <form ref={formRef} action={formAction} className="flex flex-col gap-5">
        <Field label="Nome do projeto">
          <Input
            name="name"
            required
            placeholder="Portal de entregas"
            maxLength={120}
          />
        </Field>

        <Field
          label="Descreva o projeto"
          hint="Texto livre. Diga o problema, quem usa, o que precisa existir e o que já existe hoje. Quanto mais contexto, melhor o plano."
        >
          <Textarea
            ref={descriptionRef}
            name="description"
            required
            rows={8}
            placeholder={EXEMPLO}
            maxLength={6000}
          />
        </Field>

        <Field
          label="Gerente de Projeto"
          hint="Nome de quem será responsável pela execução e decisões."
        >
          <Input
            name="projectManager"
            placeholder="João Silva"
            maxLength={120}
          />
        </Field>

        <Field
          label="Stack e restrições técnicas"
          hint="Opcional — tecnologias definidas, sistemas legados, limites de infraestrutura."
        >
          <div className="flex flex-col gap-2">
            <Input
              ref={stackRef}
              name="stack"
              placeholder="Next.js + Postgres, precisa rodar no servidor on-premise"
              maxLength={300}
            />
            <SuggestStackButton
              descriptionRef={descriptionRef}
              stackRef={stackRef}
            />
          </div>
        </Field>

        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Tamanho do time" hint="Pessoas dedicadas.">
            <Input
              name="teamSize"
              type="number"
              min={1}
              max={50}
              defaultValue={3}
              required
            />
          </Field>
          <Field label="Horas por semana" hint="Por pessoa, tempo efetivo.">
            <Input
              name="weeklyHours"
              type="number"
              min={1}
              max={60}
              defaultValue={30}
              required
            />
          </Field>
          <Field label="Prazo desejado" hint="Opcional.">
            <Input name="targetDate" type="date" />
          </Field>
        </div>

        {state.error ? (
          <p className="rounded-lg border border-stop-400/30 bg-stop-400/10 px-3 py-2 text-sm text-stop-400">
            {state.error}
          </p>
        ) : null}

        <SubmitButton hasKey={hasKey} formRef={formRef} />
      </form>
    </Card>
  );
}
