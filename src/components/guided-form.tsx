"use client";

import {
  useActionState,
  useRef,
  useState,
  useEffect,
  type ReactNode,
  type ComponentProps,
} from "react";
import Link from "next/link";
import { flushSync } from "react-dom";
import { useFormStatus } from "react-dom";
import { ChevronDown, Loader2, ShieldCheck, Sparkles, Trash2 } from "lucide-react";

import { createProject, type FormState } from "@/app/actions";
import { Button, Card, Field, Input, Textarea } from "@/components/ui";
import { cn } from "@/lib/utils";
import { findTool } from "@/lib/glossary";
import { suggestStackFromScope, suggestIntegrationsFromScope } from "@/lib/suggestions";

type DescriptionInput = {
  problem: FormDataEntryValue | null;
  users: FormDataEntryValue | null;
  existing: FormDataEntryValue | null;
  needed: FormDataEntryValue | null;
  technologies: FormDataEntryValue | null;
  integrations: FormDataEntryValue | null;
  requireRealtime: boolean;
  requireScale: boolean;
  requireOffline: boolean;
  requirePayments: boolean;
  requireAI: boolean;
};

function buildDescription(data: DescriptionInput): string {
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

/* Seções coladas dentro de um único card, separadas por régua de ponta a ponta.
   As colapsáveis mantêm o conteúdo MONTADO e apenas escondido: desmontar tiraria
   teamSize/weeklyHours do FormData e a server action receberia null. */
function Section({
  step,
  title,
  collapsible,
  open,
  onToggle,
  children,
}: {
  step: number;
  title: string;
  collapsible?: boolean;
  open?: boolean;
  onToggle?: () => void;
  children: ReactNode;
}) {
  const heading = (
    <>
      <span className="tnum grid size-6 shrink-0 place-items-center rounded-full bg-brand-500/10 text-[11px] font-semibold text-brand-400">
        {step}
      </span>
      <h3 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-ink-300">
        {title}
      </h3>
    </>
  );

  return (
    <section data-section={step} className="border-b border-ink-800">
      {collapsible ? (
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          className="flex w-full items-center gap-2.5 px-6 py-4 text-left transition-colors hover:bg-ink-900"
        >
          {heading}
          <ChevronDown
            className={cn(
              "ml-auto size-4 shrink-0 text-ink-500 transition-transform duration-200",
              open && "rotate-180",
            )}
            aria-hidden
          />
        </button>
      ) : (
        <div className="flex items-center gap-2.5 px-6 pb-4 pt-5">{heading}</div>
      )}

      <div className={cn("px-6 pb-6", collapsible && !open && "hidden")}>{children}</div>
    </section>
  );
}

/* Contador de caracteres como no mockup. O limite exibido é o maxLength real do
   campo, não um número decorativo. */
function CountedTextarea({
  max,
  onValueChange,
  ...props
}: ComponentProps<"textarea"> & { max: number; onValueChange?: (v: string) => void }) {
  const [len, setLen] = useState(0);

  return (
    <div className="relative">
      <Textarea
        maxLength={max}
        className="min-h-[88px] pb-7"
        onChange={(e) => {
          setLen(e.target.value.length);
          onValueChange?.(e.target.value);
        }}
        {...props}
      />
      <span className="tnum pointer-events-none absolute bottom-2.5 right-3 text-[11px] text-ink-600">
        {len}/{max}
      </span>
    </div>
  );
}

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
      {open ? <div className="border-t border-ink-800 px-3.5 py-3.5">{children}</div> : null}
    </div>
  );
}

/* Liga a receita aos ingredientes: cada nome citado numa sugestão que exista no
   glossário vira link para a própria verba. O que não existe lá fica como texto
   comum — melhor um link a menos do que um link que não explica nada. */
function LinkedTools({ names }: { names: string }) {
  const parts = names.split(",").map((p) => p.trim()).filter(Boolean);

  return (
    <>
      {parts.map((part, i) => {
        const found = findTool(part);
        return (
          <span key={`${part}-${i}`}>
            {i > 0 ? ", " : ""}
            {found ? (
              <Link
                href={`/glossario#ferramenta-${found.slug}`}
                title={`${found.tool.what} — ver no glossário`}
                className="underline decoration-brand-500/40 underline-offset-2 transition-colors hover:text-brand-400 hover:decoration-brand-500"
              >
                {part}
              </Link>
            ) : (
              part
            )}
          </span>
        );
      })}
    </>
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
        <span className="font-medium text-ink-300">{metaLabel}:</span>{" "}
        <LinkedTools names={meta} />
      </p>
    </div>
  );
}

function FormFooter({ onClear }: { onClear: () => void }) {
  const { pending } = useFormStatus();

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5">
      <p className="flex items-start gap-2.5 text-xs leading-relaxed text-ink-500">
        <ShieldCheck className="mt-px size-4 shrink-0 text-go-400" aria-hidden />
        <span>
          Suas informações estão seguras
          <br className="hidden sm:block" /> e não serão compartilhadas.
        </span>
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" variant="ghost" onClick={onClear} disabled={pending}>
          <Trash2 className="size-4" aria-hidden />
          Limpar formulário
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Analisando o projeto…
            </>
          ) : (
            <>
              <Sparkles className="size-4" aria-hidden />
              Gerar plano de execução
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export function GuidedForm() {
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

  /* Sugestões são derivadas puras de formValues — calculadas na renderização,
     não guardadas em estado. Antes isto era useState + useEffect, o que gerava
     um render em cascata a cada tecla digitada (e o efeito nunca sincronizou
     nada externo, que é para o que useEffect existe). */
  const suggestedStack = suggestStackFromScope(formValues);
  const suggestedIntegrations = suggestIntegrationsFromScope(formValues);

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
  const [openSections, setOpenSections] = useState<Record<number, boolean>>({
    4: false,
    5: false,
    6: false,
  });

  const toggle = (step: number) =>
    setOpenSections((s) => ({ ...s, [step]: !s[step] }));

  /* Campo inválido dentro de seção fechada: abrimos a seção que o contém.
     'invalid' não borbulha, daí o listener em captura.

     flushSync é obrigatório aqui. Logo depois deste handler o navegador tenta
     focar o campo inválido para mostrar a mensagem; com o re-render assíncrono
     padrão a seção ainda estaria display:none nesse instante e o Chrome aborta
     com "An invalid form control is not focusable" — a seção abria, mas o envio
     morria sem feedback nenhum. */
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    const onInvalid = (event: Event) => {
      const host = (event.target as HTMLElement).closest<HTMLElement>("[data-section]");
      const step = host ? Number(host.dataset.section) : 0;
      if (!step) return;

      flushSync(() => {
        setOpenSections((s) => (s[step] ? s : { ...s, [step]: true }));
      });
    };

    form.addEventListener("invalid", onInvalid, true);
    return () => form.removeEventListener("invalid", onInvalid, true);
  }, []);

  const handleClear = () => {
    formRef.current?.reset();
    setFormValues({
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
    const first = formRef.current?.querySelector("input") as HTMLInputElement | null;
    first?.focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Card className="overflow-hidden">
      <form ref={formRef} action={formAction}>
        <Section step={1} title="Básico">
          <div className="grid gap-5 lg:grid-cols-2">
            <Field label="Nome do projeto" required>
              <Input name="name" required placeholder="Ex.: Portal de entregas" maxLength={120} />
            </Field>
            <Field label="Gerente de Projeto" hint="Responsável pela execução.">
              <Input name="projectManager" placeholder="Ex.: João Silva" maxLength={120} />
            </Field>
          </div>
        </Section>

        <Section step={2} title="Escopo">
          <div className="grid gap-5 lg:grid-cols-2">
            <Field label="Qual é o problema que precisa resolver?" required>
              <CountedTextarea
                name="problem"
                required
                max={300}
                placeholder="Descreva o problema atual, as dores e os impactos para o negócio…"
                onValueChange={(v) => setFormValues((f) => ({ ...f, problem: v }))}
              />
            </Field>
            <Field label="Quem são os usuários?" required>
              <CountedTextarea
                name="users"
                required
                max={200}
                placeholder="Descreva os perfis de usuários e suas principais necessidades…"
              />
            </Field>
            <Field label="O que existe hoje?" required>
              <CountedTextarea
                name="existing"
                required
                max={300}
                placeholder="Sistema ou processo atual — ex.: ERP Neon, WhatsApp, planilha…"
              />
            </Field>
            <Field label="O que precisa ser criado?" required>
              <CountedTextarea
                name="needed"
                required
                max={300}
                placeholder="O que será construído — ex.: app mobile, painel web, integração…"
                onValueChange={(v) => setFormValues((f) => ({ ...f, needed: v }))}
              />
            </Field>
          </div>
        </Section>

        <Section step={3} title="Técnico">
          <div className="grid gap-5">
            <div className="grid gap-5 lg:grid-cols-2">
              <Field label="Tecnologias já usadas" hint="Ex.: Node.js, PostgreSQL, Docker">
                <Input
                  name="technologies"
                  placeholder="Listar tecnologias existentes"
                  maxLength={300}
                />
              </Field>
              <Field label="Stack preferido" hint="Opcional.">
                <Input name="stack" placeholder="Ex.: React, Next.js, AWS" maxLength={200} />
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

        <Section
          step={4}
          title="Requisitos especiais"
          collapsible
          open={openSections[4]}
          onToggle={() => toggle(4)}
        >
          <div className="grid gap-2 lg:grid-cols-2">
            <CheckOption
              name="requireRealtime"
              label="Tempo real (chat, notificações)"
              onChange={(c) => setFormValues((f) => ({ ...f, requireRealtime: c }))}
            />
            <CheckOption
              name="requireScale"
              label="Escala alta (muitos usuários/dados)"
              onChange={(c) => setFormValues((f) => ({ ...f, requireScale: c }))}
            />
            <CheckOption
              name="requireOffline"
              label="Funcionar offline"
              onChange={(c) => setFormValues((f) => ({ ...f, requireOffline: c }))}
            />
            <CheckOption
              name="requirePayments"
              label="Processar pagamentos"
              onChange={(c) => setFormValues((f) => ({ ...f, requirePayments: c }))}
            />
            <CheckOption
              name="requireAI"
              label="IA/ML"
              onChange={(c) => setFormValues((f) => ({ ...f, requireAI: c }))}
            />
          </div>
        </Section>

        <Section
          step={5}
          title="Integrações"
          collapsible
          open={openSections[5]}
          onToggle={() => toggle(5)}
        >
          <div className="grid gap-5">
            <Field label="Quais sistemas/APIs precisa integrar?" hint="Ex.: ERP, CRM, Stripe, Slack">
              <Input
                name="integrations"
                placeholder="Listar integrações necessárias (ou deixe em branco)"
                maxLength={300}
                onChange={(e) => setFormValues((f) => ({ ...f, integrations: e.target.value }))}
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

        <Section
          step={6}
          title="Capacidade e prazos"
          collapsible
          open={openSections[6]}
          onToggle={() => toggle(6)}
        >
          <div className="grid gap-5 sm:grid-cols-3">
            <Field label="Tamanho do time" hint="Pessoas dedicadas." required>
              <Input name="teamSize" type="number" min={1} max={50} defaultValue={3} required />
            </Field>
            <Field label="Horas por semana" hint="Por pessoa, tempo efetivo." required>
              <Input name="weeklyHours" type="number" min={1} max={60} defaultValue={30} required />
            </Field>
            <Field label="Prazo desejado" hint="Opcional.">
              <Input name="targetDate" type="date" />
            </Field>
          </div>
        </Section>

        {state.error ? (
          <p className="mx-6 mt-5 rounded-lg border border-stop-400/30 bg-stop-400/5 px-3 py-2 text-sm text-stop-400">
            {state.error}
          </p>
        ) : null}

        <FormFooter onClear={handleClear} />
      </form>
    </Card>
  );
}
