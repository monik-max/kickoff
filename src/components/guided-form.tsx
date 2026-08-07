"use client";

import { useActionState, useRef, useState, useEffect, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { ChevronDown, Loader2, Sparkles } from "lucide-react";

import { createProject, type FormState } from "@/app/actions";
import { Button, Card, Field, Input } from "@/components/ui";
import { cn } from "@/lib/utils";
import { suggestStackFromScope, suggestIntegrationsFromScope, type StackItem } from "@/lib/suggestions";

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

/* Seção numerada. O número dá wayfinding num formulário de 6 blocos — sem ele
   o usuário perde a noção de onde está durante o scroll. Separação por régua
   em vez de borda: evita empilhar superfícies dentro do Card. */
function Section({
  step,
  title,
  children,
}: {
  step: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-ink-800 pt-7 first:border-t-0 first:pt-0">
      <div className="mb-4 flex items-center gap-2.5">
        <span className="tnum grid size-6 shrink-0 place-items-center rounded-full bg-brand-500/10 text-[11px] font-semibold text-brand-400">
          {step}
        </span>
        <h3 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-ink-300">
          {title}
        </h3>
      </div>
      {children}
    </section>
  );
}

/* Checkbox como alvo clicável inteiro. O input nativo solto tem ~16px de área
   de clique; embrulhado assim o alvo vira a linha toda, e o estado marcado
   ganha sinal visual via has-[:checked]. */
function CheckOption({
  name,
  label,
  onChange,
}: {
  name: string;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-ink-800 px-3 py-2.5 transition-colors hover:border-ink-600 hover:bg-ink-850 has-[:checked]:border-brand-500/40 has-[:checked]:bg-brand-500/5">
      <input
        type="checkbox"
        name={name}
        className="size-4 shrink-0"
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="text-sm text-ink-200">{label}</span>
    </label>
  );
}

function SuggestionPanel({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-ink-800">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 bg-ink-850 px-3.5 py-3 text-left transition-colors hover:bg-ink-800"
      >
        <span className="text-sm font-medium text-ink-200">{title}</span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-ink-500 transition-transform duration-200",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>
      {open ? (
        <div className="border-t border-ink-800 px-3.5 py-3.5">{children}</div>
      ) : null}
    </div>
  );
}

function SuggestionItem({
  name,
  description,
  meta,
  metaLabel,
}: {
  name: string;
  description: string;
  meta: string;
  metaLabel: string;
}) {
  return (
    <div className="border-l-2 border-brand-500/25 pl-3">
      <h4 className="text-sm font-medium text-ink-100">{name}</h4>
      <p className="mt-0.5 text-xs leading-relaxed text-ink-500">{description}</p>
      <p className="mt-1.5 text-xs text-ink-400">
        <span className="font-medium text-ink-300">{metaLabel}:</span> {meta}
      </p>
    </div>
  );
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
    // Barra de ação fixa ao rodapé da viewport enquanto o card está em vista.
    // Sem isso o CTA fica enterrado no fim de um formulário de ~15 campos.
    <div className="sticky bottom-0 -mx-6 -mb-6 mt-2 rounded-b-xl border-t border-ink-800 bg-white px-6 py-4 shadow-[0_-6px_16px_-6px_rgba(16,24,40,0.10)]">
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
        <span className="text-xs text-ink-500">
          {pending
            ? "O Kickoff está quebrando o escopo em épicos, tarefas e riscos…"
            : "Campos marcados são obrigatórios."}
        </span>
      </div>
    </div>
  );
}

export function GuidedForm({ hasKey }: { hasKey: boolean }) {
  const [formValues, setFormValues] = useState({
    problem: "",
    users: "",
    existing: "",
    needed: "",
    technologies: "",
    integrations: "",
    requireRealtime: false,
    requireScale: false,
    requireOffline: false,
    requirePayments: false,
    requireAI: false,
  });

  const [suggestedStack, setSuggestedStack] = useState<StackItem[]>([]);
  const [suggestedIntegrations, setSuggestedIntegrations] = useState<any[]>([]);

  // Atualizar sugestões em tempo real
  useEffect(() => {
    const stack = suggestStackFromScope(formValues);
    setSuggestedStack(stack);

    const integrations = suggestIntegrationsFromScope(formValues);
    setSuggestedIntegrations(integrations);
  }, [formValues]);

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
  const [expandStack, setExpandStack] = useState(false);
  const [expandIntegrations, setExpandIntegrations] = useState(false);

  return (
    <Card className="p-6">
      <form ref={formRef} action={formAction} className="flex flex-col gap-7">
        <Section step={1} title="Básico">
          <div className="grid gap-4 sm:grid-cols-2">
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
        </Section>

        <Section step={2} title="Escopo">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Qual é o problema que precisa resolver?"
              hint="Ex: controlar em planilha é lento"
            >
              <Input
                name="problem"
                required
                placeholder="Descreva o problema atual"
                maxLength={300}
                onChange={(e) => setFormValues({ ...formValues, problem: e.target.value })}
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
                onChange={(e) => setFormValues({ ...formValues, needed: e.target.value })}
              />
            </Field>
          </div>
        </Section>

        <Section step={3} title="Técnico">
          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Tecnologias já usadas" hint="Ex: React, Node.js, PostgreSQL, Docker">
                <Input
                  name="technologies"
                  placeholder="Listar tecnologias existentes"
                  maxLength={300}
                />
              </Field>

              <Field label="Stack preferido" hint="Opcional.">
                <Input name="stack" placeholder="Ex: Next.js + Postgres" maxLength={200} />
              </Field>
            </div>

            {suggestedStack.length > 0 ? (
              <SuggestionPanel
                title="Stack sugerido para seu projeto"
                open={expandStack}
                onToggle={() => setExpandStack(!expandStack)}
              >
                <div className="grid gap-3.5">
                  {suggestedStack.map((item, idx) => (
                    <SuggestionItem
                      key={idx}
                      name={item.layer}
                      description={item.description}
                      meta={item.options}
                      metaLabel="Opções"
                    />
                  ))}
                </div>
              </SuggestionPanel>
            ) : null}
          </div>
        </Section>

        <Section step={4} title="Requisitos especiais">
          <div className="grid gap-2 sm:grid-cols-2">
            <CheckOption
              name="requireRealtime"
              label="Tempo real (chat, notificações)"
              onChange={(checked) => setFormValues({ ...formValues, requireRealtime: checked })}
            />
            <CheckOption
              name="requireScale"
              label="Escala alta (muitos usuários/dados)"
              onChange={(checked) => setFormValues({ ...formValues, requireScale: checked })}
            />
            <CheckOption
              name="requireOffline"
              label="Funcionar offline"
              onChange={(checked) => setFormValues({ ...formValues, requireOffline: checked })}
            />
            <CheckOption
              name="requirePayments"
              label="Processar pagamentos"
              onChange={(checked) => setFormValues({ ...formValues, requirePayments: checked })}
            />
            <CheckOption
              name="requireAI"
              label="IA/ML"
              onChange={(checked) => setFormValues({ ...formValues, requireAI: checked })}
            />
          </div>
        </Section>

        <Section step={5} title="Integrações">
          <div className="grid gap-4">
            <Field label="Quais sistemas/APIs precisa integrar?" hint="Ex: ERP, CRM, Stripe, Slack">
              <Input
                name="integrations"
                placeholder="Listar integrações necessárias (ou deixe em branco)"
                maxLength={300}
                onChange={(e) => setFormValues({ ...formValues, integrations: e.target.value })}
              />
            </Field>

            {suggestedIntegrations.length > 0 ? (
              <SuggestionPanel
                title="Integrações sugeridas para seu projeto"
                open={expandIntegrations}
                onToggle={() => setExpandIntegrations(!expandIntegrations)}
              >
                <div className="grid gap-3.5">
                  {suggestedIntegrations.map((integration, idx) => (
                    <SuggestionItem
                      key={idx}
                      name={integration.name}
                      description={integration.description}
                      meta={integration.examples}
                      metaLabel="Exemplos"
                    />
                  ))}
                </div>
              </SuggestionPanel>
            ) : null}
          </div>
        </Section>

        <Section step={6} title="Capacidade">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Tamanho do time" hint="Pessoas dedicadas.">
              <Input name="teamSize" type="number" min={1} max={50} defaultValue={3} required />
            </Field>
            <Field label="Horas por semana" hint="Por pessoa, tempo efetivo.">
              <Input name="weeklyHours" type="number" min={1} max={60} defaultValue={30} required />
            </Field>
            <Field label="Prazo desejado" hint="Opcional.">
              <Input name="targetDate" type="date" />
            </Field>
          </div>
        </Section>

        {state.error ? (
          <p className="rounded-lg border border-stop-400/30 bg-stop-400/5 px-3 py-2 text-sm text-stop-400">
            {state.error}
          </p>
        ) : null}

        <SubmitButton formRef={formRef} />
      </form>
    </Card>
  );
}
