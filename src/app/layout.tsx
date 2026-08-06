import type { Metadata } from "next";
import Link from "next/link";
import { KickoffLogo } from "@/components/logo";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kickoff — planeje melhor. Construa com mais impacto.",
  description:
    "Descreva o projeto em texto livre e receba escopo, tarefas, estimativas de três pontos, riscos e cronograma.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="flex min-h-full flex-col font-sans">
        <header className="sticky top-0 z-20 border-b border-ink-800/80 bg-ink-950/80 backdrop-blur">
          <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-3 px-6">
            <Link href="/">
              <KickoffLogo />
            </Link>
            <span className="hidden text-xs uppercase tracking-[0.1em] text-ink-400 sm:inline">
              Planeje melhor. Construa com mais impacto.
            </span>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
          {children}
        </main>

        <footer className="border-t border-ink-800/80 py-6">
          <div className="mx-auto w-full max-w-6xl px-6 text-xs text-ink-400">
            Estimativas em três pontos (PERT). O prazo é uma faixa de confiança,
            não uma promessa.
          </div>
        </footer>
      </body>
    </html>
  );
}
