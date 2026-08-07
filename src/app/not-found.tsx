import Link from "next/link";
import { ArrowLeft, FileQuestion } from "lucide-react";

import { Card } from "@/components/ui";

/* Substitui o 404 padrão do Next, que vem com fundo preto (o estilo embutido
   dele reage a prefers-color-scheme) e destoava do tema claro do app. */
export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center py-10">
      <Card className="max-w-md p-8 text-center">
        <div className="mx-auto grid size-12 place-items-center rounded-full bg-brand-500/10">
          <FileQuestion className="size-6 text-brand-400" aria-hidden />
        </div>

        <h1 className="mt-4 text-xl font-semibold tracking-tight text-ink-100">
          Página não encontrada
        </h1>

        <p className="mt-2 text-sm leading-relaxed text-ink-500">
          O endereço não existe ou o plano que você procura não está mais
          disponível.
        </p>

        <Link
          href="/"
          className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-400"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Voltar ao início
        </Link>
      </Card>
    </div>
  );
}
