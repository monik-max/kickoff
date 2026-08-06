# Riscos

Ordenados por impacto × probabilidade, ambos de 1 a 5. Revisar a cada marco
fechado: risco que não se revisita vira decoração.

---

### 🔴 20 — A qualidade do plano gerado não é boa o suficiente para alguém usar

**Impacto 5 · Probabilidade 4**

É o risco existencial do projeto. Nunca rodamos o caminho do Claude de verdade —
todos os planos até hoje vieram da heurística local. Se a saída do modelo for
genérica ("implementar backend", "fazer testes"), a ferramenta não tem razão de
existir, e nenhuma quantidade de interface bonita salva.

**Mitigação:** E1 é o primeiro épico e é bloqueante. A rubrica de avaliação (1.2)
vem antes de qualquer investimento em login ou Gantt. Se a nota não passar do
mínimo, o roadmap para e vira trabalho de prompt e avaliação.

**Sinal de alerta:** planos gerados que a pessoa apaga ou reescreve inteiro.

---

### 🔴 16 — Vazamento de dado entre usuários quando o multiusuário entrar

**Impacto 5 · Probabilidade 3 (com o teste em 2.3: cai para 1)**

Toda consulta hoje é global. Adicionar `owner_id` não protege nada sozinho —
proteção é filtrar em **todas** as consultas, e é fácil esquecer uma. A falha é
silenciosa: nada quebra, só aparece o projeto de outra pessoa.

**Mitigação:** a tarefa 2.3 inclui teste automatizado que cria dois usuários,
cria dado com cada um e prova que nenhuma consulta atravessa a fronteira. Esse
teste roda na integração contínua e é bloqueante para publicar.

**Sinal de alerta:** qualquer consulta nova em `src/db/queries.ts` sem cláusula
de usuário.

---

### 🟠 16 — Virarmos um Jira pior em vez de uma ferramenta mais simples

**Impacto 4 · Probabilidade 4**

Risco novo, criado pela decisão de 05/08/2026 de construir a execução em vez de
integrar. O caminho para o fracasso é conhecido e confortável: cada recurso que
falta parece razoável isoladamente. Falta sprint. Falta campo personalizado.
Falta automação. Dois meses depois temos um Jira com um décimo dos recursos e
nenhuma vantagem — porque a vantagem prometida era **ser mais simples**.

**Mitigação:** o não-escopo em [produto.md](produto.md) lista explicitamente o
que não construímos, e cada item ali é uma linha que só se cruza com discussão
aberta. O critério de saída do M3 não é lista de recursos: é as 3 pessoas
trabalharem uma semana inteira sem abrir outra ferramenta.

**Sinal de alerta:** o primeiro pedido de "só um campinho a mais" aceito sem
discussão.

---

### 🟡 10 — Custo de API por plano inviabiliza o produto pago

**Impacto 5 · Probabilidade 2**

Rodamos Claude Opus 5 com esforço alto e `max_tokens` de 32000, e nunca medimos
o custo real de uma geração. Foi decidido em 05/08/2026 que **não há teto de
orçamento por enquanto** — o que reduz a probabilidade agora, com 3 pessoas em
teste, mas não elimina o problema: se a decisão de vender vier e o custo por
plano for alto demais, o preço não fecha.

**Mitigação:** a tarefa 5.4 mede custo por plano gerado mesmo sem teto definido.
Medir é barato agora; descobrir na negociação de preço é caro. Alavancas se o
número assustar: baixar o esforço para `medium` e comparar qualidade pela
rubrica; cache de prompt no prompt de sistema, que é fixo; limite de gerações.

**Sinal de alerta:** a conversa sobre virar produto começar sem esse número na
mão.

---

### 🟠 12 — Geração dentro da requisição estoura o tempo limite em produção

**Impacto 4 · Probabilidade 3**

Hoje a geração acontece na própria ação do servidor. Localmente não incomoda;
em plataforma de hospedagem, requisição longa é cortada. Com esforço alto, dois
minutos é comum.

**Mitigação:** tarefa 5.1 move a geração para trabalho assíncrono com estado de
progresso, antes do marco M2, que é quando isso vai para produção.

**Sinal de alerta:** primeira publicação em ambiente hospedado.

---

### 🟠 12 — O botão de replanejar descarta o trabalho manual da pessoa

**Impacto 4 · Probabilidade 3**

Se a pessoa corrigiu vinte estimativas à mão e a revisão do plano as substitui,
ela usa o botão uma vez e nunca mais. O recurso mais caro do E3 vira recurso
morto.

**Mitigação:** decidir a política de preservação **antes** de codar a 3.1, e
escrevê-la no [decisoes-tecnicas.md](decisoes-tecnicas.md). Ponto de partida
sugerido: tarefa tocada pela pessoa é imutável; o modelo só pode adicionar,
remover o que não foi tocado e sugerir — nunca sobrescrever edição humana. A
comparação visual (3.2) existe para tornar isso auditável.

---

### 🟡 9 — Time sem a disponibilidade real que o plano assume

**Impacto 3 · Probabilidade 3**

Todo o roadmap assume 2 pessoas × 30h efetivas. Trinta horas efetivas é uma
semana inteira sem reunião longa, sem suporte e sem troca de contexto. É uma
premissa agressiva.

**Mitigação:** confirmar a disponibilidade real antes de comunicar qualquer data
para fora. Se for 20h por pessoa, o M4 vai de 24/09 para meados de outubro — e é
melhor descobrir isso agora do que em setembro.

---

### 🟡 9 — Escopo crescendo por pedidos fora do combinado

**Impacto 3 · Probabilidade 3**

"Já que estamos nisso, dá para colocar um kanban?" O não-escopo da v1 existe
justamente porque cada um desses pedidos é razoável isoladamente.

**Mitigação:** a seção de não-escopo em [produto.md](produto.md) é para ser
citada. Todo pedido novo é tratado como **troca**, não como adição: entra
quando algo de peso equivalente sai, e a data se move de forma explícita.

---

### 🟡 8 — Dependência de um único fornecedor de modelo

**Impacto 4 · Probabilidade 2**

Todo o valor do produto passa pela API da Anthropic. Indisponibilidade, mudança
de preço ou de política afeta a ferramenta inteira.

**Mitigação:** o motor heurístico local já é uma degradação graciosa — o produto
não para, só perde qualidade. A camada de geração já é isolada em
`src/lib/planner.ts` com saída validada por schema, o que torna a troca de modelo
um trabalho contido. Não vale investir mais que isso agora.
