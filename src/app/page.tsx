import Link from "next/link";
import { ArrowRight, ListTree, CheckCircle2, LayoutTemplate, Lightbulb, Shield, Zap, CheckSquare, GitBranch, Clock, Flag, Lock } from "lucide-react";

import { GuidedForm } from "@/components/guided-form";
import { Card, EmptyState, SectionTitle } from "@/components/ui";
import { listProjects } from "@/db/queries";
import { hasApiKey } from "@/lib/planner";

export const dynamic = "force-dynamic";

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-lg border border-ink-700 bg-ink-800/30 p-4">
      <h3 className="font-medium text-ink-100">{title}</h3>
      <p className="mt-1 text-sm text-ink-400">{description}</p>
    </div>
  );
}

type SidebarItem = {
  label: string;
  icon?: any;
  color?: string;
};

function SidebarSection({ icon: Icon, title, items }: { icon: any; title: string; items: Array<string | SidebarItem> }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Icon className="size-5 text-brand-300" aria-hidden />
        <h3 className="font-semibold text-ink-100 text-sm uppercase tracking-wide">{title}</h3>
      </div>
      <div className="space-y-4">
        {items.map((item, idx) => {
          const isObject = typeof item === "object";
          const label = isObject ? item.label : item;
          const ItemIcon = isObject && item.icon ? item.icon : CheckCircle2;
          const color = isObject && item.color ? item.color : "text-brand-300";

          return (
            <div key={idx} className="flex items-start gap-3">
              <div className={`rounded-full p-2.5 ${color.replace("text-", "bg-").replace("-300", "-300/35")} mt-0.5 shrink-0`}>
                <ItemIcon className={`size-5 ${color}`} aria-hidden />
              </div>
              <p className="text-xs text-ink-300 leading-relaxed pt-0.5">{label}</p>
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
    <div className="flex flex-col gap-12">
      {/* Main Content: Hero + Form + Sidebar */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left: Hero + Features + Form (2 columns wide on desktop) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hero Section */}
          <section>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Descreva o projeto. Receba o plano de execução.
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-300">
              O Kickoff transforma a descrição de um projeto de software em épicos,
              tarefas estimadas em três pontos, riscos com mitigação, marcos e uma
              faixa de prazo baseada na capacidade real do time. Depois é tudo
              editável — o plano é o começo da conversa, não o fim.
            </p>
          </section>

          {/* Feature Cards */}
          <div className="grid gap-3 sm:grid-cols-3">
            <FeatureCard
              title="Plano personalizado"
              description="Baseado no seu contexto real"
            />
            <FeatureCard
              title="Estimativas realistas"
              description="Alinhadas à capacidade do time"
            />
            <FeatureCard
              title="Editável e flexível"
              description="Ajuste tudo com facilidade"
            />
          </div>

          {/* Form Section */}
          <section>
            <GuidedForm hasKey={hasApiKey()} />
          </section>
        </div>

        {/* Right: Sidebar */}
        <aside className="space-y-6 lg:sticky lg:top-8">
          <Card className="p-5">
            <SidebarSection
              icon={CheckCircle2}
              title="O que você vai receber"
              items={[
                "Plano de execução completo",
                "Épicos, features e tarefas organizadas",
                "Estimativas em três pontos",
                "Tudo editável — o plano é o começo da conversa, não o fim.",
              ]}
            />
          </Card>

          <Card className="p-5">
            <SidebarSection
              icon={LayoutTemplate}
              title="Prévia do plano"
              items={[
                { label: "Épicos e Features", icon: GitBranch, color: "text-blue-400" },
                { label: "Tarefas por Sprint", icon: CheckSquare, color: "text-purple-400" },
                { label: "Estimativas e Dependências", icon: Zap, color: "text-pink-400" },
                { label: "Marcos e Prazos", icon: Flag, color: "text-indigo-400" },
                { label: "Plano Final", icon: CheckCircle2, color: "text-cyan-400" },
              ]}
            />
          </Card>

          <Card className="p-5">
            <SidebarSection
              icon={Lightbulb}
              title="Dicas para um ótimo plano"
              items={[
                { label: "Seja claro no problema", icon: Lightbulb, color: "text-yellow-400" },
                { label: "Descreva o que já existe", icon: CheckSquare, color: "text-green-400" },
                { label: "Informe restrições e prazos", icon: Clock, color: "text-orange-400" },
                { label: "Revise e ajuste depois", icon: CheckCircle2, color: "text-lime-400" },
              ]}
            />
          </Card>

          <Card className="p-5">
            <SidebarSection
              icon={Shield}
              title="Seguro e confiável"
              items={[
                { label: "Seus dados são protegidos", icon: Lock, color: "text-blue-400" },
                { label: "Não compartilhamos informações", icon: Shield, color: "text-indigo-400" },
              ]}
            />
          </Card>
        </aside>
      </div>

      {/* Projects Section */}
      <section>
        <SectionTitle hint={`${projects.length} no histórico`}>
          Projetos
        </SectionTitle>

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
                      <h3 className="font-medium tracking-tight">
                        {project.name}
                      </h3>
                      <ArrowRight
                        className="mt-0.5 size-4 shrink-0 text-ink-600 transition-colors group-hover:text-brand-300"
                        aria-hidden
                      />
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-400">
                      {project.summary ?? project.description}
                    </p>
                    <div className="mt-4 flex items-center gap-3 text-xs text-ink-400">
                      <span className="inline-flex items-center gap-1.5">
                        <ListTree className="size-3.5" aria-hidden />
                        <span className="tnum">{project.taskCount}</span>{" "}
                        tarefas
                      </span>
                      <span aria-hidden>·</span>
                      <span className="tnum">
                        {project.teamSize} pessoa
                        {project.teamSize > 1 ? "s" : ""}
                      </span>
                      <span aria-hidden>·</span>
                      <span>
                        {project.source === "claude"
                          ? "Claude Opus 5"
                          : "heurístico"}
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
