import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        // Superfície branca sólida + borda + sombra curta. No tema claro a
        // definição do card vem da borda/sombra, não do contraste de fundo.
        "rounded-xl border border-ink-800 bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04),0_1px_3px_rgba(16,24,40,0.06)]",
        className,
      )}
      {...props}
    />
  );
}

export function SectionTitle({
  children,
  hint,
}: {
  children: ReactNode;
  hint?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-baseline justify-between gap-4">
      <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink-400">
        {children}
      </h2>
      {hint ? <span className="text-xs text-ink-400">{hint}</span> : null}
    </div>
  );
}

const buttonVariants = {
  primary:
    "bg-brand-500 text-white shadow-sm hover:bg-brand-400 active:bg-brand-600 disabled:bg-ink-600 disabled:text-white/70 disabled:shadow-none",
  ghost:
    "border border-ink-700 bg-white text-ink-200 hover:border-ink-600 hover:bg-ink-850 active:bg-ink-800",
  danger:
    "border border-stop-400/40 bg-white text-stop-400 hover:bg-stop-400/5",
} as const;

export function Button({
  className,
  variant = "primary",
  ...props
}: ComponentProps<"button"> & { variant?: keyof typeof buttonVariants }) {
  return (
    <button
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-all disabled:cursor-not-allowed",
        buttonVariants[variant],
        className,
      )}
      {...props}
    />
  );
}

export function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-ink-200">
        {label}
        {required ? (
          <span className="ml-0.5 text-stop-400" aria-hidden>
            *
          </span>
        ) : null}
      </span>
      {children}
      {hint ? <span className="text-xs text-ink-500">{hint}</span> : null}
    </label>
  );
}

// h-10 alinha com Button; ring de foco em vez de só trocar a borda (o shift de
// 1px na borda sozinho é um sinal fraco de foco).
const controlClass =
  "h-10 w-full rounded-lg border border-ink-700 bg-white px-3 text-sm text-ink-100 placeholder:text-ink-600 transition-shadow hover:border-ink-600 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/12";

// No React 19 `ref` é uma prop comum, então ComponentProps já a inclui — a
// intersecção `& { ref?: any }` que existia aqui era redundante.
export function Input({ className, ref, ...props }: ComponentProps<"input">) {
  return <input ref={ref} className={cn(controlClass, className)} {...props} />;
}

export function Textarea({ className, ref, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      ref={ref}
      // h-auto/min-h anulam o h-10 do controlClass via twMerge.
      className={cn(controlClass, "h-auto min-h-24 resize-y py-2 leading-relaxed", className)}
      {...props}
    />
  );
}

export function Stat({
  label,
  value,
  sub,
  tone = "default",
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "default" | "brand";
}) {
  return (
    <div className="rounded-xl border border-ink-800 bg-white px-4 py-3">
      <div className="text-[11px] font-medium uppercase tracking-[0.12em] text-ink-500">
        {label}
      </div>
      <div
        className={cn(
          "tnum mt-1 text-2xl font-semibold tracking-tight",
          tone === "brand" ? "text-brand-300" : "text-ink-100",
        )}
      >
        {value}
      </div>
      {sub ? <div className="mt-0.5 text-xs text-ink-400">{sub}</div> : null}
    </div>
  );
}

const roleTones: Record<string, string> = {
  produto: "border-violet-200 bg-violet-50 text-violet-700",
  design: "border-pink-200 bg-pink-50 text-pink-700",
  frontend: "border-sky-200 bg-sky-50 text-sky-700",
  backend: "border-emerald-200 bg-emerald-50 text-emerald-700",
  dados: "border-violet-200 bg-violet-50 text-violet-700",
  devops: "border-orange-200 bg-orange-50 text-orange-700",
  qa: "border-teal-200 bg-teal-50 text-teal-700",
};

const roleDescriptions: Record<string, string> = {
  produto: "Gerencia escopo, regras de negócio e experiência do usuário",
  design: "Desenha interfaces, prototipa e valida usabilidade",
  frontend: "Desenvolve telas, interatividade e experiência visual",
  backend: "Cria APIs, bancos de dados e lógica de negócio",
  dados: "Analisa dados, cria relatórios e otimiza informações",
  devops: "Configura infraestrutura, CI/CD e desempenho",
  qa: "Testa qualidade, identifica bugs e garante confiabilidade",
};

export function RoleBadge({ role }: { role: string }) {
  return (
    <span
      title={roleDescriptions[role] || role}
      className={cn(
        "inline-flex shrink-0 items-center rounded-md border px-1.5 py-0.5 text-[11px] font-medium",
        roleTones[role] ?? "border-ink-700 bg-ink-800 text-ink-300",
      )}
    >
      {role}
    </span>
  );
}

export function PriorityDot({ priority }: { priority: string }) {
  const tone =
    priority === "alta"
      ? "bg-stop-400"
      : priority === "media"
        ? "bg-warn-400"
        : "bg-ink-600";
  return (
    <span
      title={`Prioridade ${priority}`}
      className={cn("inline-block size-1.5 shrink-0 rounded-full", tone)}
    />
  );
}

export function EmptyState({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  return (
    <Card className="px-6 py-10 text-center">
      <p className="text-sm font-medium text-ink-100">{title}</p>
      {children ? (
        <p className="mx-auto mt-1.5 max-w-md text-sm text-ink-400">
          {children}
        </p>
      ) : null}
    </Card>
  );
}
