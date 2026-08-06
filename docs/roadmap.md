# Roadmap

Base de cálculo: **2 pessoas × 30h/semana = 60h por semana**. Início em
06/08/2026. Os números vêm do [backlog.md](backlog.md); se o backlog mudar,
recalcule aqui.

## Marcos

| Marco | Entrega | Esforço | Acumulado | Data projetada |
| --- | --- | ---: | ---: | --- |
| **M0** | v0 funcionando ponta a ponta | — | — | ✅ 05/08/2026 |
| **M1** | Qualidade do plano com Claude comprovada | 37h | 37h | 11/08/2026 |
| **M2** | Multiusuário em produção | 144h | 181h | 27/08/2026 |
| **M3** | Execução do plano | 106h | 287h | 09/09/2026 |
| **M4** | Ciclo de replanejamento e refinamento | 161h | 449h | 27/09/2026 |
| **M5** | Dependências e caminho crítico | 80h | 529h | 07/10/2026 |

Com a faixa de 85% de confiança, M5 cai em **09/10/2026**. É esse o número a
levar para fora do time — não o de 07/10.

> **Mudança de 05/08/2026.** A decisão de construir a execução em vez de
> integrar com Jira ou Linear acrescentou o marco M3 e empurrou os antigos M3 e
> M4 para M4 e M5. O plano foi de 7,4 para 9,2 semanas no percentil 85. Adição
> consciente de escopo, registrada para manter a comparação honesta.

### M1 — Qualidade do plano comprovada

**Critério de saída:** cinco projetos reais de domínios diferentes planejados
com o Claude, avaliados por uma rubrica escrita, com nota média acima do mínimo
que definirmos. Falhas do modelo (recusa, truncamento, tempo esgotado) tratadas
na interface com mensagem útil.

Este marco é **bloqueante**. Enquanto ele não fechar, todo o resto está sendo
construído em cima de uma premissa não verificada: a de que o Claude produz
planos bons o bastante para alguém usar. Se a qualidade não passar, o
investimento certo é prompt e avaliação, não login e Gantt.

### M2 — Multiusuário em produção

**Critério de saída:** duas pessoas distintas usam a ferramenta em produção, com
dados isolados, rodando em Postgres gerenciado, com migrações versionadas e
alerta de erro configurado. Nenhuma consulta retorna dado de outro usuário — e
isso está coberto por teste automatizado.

Este é o marco que transforma um projeto local em ferramenta de time.

### M3 — Execução do plano

**Critério de saída:** as 3 pessoas do teste conseguem trabalhar dentro do
Kickoff por uma semana inteira sem abrir outra ferramenta. Quadro por estado
com arrastar e soltar, responsável por tarefa, comentários, filtros e a visão
"o que é meu agora". Tarefa concluída no quadro atualiza o prazo do projeto
sozinha.

O teste real deste marco não é a lista de recursos: é **uma semana de uso sem
recair no WhatsApp e na planilha**. Se isso não acontecer, o problema é de
fluxo, não de recurso faltando — e adicionar recurso vai piorar.

### M4 — Ciclo de replanejamento e refinamento

**Critério de saída:** dá para pedir ao Claude que revise o plano a partir do
estado atual (tarefas concluídas, estimativas corrigidas, escopo mudado), ver o
que mudou entre as versões e voltar atrás. Edição estrutural completa: adicionar,
remover e reordenar épicos e tarefas.

É aqui que a ferramenta deixa de ser "gerador de plano" e vira "companheira de
projeto". Um plano só é útil enquanto acompanha a realidade.

### M5 — Dependências e caminho crítico

**Critério de saída:** dependências declaráveis entre tarefas, caminho crítico
calculado e um Gantt simples. O prazo passa a considerar sequenciamento, não
apenas soma de esforço dividida por capacidade.

Deliberadamente por último. Somar esforço já entrega a maior parte do valor;
caminho crítico é refinamento que só compensa depois que as três primeiras
frentes estiverem de pé.

## O que ficou fora deste roadmap

- Integração ou sincronização com Jira, Linear ou Azure DevOps. **Decidido em
  05/08/2026:** construímos a nossa camada de execução (M3).
- Cobrança e planos pagos — entram quando a decisão de vender for tomada.
- App nativo.
- Colaboração em tempo real.
- Sprints, campos personalizados, automações e apontamento de horas. Ver o
  não-escopo em [produto.md](produto.md): é o que nos impede de virar um Jira
  pior.

## Como este roadmap deve envelhecer

Revisar a cada marco fechado, com três perguntas:

1. As premissas do [README](README.md) continuam verdadeiras?
2. O esforço real do marco que acabou bateu com a estimativa? Se errou por mais
   de 30%, ajuste os marcos seguintes na mesma proporção antes de prometer data.
3. Alguma pergunta em aberto foi respondida de um jeito que muda a ordem?

Datas projetadas não são compromisso enquanto o marco anterior não fechou.
