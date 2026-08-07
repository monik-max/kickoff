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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="flex min-h-full flex-col font-sans">
        <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
          {children}
        </main>

        <footer className="border-t border-ink-800/80 py-6">
          <div className="mx-auto w-full max-w-6xl px-6 text-center text-xs text-ink-500">
            Estimativas em três pontos (PERT). O prazo é uma faixa de confiança,
            não uma promessa.
          </div>
        </footer>
      </body>
    </html>
  );
}
