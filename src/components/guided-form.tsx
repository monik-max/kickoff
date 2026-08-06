"use client";

import { useActionState, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, Sparkles } from "lucide-react";

import { createProject, type FormState } from "@/app/actions";
import { Button, Card, Field, Input } from "@/components/ui";

function buildDescription(data: Record<string, any>): string {
  const parts = [];

  if (data.problem) parts.push(`Problema: ${data.problem}`);
  if (data.users) parts.push(`Usuários: ${data.users}`);
  if (data.existing) parts.push(`Hoje temos: ${data.existing}`);
  if (data.needed) parts.push(`Precisamos criar: ${data.needed}`);
  if (data.technologies) parts.push(`Tecnologias já usadas: ${data.technologies}`);

  const requirements = [];
  if (data.requireRealtime) requirements.push("tempo real");
  if (data.requireScale) requirements.push("escala");
  if (data.requireOffline) requirements.push("offline");
  if (data.requirePayments) requirements.push("pagamentos");
  if (data.requireAI) requirements.push("IA");

  if (requirements.length > 0) {
    parts.push(`Requisitos especiais: ${requirements.join(", ")}`);
  }

  if (data.integrations) parts.push(`Integrações necessárias: ${data.integrations}`);

  return parts.join("\n\n");
}

function SubmitButton({ formRef }: { formRef: React.RefObject<HTMLFormElement | null> }) {
  const { pending } = useFormStatus();

  const handleNewProject = () => {
    if (formRef.current) {
      formRef.current.reset();
      const firstInput = formRef.current.querySelector("input") as HTMLInputElement;
      if (firstInput) {
        firstInput.focus();
        window.scrollTo({ top: 0, behavior: "smooth" });
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
      <Button type="button" variant="ghost" onClick={handleNewProject} disabled={pending}>
        Novo Projeto
      </Button>
      <span className="text-xs text-ink-400">
        {pending
          ? "O Kickoff está quebrando o escopo em épicos, tarefas e riscos…"
          : "Responda as perguntas abaixo e geramos o plano automaticamente."}
      </span>
    </div>
  );
}

export function GuidedForm({ hasKey }: { hasKey: boolean }) {
  const [state, formAction] = useActionState<FormState, FormData>(
    async (_prev, formData) => {
      const data = {
        name: formData.get("name"),
        projectManager: formData.get("projectManager"),
        teamSize: formData.get("teamSize"),
        weeklyHours: formData.get("weeklyHours"),
        targetDate: formData.get("targetDate"),
        problem: formData.get("problem"),
        users: formData.get("users"),
        existing: formData.get("existing"),
        needed: formData.get("needed"),
        technologies: formData.get("technologies"),
        requireRealtime: formData.has("requireRealtime"),
        requireScale: formData.has("requireScale"),
        requireOffline: formData.has("requireOffline"),
        requirePayments: formData.has("requirePayments"),
        requireAI: formData.has("requireAI"),
        integrations: formData.get("integrations"),
        stack: formData.get("stack"),
      };

      const description = buildDescription(data);

      const newFormData = new FormData();
      newFormData.append("name", data.name as string);
      newFormData.append("description", description);
      newFormData.append("projectManager", data.projectManager as string);
      newFormData.append("teamSize", data.teamSize as string);
      newFormData.append("weeklyHours", data.weeklyHours as string);
      newFormData.append("targetDate", data.targetDate as string);
      newFormData.append("stack", data.stack as string);

      return createProject(_prev, newFormData);
    },
    {},
  );

  const formRef = useRef<HTMLFormElement | null>(null);
  const [integrations, setIntegrations] = useState("");

  return (
    <Card className="p-6">
      <form ref={formRef} action={formAction} className="flex flex-col gap-5">
        {/* Básico */}
        <div className="rounded-lg border border-ink-700 bg-ink-800/30 p-4">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-ink-300">
            Básico
          </h3>

          <Field label="Nome do projeto">
            <Input
              name="name"
              required
              placeholder="Portal de entregas"
              maxLength={120}
            />
          </Field>

          <Field label="Gerente de Projeto" hint="Responsável pela execução.">
            <Input name="projectManager" placeholder="João Silva" maxLength={120} />
          </Field>
        </div>

        {/* Escopo */}
        <div className="rounded-lg border border-ink-700 bg-ink-800/30 p-4">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-ink-300">
            Escopo
          </h3>

          <Field label="Qual é o problema que precisa resolver?" hint="Ex: controlar em planilha é lento">
            <Input
              name="problem"
              required
              placeholder="Descreva o problema atual"
              maxLength={300}
            />
          </Field>

          <Field label="Quem são os usuários?" hint="Ex: motoristas, supervisores, gerentes">
            <Input
              name="users"
              required
              placeholder="Listar os tipos de usuários"
              maxLength={200}
            />
          </Field>

          <Field label="O que existe hoje?" hint="Ex: ERP Neon, WhatsApp, planilha">
            <Input
              name="existing"
              required
              placeholder="Descrever o sistema/processo atual"
              maxLength={300}
            />
          </Field>

          <Field label="O que precisa ser criado?" hint="Ex: app mobile, painel web, integração">
            <Input
              name="needed"
              required
              placeholder="Descrever o que será construído"
              maxLength={300}
            />
          </Field>
        </div>

        {/* Técnico */}
        <div className="rounded-lg border border-ink-700 bg-ink-800/30 p-4">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-ink-300">
            Técnico
          </h3>

          <Field
            label="Tecnologias já usadas"
            hint="Ex: React, Node.js, PostgreSQL, Docker"
          >
            <Input
              name="technologies"
              placeholder="Listar tecnologias existentes"
              maxLength={300}
            />
          </Field>

          <Field label="Stack preferido (opcional)">
            <Input
              name="stack"
              placeholder="Ex: Next.js + Postgres"
              maxLength={200}
            />
          </Field>
        </div>

        {/* Requisitos especiais */}
        <div className="rounded-lg border border-ink-700 bg-ink-800/30 p-4">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-ink-300">
            Requisitos especiais
          </h3>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="requireRealtime" className="size-4" />
              <span className="text-sm text-ink-200">Precisa de tempo real (chat, notificações)</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="requireScale" className="size-4" />
              <span className="text-sm text-ink-200">Precisa de escala alta (muitos usuários/dados)</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="requireOffline" className="size-4" />
              <span className="text-sm text-ink-200">Precisa funcionar offline</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="requirePayments" className="size-4" />
              <span className="text-sm text-ink-200">Precisa processar pagamentos</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="requireAI" className="size-4" />
              <span className="text-sm text-ink-200">Precisa de IA/ML</span>
            </label>
          </div>
        </div>

        {/* Integrações */}
        <div className="rounded-lg border border-ink-700 bg-ink-800/30 p-4">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-ink-300">
            Integrações
          </h3>

          <Field label="Quais sistemas/APIs precisa integrar?" hint="Ex: ERP, CRM, Stripe, Slack">
            <Input
              name="integrations"
              placeholder="Listar integrações necessárias"
              maxLength={300}
              onChange={(e) => setIntegrations(e.target.value)}
            />
          </Field>

          {integrations && (
            <div className="mt-3 rounded-md border border-ink-600 bg-ink-800/50 p-3 text-sm text-ink-300">
              <p className="mb-2 font-medium text-ink-200">Sugestões baseadas em suas integrações:</p>
              <ul className="space-y-1 text-xs">
                {integrations.toLowerCase().includes("erp") && (
                  <li>✓ Message Queue (RabbitMQ/Redis) para sincronização</li>
                )}
                {integrations.toLowerCase().includes("pagamento") ||
                  integrations.toLowerCase().includes("stripe")
                  ? <li>✓ Webhooks para notificações de transações</li>
                  : null}
                {integrations.toLowerCase().includes("slack") && (
                  <li>✓ OAuth2 para autenticação via Slack</li>
                )}
                {integrations && <li>✓ API Gateway para gerenciar integrações</li>}
              </ul>
            </div>
          )}
        </div>

        {/* Capacidade */}
        <div className="rounded-lg border border-ink-700 bg-ink-800/30 p-4">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-ink-300">
            Capacidade
          </h3>

          <div className="grid gap-4 sm:grid-cols-3">
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
        </div>

        {state.error ? (
          <p className="rounded-lg border border-stop-400/30 bg-stop-400/10 px-3 py-2 text-sm text-stop-400">
            {state.error}
          </p>
        ) : null}

        <SubmitButton formRef={formRef} />
      </form>
    </Card>
  );
}
