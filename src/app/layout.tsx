import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kickoff — planeje melhor. Construa com mais impacto.",
  description:
    "Descreva o projeto em texto livre e receba escopo, tarefas, estimativas de três pontos, riscos e cronograma.",
  icons: {
    icon: "/kickoff-k-icon.svg",
  },
};

/* Itens com `href` são links de verdade; os sem href são placeholders visuais,
   porque essas rotas ainda não existem e navegação que leva a 404 é pior que
   navegação ausente. Eles ficam apagados e marcados como "em breve" para não
   prometer o que não entrega. */
const NAV = [
  { label: "Novo projeto", href: "/" },
  { label: "Glossário", href: "/glossario" },
  { label: "Meus projetos", href: null },
  { label: "Modelos", href: null },
  { label: "Planos", href: null },
];

function TopBar() {
  return (
    <div className="border-b border-ink-800 bg-white">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-8 px-6 py-3">
        {/* next/image não ajuda aqui: o logo é um SVG estático de ~700 bytes,
            que não se beneficia de redimensionamento nem de conversão de
            formato, e serví-lo pelo next/image exigiria dangerouslyAllowSVG. */}
        <Link href="/" className="shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/kickoff-logo.svg" alt="Kickoff" className="h-8" />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((item) =>
            item.href ? (
              <Link
                key={item.label}
                href={item.href}
                className="py-3 text-sm font-medium text-ink-200 transition-colors hover:text-brand-400"
              >
                {item.label}
              </Link>
            ) : (
              <span
                key={item.label}
                title="Em breve"
                className="py-3 text-sm text-ink-600"
              >
                {item.label}
              </span>
            ),
          )}
        </nav>

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
            {/* eslint-disable-next-line @next/next/no-img-element -- SVG estático, ver nota no TopBar */}
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
