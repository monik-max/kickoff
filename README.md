# Kickoff

Ferramenta de planejamento de projetos de software para programadores e gerentes
de projeto. Você descreve o projeto em texto livre; o Kickoff devolve um plano de
execução completo — épicos, tarefas com estimativa de três pontos, riscos com
mitigação, marcos e uma faixa de prazo calculada a partir da capacidade real do
time. Tudo editável depois.

## Como rodar

```bash
npm install
npm run dev
```

Abre em http://localhost:3000. **Não precisa de banco de dados nem de Docker** —
o app sobe um Postgres real em WASM (PGlite) num arquivo local em `.pglite/`.

Para usar o Claude no planejamento (recomendado), copie `.env.example` para
`.env.local` e preencha a chave:

```
ANTHROPIC_API_KEY=sk-ant-...
```

Sem a chave o app continua funcionando: o plano vem de um motor heurístico local
que detecta capacidades citadas na descrição (autenticação, pagamentos,
integrações, IA, mobile, relatórios, notificações) e monta o plano a partir de
blocos conhecidos. É útil para comparação, mas não substitui o planejamento com
IA — o Claude entende o domínio específico do seu projeto, a heurística não.

## O que ele faz

- **Planejamento com Claude Opus 5** — saída estruturada validada por schema Zod,
  então o plano sempre chega no formato certo ou não chega.
- **Estimativa em três pontos (PERT)** — cada tarefa tem valor otimista, provável
  e pessimista. O prazo agregado é uma faixa de confiança de 85%, não um número
  único. Editar qualquer estimativa recalcula tudo na hora.
- **Capacidade real** — mude o tamanho do time ou as horas semanais e o prazo se
  ajusta. Tarefas concluídas saem da conta.
- **Riscos ordenados por impacto × probabilidade**, cada um com mitigação.
- **Marcos com data projetada** a partir de hoje.
- **Premissas e perguntas em aberto** — o que a IA assumiu por falta de
  informação e o que só um humano pode responder.
- **Exportação em Markdown** para colar em wiki, PR ou ticket.

## Stack

| Camada | Escolha | Por quê |
| --- | --- | --- |
| Framework | Next.js 16 (App Router, Server Actions) | Renderização no servidor e mutações sem escrever endpoints |
| Linguagem | TypeScript 5 | — |
| Estilo | Tailwind CSS 4 | — |
| Banco | Drizzle ORM + PGlite (dev) / Postgres (prod) | O mesmo dialeto nos dois: trocar de ambiente é definir `DATABASE_URL` |
| IA | `@anthropic-ai/sdk` + Claude Opus 5 | Saída estruturada com `output_config.format` e schema Zod |
| Validação | Zod 4 | Mesmo schema valida o formulário e a resposta do modelo |

## Comandos

```bash
npm run dev
```

```bash
npm run build
```

```bash
npm run lint
```

```bash
npx tsc --noEmit
```

## Produção

Defina `DATABASE_URL` apontando para um Postgres (Neon, Supabase, RDS) e aplique
o schema:

```bash
npx drizzle-kit push
```

O código detecta a variável e troca o driver sozinho — o schema Drizzle é o mesmo
nos dois caminhos.

## Documentação de planejamento

O planejamento do próprio Kickoff está em [`docs/`](docs/README.md): produto,
roadmap com marcos e datas, backlog estimado, riscos, decisões técnicas e
processo de trabalho. Comece pelo [índice](docs/README.md) — ele lista as
premissas que sustentam todas as datas.

## O que ainda não tem

- **Autenticação e multiusuário.** Todo mundo que abre o app vê todos os
  projetos. As tabelas não têm coluna de dono ainda; é a primeira coisa a fazer
  antes de colocar isso em um servidor compartilhado.
- **Replanejamento.** Dá para editar tarefas e estimativas, mas não para pedir ao
  Claude que revise o plano com base no que mudou.
- **Dependências entre tarefas.** As estimativas somam esforço, não montam um
  caminho crítico.
