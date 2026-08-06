import { cn } from "@/lib/utils";

/**
 * Marca do Kickoff.
 *
 * A parte "navy" do logo usa `currentColor` de propósito: sobre o fundo escuro
 * do app, navy sobre navy seria invisível. Assim o K herda a cor do texto
 * (clara aqui, navy sobre fundo claro) e só a seta mantém o violeta fixo — que
 * é o elemento que funciona nos dois fundos.
 */
export function KickoffMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-label="Kickoff"
      className={cn("shrink-0", className)}
    >
      {/* haste vertical do K */}
      <rect x="6" y="8" width="12" height="48" fill="currentColor" />
      {/* braço superior do K */}
      <path d="M21 34 L44 8 L58 8 L35 34 Z" fill="currentColor" />
      {/* perna inferior, desenhada como seta */}
      <path
        d="M21 36 L43 36 L43 27 L60 43 L43 59 L43 51 L37 61 L21 46 Z"
        fill="#5b45e8"
      />
    </svg>
  );
}

export function KickoffLogo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <KickoffMark className="size-7 text-ink-100" />
      <span className="text-[15px] font-semibold tracking-tight">Kickoff</span>
    </span>
  );
}
