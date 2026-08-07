import Link from "next/link";
import {
  ArrowRight,
  ListTree,
  CheckCircle2,
  Lightbulb,
  Shield,
  Zap,
  CheckSquare,
  GitBranch,
  Clock,
  Flag,
  Lock,
  Target,
  Gauge,
  SlidersHorizontal,
} from "lucide-react";

import { GuidedForm } from "@/components/guided-form";
import { Card, EmptyState, SectionTitle } from "@/components/ui";
import { listProjects } from "@/db/queries";
import { hasApiKey } from "@/lib/planner";

export const dynamic = "force-dynamic";

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-ink-800 bg-white p-4">
      <div className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-brand-500/10">
        <Icon className="size-4 text-brand-400" aria-hidden />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-ink-100">{title}</h3>
        <p className="mt-0.5 text-[13px] leading-relaxed text-ink-500">{description}</p>
      </div>
    </div>
  );
}

/* Pares fg/bg calibrados para fundo claro: ícone -600/-700 sobre chip -50/-100. */
const tones = {
  brand: "text-brand-400 bg-violet-100",
  blue: "text-blue-600 bg-blue-100",
  purple: "text-purple-600 bg-purple-100",
  pink: "text-pink-600 bg-pink-100",
  indigo: "text-indigo-600 bg-indigo-100",
  cyan: "text-cyan-700 bg-cyan-100",
  amber: "text-amber-600 bg-amber-100",
  green: "text-green-600 bg-green-100",
  orange: "text-orange-600 bg-orange-100",
  lime: "text-lime-700 bg-lime-100",
} as const;

type Tone = keyof typeof tones;

type SidebarItem = {
  label: string;
  description: string;
  icon?: any;
  tone?: Tone;
};

function SidebarSection({ title, items }: { title: string; items: SidebarItem[] }) {
  return (
    <div>
      <h3 className="mb-4 text-center text-[12px] font-semibold uppercase tracking-[0.08em] text-ink-300">
        {title}
      </h3>
      <div className="space-y-3.5">
        {items.map((item, idx) => {
          const ItemIcon = item.icon ?? CheckCircle2;
          const tone = tones[item.tone ?? "brand"];

          return (
            <div key={idx} className="flex items-start gap-3">
              <div className={`mt-0.5 grid size-8 shrink-0 place-items-center rounded-full ${tone}`}>
                <ItemIcon className="size-4" aria-hidden />
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-medium leading-snug text-ink-100">{item.label}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-ink-500">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default async function Home() {
  const projects = await listProjects();

  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <header className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-ink-800 pb-5">
        <img src="/kickoff-logo.svg" alt="Kickoff" className="h-9" />
        {/* flex-1 + text-center centraliza no espaço restante e, quando quebra
            linha no mobile, o span ocupa a largura toda já centralizado. */}
        <span className="flex-1 text-center text-sm uppercase tracking-[0.14em] text-ink-500">
          Planeje melhor. Construa com mais impacto.
        </span>
      </header>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Coluna principal */}
        <div className="space-y-6 lg:col-span-2">
          <section>
            <h1 className="text-3xl font-semibold tracking-tight text-ink-100 sm:text-[2.5rem] sm:leading-[1.12]">
              Descreva o projeto.
              <br className="hidden sm:block" /> Receba o plano de execução.
            </h1>
            {/* Justificado e ocupando a largura toda. hyphens-auto (com lang="pt-BR"
                no <html>) permite quebra silábica e evita os vãos largos entre
                palavras que o justificado produz sem hifenização. */}
            <p className="mt-4 text-justify text-[15px] leading-relaxed text-ink-400 hyphens-auto">
              O Kickoff transforma a descrição de um projeto de software em épicos, tarefas
              estimadas em três pontos, riscos com mitigação, marcos e uma faixa de prazo baseada
              na capacidade real do time. Depois é tudo editável — o plano é o começo da conversa,
              não o fim.
            </p>
          </section>

          <div className="grid gap-3 sm:grid-cols-3">
            <FeatureCard
              icon={Target}
              title="Plano personalizado"
              description="Baseado no seu contexto real"
            />
            <FeatureCard
              icon={Gauge}
              title="Estimativas realistas"
              description="Alinhadas à capacidade do time"
            />
            <FeatureCard
              icon={SlidersHorizontal}
              title="Editável e flexível"
              description="Ajuste tudo com facilidade"
            />
          </div>

          <GuidedForm hasKey={hasApiKey()} />
        </div>

        {/* Sidebar */}
        <aside className="space-y-4 lg:sticky lg:top-8 lg:self-start">
          <Card className="p-5">
            <SidebarSection
              title="O que você vai receber"
              items={[
                {
                  label: "Plano de execução completo",
                  description: "Épicos, features e tarefas organizadas em sprints.",
                },
                {
                  label: "Estimativas realistas",
                  description: "Esforço, prazo e dependências baseados no seu time.",
                },
                {
                  label: "Lista de prazos",
                  description: "Cronograma claro, marcos e entregas.",
                },
                {
                  label: "Tudo editável",
                  description: "Ajuste prioridades, prazos e escopo sempre que precisar.",
                },
              ]}
            />
          </Card>

          <Card className="p-5">
            <SidebarSection
              title="Prévia do plano"
              items={[
                {
                  label: "Épicos e Features",
                  description: "Visão macro do que será construído.",
                  icon: GitBranch,
                  tone: "blue",
                },
                {
                  label: "Tarefas por Sprint",
                  description: "Quebras acionáveis e priorizadas.",
                  icon: CheckSquare,
                  tone: "purple",
                },
                {
                  label: "Estimativas e Dependências",
                  description: "Esforço, prazo e relações claras.",
                  icon: Zap,
                  tone: "pink",
                },
                {
                  label: "Marcos e Prazos",
                  description: "Entrega por etapas, com datas.",
                  icon: Flag,
                  tone: "indigo",
                },
                {
                  label: "Plano Final",
                  description: "Pronto para executar com o time.",
                  icon: CheckCircle2,
                  tone: "cyan",
                },
              ]}
            />
          </Card>

          <Card className="p-5">
            <SidebarSection
              title="Dicas para um ótimo plano"
              items={[
                {
                  label: "Seja claro no problema",
                  description: "Quanto mais contexto, melhor o plano.",
                  icon: Lightbulb,
                  tone: "amber",
                },
                {
                  label: "Descreva o que já existe",
                  description: "Ajuda a entender integrações e riscos.",
                  icon: CheckSquare,
                  tone: "green",
                },
                {
                  label: "Informe restrições e prazos",
                  description: "Isso melhora as estimativas.",
                  icon: Clock,
                  tone: "orange",
                },
                {
                  label: "Revise e ajuste depois",
                  description: "O plano é o começo da conversa.",
                  icon: CheckCircle2,
                  tone: "lime",
                },
              ]}
            />
          </Card>

          <Card className="p-5">
            <SidebarSection
              title="Seguro e confiável"
              items={[
                {
                  label: "Seus dados são protegidos",
                  description: "Privacidade e segurança em primeiro lugar.",
                  icon: Lock,
                  tone: "blue",
                },
                {
                  label: "Não compartilhamos informações",
                  description: "Sua ideia é sua, sempre.",
                  icon: Shield,
                  tone: "indigo",
                },
              ]}
            />
          </Card>
        </aside>
      </div>

      {/* Projetos */}
      <section>
        <SectionTitle hint={`${projects.length} no histórico`}>Projetos</SectionTitle>

        {projects.length === 0 ? (
          <EmptyState title="Nenhum projeto ainda">
            O primeiro plano que você gerar aparece aqui.
          </EmptyState>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {projects.map((project) => (
              <li key={project.id}>
                <Link href={`/projetos/${project.id}`} className="block">
                  <Card className="group h-full p-5 transition-colors hover:border-ink-600">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-medium tracking-tight text-ink-100">{project.name}</h3>
                      <ArrowRight
                        className="mt-0.5 size-4 shrink-0 text-ink-600 transition-colors group-hover:text-brand-400"
                        aria-hidden
                      />
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-500">
                      {project.summary ?? project.description}
                    </p>
                    <div className="mt-4 flex items-center gap-3 text-xs text-ink-500">
                      <span className="inline-flex items-center gap-1.5">
                        <ListTree className="size-3.5" aria-hidden />
                        <span className="tnum">{project.taskCount}</span> tarefas
                      </span>
                      <span aria-hidden>·</span>
                      <span className="tnum">
                        {project.teamSize} pessoa
                        {project.teamSize > 1 ? "s" : ""}
                      </span>
                      <span aria-hidden>·</span>
                      <span>
                        {project.source === "claude" ? "Claude Opus 5" : "heurístico"}
                      </span>
                    </div>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
