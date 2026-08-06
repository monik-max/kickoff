# Backlog

Estimativas em **horas de trabalho efetivo de uma pessoa**, em três pontos:
O = otimista, M = mais provável, P = pessimista. A coluna PERT é
`(O + 4M + P) / 6`.

Regra que usamos ao estimar: se a pessimista não for pelo menos o dobro da
provável em tarefa com incerteza real, a pessimista está otimista.

---

## E1 — Validar o caminho do Claude 🔴 bloqueante

Sem isto, tudo o mais é construído sobre premissa não verificada.

| # | Tarefa | Papel | Prio | O | M | P | PERT |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: |
| 1.1 | Configurar chave e gerar 5 planos reais de domínios diferentes | produto | alta | 2 | 4 | 8 | 4,3 |
| 1.2 | Escrever a rubrica de avaliação de plano e aplicá-la aos 5 | produto | alta | 6 | 12 | 24 | 13,0 |
| 1.3 | Ajustar o prompt do sistema com base nas falhas observadas | backend | alta | 4 | 10 | 24 | 11,3 |
| 1.4 | Tratar falhas do modelo na interface (recusa, truncamento, timeout) | frontend | alta | 4 | 8 | 16 | 8,7 |

**Total do épico: 37h**

> A rubrica (1.2) é o entregável mais valioso desta frente. Sem ela, "o plano
> ficou bom" é opinião, e não dá para saber se uma mudança de prompt melhorou ou
> piorou. Critérios sugeridos: cobre as frentes esquecidas por padrão? as tarefas
> cabem em menos de uma semana? as pessimistas são realmente pessimistas? os
> riscos são específicos do domínio ou genéricos?

---

## E2 — Contas e multiusuário

| # | Tarefa | Papel | Prio | O | M | P | PERT |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: |
| 2.1 | Escolher e integrar provedor de autenticação | backend | alta | 6 | 12 | 24 | 13,0 |
| 2.2 | Adicionar `owner_id` ao schema e migrar os dados existentes | dados | alta | 4 | 8 | 16 | 8,7 |
| 2.3 | Filtrar todas as consultas por usuário, com teste que prova o isolamento | backend | alta | 4 | 8 | 20 | 9,3 |
| 2.4 | Telas de login, sessão e saída | frontend | alta | 6 | 12 | 20 | 12,3 |
| 2.5 | Espaço de trabalho compartilhado: convidar pessoas para um projeto | backend | media | 12 | 24 | 48 | 26,0 |

**Total do épico: 69h**

> 2.3 é a tarefa que mais assusta e a mais fácil de subestimar. Vazamento de dado
> entre usuários é falha silenciosa: nada quebra, só aparece o dado errado. O
> teste automatizado não é opcional aqui.

---

## E3 — Replanejamento

| # | Tarefa | Papel | Prio | O | M | P | PERT |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: |
| 3.1 | Ação "revisar plano" que envia o estado atual ao Claude | backend | alta | 12 | 24 | 48 | 26,0 |
| 3.2 | Comparação visual entre a versão anterior e a revisada | frontend | alta | 12 | 24 | 40 | 24,7 |
| 3.3 | Histórico de versões do plano, com volta atrás | dados | media | 8 | 16 | 32 | 17,3 |

**Total do épico: 68h**

> 3.1 tem a maior incerteza do backlog. O problema difícil não é chamar a API de
> novo: é decidir o que preservar. Se a pessoa corrigiu 20 estimativas à mão e a
> revisão as descarta, ela nunca mais usa o botão.

---

## E4 — Dependências e caminho crítico

| # | Tarefa | Papel | Prio | O | M | P | PERT |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: |
| 4.1 | Modelar dependências entre tarefas no schema | dados | media | 6 | 12 | 24 | 13,0 |
| 4.2 | Interface para declarar e visualizar dependências | frontend | media | 8 | 16 | 28 | 16,7 |
| 4.3 | Cálculo de caminho crítico e folga por tarefa | backend | media | 12 | 24 | 48 | 26,0 |
| 4.4 | Gráfico de Gantt simples | frontend | baixa | 12 | 24 | 40 | 24,7 |

**Total do épico: 80h**

> 4.1 precisa impedir ciclo de dependência na escrita, não só na leitura. Detectar
> ciclo depois que ele existe no banco é problema muito pior.

---

## E5 — Confiabilidade e operação

| # | Tarefa | Papel | Prio | O | M | P | PERT |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: |
| 5.1 | Geração assíncrona com estado de progresso na tela | backend | alta | 12 | 24 | 40 | 24,7 |
| 5.2 | Testes automatizados do caminho crítico | qa | alta | 12 | 24 | 40 | 24,7 |
| 5.3 | Migrações versionadas e implantação em Postgres gerenciado | devops | alta | 6 | 12 | 24 | 13,0 |
| 5.4 | Observabilidade e custo de API por plano gerado | devops | media | 6 | 12 | 20 | 12,3 |

**Total do épico: 75h**

> 5.1 deixa de ser conforto e vira necessidade em produção: hoje a geração
> acontece dentro da requisição, e plataformas de hospedagem cortam requisição
> longa. Com o Claude em esforço alto, dois minutos é normal.

---

## E6 — Refinamento do produto

| # | Tarefa | Papel | Prio | O | M | P | PERT |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: |
| 6.1 | Edição estrutural: adicionar, remover e reordenar épicos e tarefas | frontend | alta | 12 | 24 | 40 | 24,7 |
| 6.2 | Exportação para CSV e para uma ferramenta de gestão (a definir) | backend | media | 16 | 32 | 64 | 34,7 |
| 6.3 | Modo apresentação para a reunião de abertura do projeto | frontend | baixa | 8 | 16 | 28 | 16,7 |
| 6.4 | Acessibilidade e ajuste fino em telas pequenas | frontend | media | 8 | 16 | 28 | 16,7 |

**Total do épico: 93h**

> 6.2 está com pessimista de 64h de propósito: enquanto não decidirmos o destino
> (Jira? Linear? Azure DevOps?), a incerteza é real. Assim que houver decisão,
> reestime — provavelmente para baixo.

---

## E7 — Execução do plano

Entrou em 05/08/2026, com a decisão de não integrar com Jira ou Linear e
construir a camada de execução aqui dentro. É o épico que transforma o plano em
lugar de trabalho.

| # | Tarefa | Papel | Prio | O | M | P | PERT |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: |
| 7.1 | Quadro por estado com arrastar e soltar | frontend | alta | 16 | 32 | 64 | 34,7 |
| 7.2 | Responsável por tarefa | backend | alta | 6 | 12 | 24 | 13,0 |
| 7.3 | Comentários por tarefa | backend | media | 12 | 24 | 40 | 24,7 |
| 7.4 | Filtros e visão "minhas tarefas" | frontend | alta | 8 | 16 | 28 | 16,7 |
| 7.5 | Aviso de mudança relevante, dentro do app | backend | media | 8 | 16 | 32 | 17,3 |

**Total do épico: 106h**

> 7.1 é a tarefa de maior incerteza do backlog inteiro, com pessimista de 64h.
> Arrastar e soltar acessível — que funcione com teclado e leitor de tela — é
> muito mais trabalho do que a versão que só funciona com mouse. Decida qual das
> duas você quer **antes** de começar, não no meio.
>
> O histórico de alterações não está aqui de propósito: ele já existe como
> tarefa 3.3, no épico de replanejamento. Não duplicar.

---

## Totais

| | Valor |
| --- | ---: |
| Esforço esperado (soma PERT) | **529h** |
| Desvio-padrão agregado | **23h** |
| Esforço com 85% de confiança | **553h** |
| Duração esperada (60h/semana) | **8,8 semanas** |
| Duração com 85% de confiança | **9,2 semanas** |

O épico E7 acrescentou **106h** ao plano — de 422h para 529h, e de 7,4 para 9,2
semanas no percentil 85. Foi uma adição consciente de escopo, não um estouro:
está registrada aqui para que a comparação com a estimativa original continue
possível.

### Uma ressalva honesta sobre esses números

A agregação PERT assume que as tarefas são **independentes** entre si. Não são.
Se a integração com o provedor de autenticação for pior que o esperado, é
provável que o teste de isolamento também seja — a mesma causa afeta as duas. Na
prática isso significa que o desvio-padrão de 20h está **subestimado**, e a faixa
de 85% é um piso, não um teto.

Como usar isso sem se enganar:

- Trate 7,4 semanas como o cenário bom, não como o pior caso.
- O único corretivo que funciona é medir: registre o esforço real de cada tarefa
  concluída e compare com a estimativa. Depois de uns 20 pontos de dados, o
  histórico do time vale mais que qualquer fórmula.
