# Decisões técnicas

Registro das decisões de arquitetura já tomadas, com o motivo e o que
justificaria voltar atrás. Decisão sem motivo escrito vira dogma; decisão sem
gatilho de revisão vira dívida.

---

## DT-01 — Next.js com App Router e Server Actions

**Status:** aceita · 05/08/2026

Renderização no servidor com mutações via Server Actions, sem camada de API
própria.

**Por quê:** o produto é essencialmente CRUD sobre um plano, com uma chamada
pesada de IA no servidor. Server Actions eliminam a escrita de endpoints e a
duplicação de validação entre cliente e servidor. O mesmo schema Zod valida o
formulário e o corpo da ação.

**Custo aceito:** acoplamento ao Next. Se um dia houver app mobile nativo, será
preciso expor uma API de verdade.

**Revisar se:** aparecer um segundo consumidor dos dados que não seja o navegador.

---

## DT-02 — Drizzle ORM com PGlite em desenvolvimento e Postgres em produção

**Status:** aceita · 05/08/2026

`DATABASE_URL` ausente → PGlite (Postgres compilado em WASM, arquivo local em
`.pglite/`). Presente → Postgres via `postgres-js`. O mesmo schema Drizzle serve
aos dois, porque o dialeto é o mesmo.

**Por quê:** `npm install && npm run dev` e o projeto sobe. Sem Docker, sem
serviço para instalar, sem SQLite fingindo ser Postgres com diferenças sutis de
tipo que aparecem só em produção.

**Custo aceito:** PGlite é de processo único; não serve para produção.

**Revisar se:** precisarmos de extensão Postgres que o PGlite não tenha
(pesquisa vetorial, por exemplo).

---

## DT-03 — Tabelas criadas por bootstrap em vez de migrações versionadas

**Status:** aceita, com prazo de validade · 05/08/2026

`src/db/index.ts` roda `CREATE TABLE IF NOT EXISTS` na primeira conexão.

**Por quê:** para a v0, o passo de migração é atrito sem benefício — só existe um
ambiente e ele é descartável.

**Custo aceito:** não há caminho de evolução do schema. Adicionar coluna a uma
tabela existente não acontece.

**Revisar quando:** tarefa 5.3, obrigatoriamente antes do M2. `drizzle.config.ts`
já está pronto para `drizzle-kit generate`/`push`. **Esta decisão expira no
primeiro dado real que não puder ser perdido.**

---

## DT-04 — Saída estruturada com schema Zod em vez de texto interpretado

**Status:** aceita · 05/08/2026

O plano vem do Claude por `output_config.format` com o schema de
`src/lib/plan-schema.ts`, e é validado por Zod antes de tocar o banco.

**Por quê:** interpretar Markdown gerado por modelo é frágil e falha de formas
difíceis de detectar. Com schema, ou o plano chega no formato certo, ou não
chega — e o erro é explícito. O mesmo schema documenta o contrato para quem lê o
código e descreve os campos para o modelo, via `.describe()`.

**Custo aceito:** o schema é rígido. Adicionar um campo exige mudar schema,
banco e interface juntos.

---

## DT-05 — Motor heurístico local como degradação graciosa

**Status:** aceita · 05/08/2026

Sem `ANTHROPIC_API_KEY`, ou quando a chamada falha,
`src/lib/heuristic-planner.ts` monta um plano a partir de blocos ativados por
palavras da descrição.

**Por quê:** três motivos. O produto continua funcionando quando a API está fora;
dá para desenvolver e testar toda a interface sem gastar com API; e um novo
integrante clona o repositório e vê o produto funcionando sem pedir credencial a
ninguém.

**Custo aceito, e é um custo real:** cria a ilusão de que o sistema funciona
quando o caminho principal nunca foi exercitado. Foi exatamente o que aconteceu
na v0. Por isso a origem do plano é gravada na coluna `source` e mostrada na
interface — **um plano com `source = 'heuristico'` não é prova de que o Claude
funciona.**

---

## DT-06 — Estimativa de três pontos com agregação PERT

**Status:** aceita · 05/08/2026

Cada tarefa carrega otimista, provável e pessimista. Esperado por tarefa é
`(O + 4M + P) / 6`; o agregado soma esperados, soma **variâncias** (não desvios)
e apresenta a faixa de 85% como esperado + 1,04σ.

**Por quê:** é o único jeito honesto de comunicar prazo. Um número único vira
compromisso sem ninguém dizer qual era a confiança por trás dele.

**Limitação conhecida e assumida:** PERT assume independência entre tarefas.
Tarefas de projeto real são correlacionadas, então o desvio-padrão agregado é
subestimado e a faixa de 85% é um piso. Está escrito em [backlog.md](backlog.md)
e deve ser dito em voz alta quando o número for apresentado.

**Revisar se:** tivermos histórico suficiente de esforço real para calibrar com
dados do time em vez de fórmula.

---

## DT-07 — Interface só em tema escuro

**Status:** aceita · 05/08/2026

**Por quê:** compromisso deliberado de design. Um tema bem feito é melhor que
dois medianos, e é metade do trabalho de estilo e de teste.

**Revisar se:** houver pedido real de pessoa usuária, ou se surgir requisito de
acessibilidade que o tema escuro não atenda.

---

## DT-08 — Política de preservação no replanejamento

**Status:** 🟡 **pendente — decidir antes de codar a tarefa 3.1**

Quando o Claude revisa um plano existente, o que ele pode sobrescrever?

**Proposta a validar:** toda tarefa tocada por uma pessoa (estimativa editada,
estado alterado, título mudado) é imutável para o modelo. Ele pode adicionar
tarefas novas, remover tarefas que ninguém tocou e sugerir mudanças em tarefas
tocadas — nunca aplicá-las sozinho. A comparação visual da tarefa 3.2 existe
para tornar isso auditável antes de confirmar.

Fechar esta decisão é pré-requisito do épico E3. Ver o risco de mesmo tema em
[riscos.md](riscos.md).
