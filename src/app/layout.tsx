import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kickoff — planeje melhor. Construa com mais impacto.",
  description:
    "Descreva o projeto em texto livre e receba escopo, tarefas, estimativas de três pontos, riscos e cronograma.",
  icons: {
    icon: "/kickoff-k-icon.svg",
  },
};

/* Barra superior decorativa. Os itens NÃO são links: as rotas /modelos,
   /planos e o login ainda não existem, e navegação que leva a 404 é pior que
   navegação ausente. Vira <nav> de verdade quando essas telas existirem. */
function TopBar() {
  const items = ["Novo projeto", "Meus projetos", "Modelos", "Planos"];

  return (
    <div className="border-b border-ink-800 bg-white">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-8 px-6 py-3">
        <img src="/kickoff-logo.svg" alt="Kickoff" className="h-8 shrink-0" />

        <div className="hidden items-center gap-7 md:flex">
          {items.map((label, i) => (
            <span
              key={label}
              title="Ainda não disponível"
              className={
                i === 0
                  ? "border-b-2 border-brand-500 py-3 text-sm font-medium text-brand-400"
                  : "py-3 text-sm text-ink-500"
              }
            >
              {label}
            </span>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-4">
          <span className="hidden text-sm text-ink-500 lg:inline" title="Ainda não disponível">
            Centro de ajuda
          </span>
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-500 text-xs font-semibold text-white">
              JS
            </span>
            <span className="hidden leading-tight sm:block">
              <span className="block text-sm font-medium text-ink-100">João Silva</span>
              <span className="block text-xs text-ink-500">Gerente de Projeto</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="flex min-h-full flex-col font-sans">
        <TopBar />

        <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
          {children}
        </main>

        <footer className="border-t border-ink-800/80 py-8">
          <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-3 px-6">
            <img src="/kickoff-logo.svg" alt="Kickoff" className="h-7" />
            <p className="text-center text-xs text-ink-500">
              Estimativas em três pontos (PERT). O prazo é uma faixa de
              confiança, não uma promessa.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
