# Produto

## O problema

Planejar um projeto de software é caro e a maioria dos times faz mal. O padrão
que se repete:

- **A quebra do trabalho é rasa.** O plano tem "fazer o backend", não as trinta
  coisas que "fazer o backend" significa. O que não foi escrito não foi estimado.
- **O que sempre é esquecido continua sendo esquecido.** Migração de dados,
  autorização, observabilidade, deploy, treinamento, documentação. Todo projeto
  descobre isso na metade.
- **A estimativa é um número único.** "Seis semanas" vira compromisso, sem
  ninguém dizer se é 6 no melhor caso ou 6 na média.
- **Riscos são genéricos.** "Prazo apertado" não é risco, é reclamação.
- **Premissas ficam na cabeça de quem planejou.** Quando a premissa cai, o plano
  cai junto e ninguém sabe por quê.

Ferramentas de gestão (Jira, Trello, Linear) executam bem um plano que já
existe. Nenhuma delas ajuda a **produzir** o plano.

E há um segundo problema, que só aparece depois: mesmo quem planeja bem acaba
**traduzindo o plano à mão** para a ferramenta onde o trabalho realmente
acontece. Nessa tradução o plano perde as estimativas de três pontos, perde as
premissas, perde os riscos — e vira uma lista de tarefas sem memória de por que
foram criadas. Duas semanas depois, ninguém sabe mais qual era o plano.

## Para quem

| Pessoa | O que ela quer | Como o Kickoff entrega |
| --- | --- | --- |
| **Dev tech lead** | Não descobrir na semana 8 que faltou migração de dados | Quebra do trabalho que inclui as frentes que se esquece por padrão |
| **Gerente de projetos** | Um prazo que possa defender e explicar | Faixa de confiança com o cálculo à vista, não número mágico |
| **Pessoa que patrocina o projeto** | Saber o que está sendo assumido | Premissas e perguntas em aberto explícitas no documento |

## Proposta de valor

> Você descreve o projeto em texto livre. Em menos de dois minutos tem um plano
> de execução completo — e continua sendo dono dele, porque tudo é editável.

Quatro coisas nos diferenciam:

1. **A saída é estruturada e viva.** Não é texto: são objetos que você edita, e
   editar uma estimativa recalcula o prazo do projeto inteiro na hora.
2. **A estimativa é honesta por construção.** Três pontos por tarefa, agregação
   PERT, faixa de 85%. A ferramenta torna difícil produzir um prazo otimista.
3. **O que não se sabe fica visível.** Premissas e perguntas em aberto são
   seções de primeira classe, não um parágrafo no fim.
4. **Planejar e executar no mesmo lugar.** O plano não é exportado para outra
   ferramenta: ele *vira* o quadro de execução, sem perder as estimativas, as
   premissas e os riscos que o originaram.

### A aposta por trás do item 4

Decidido em 05/08/2026: **não vamos integrar com Jira, Linear ou Azure DevOps.**
Vamos construir a camada de execução, inspirada nelas, mas menos burocrática.

O argumento a favor: a tradução manual do plano para a ferramenta de execução é
onde o plano morre. Se o quadro de execução é o próprio plano, cada tarefa
concluída atualiza o prazo automaticamente, e o replanejamento passa a ter dados
reais em vez de suposição.

O argumento contra, que precisa ser dito: **Jira e Linear têm anos de trabalho
acumulado.** Não vamos empatar com eles em recursos, e não devemos tentar. A
única forma de isso dar certo é sendo deliberadamente mais simples — ver a
seção de não-escopo abaixo, que é o que impede a gente de virar um Jira pior.

## Escopo da v1

Dentro:

- Geração de plano a partir de descrição livre, com Claude, com qualidade
  comprovada por avaliação (hoje só temos a heurística testada).
- Contas de usuário e isolamento de dados entre pessoas.
- Espaço de trabalho compartilhado: mais de uma pessoa vê o mesmo projeto.
- Edição completa do plano gerado: tarefas, estimativas, estado, capacidade.
- **Execução do plano:** quadro por estado com arrastar e soltar, responsável
  por tarefa, comentários e a visão "o que é meu agora".
- Exportação em Markdown.
- Rodar em Postgres gerenciado, com migrações versionadas e monitoramento.

## Não-escopo da v1

Escrito para ser citado quando alguém pedir. Cada item aqui é uma decisão, não
um esquecimento. **Agora que vamos ter execução própria, esta lista é o que nos
impede de virar um Jira pior** — trate cada item como uma linha que não se
cruza sem discussão explícita:

- **Sprints, story points e cerimônia de método.** O quadro é por estado da
  tarefa, não por iteração. Sem planning poker, sem velocity, sem burndown.
- **Campos personalizados e fluxos configuráveis.** É exatamente isso que torna
  o Jira burocrático. Os estados são três — pendente, fazendo, feito — e não
  são configuráveis.
- **Hierarquia organizacional.** Sem times dentro de times, sem projeto dentro
  de portfólio, sem permissão por campo.
- **Apontamento de horas.** Estimamos esforço; não controlamos ponto.
- **Automações e regras.** "Quando mover para X, faça Y" é a porta de entrada
  da complexidade infinita.
- **Sincronização com ferramenta de gestão externa.** Decidido: construímos a
  nossa. Exportar em Markdown continua; sincronizar dos dois lados, não.
- **Cobrança e planos pagos.** Entra quando a decisão de vender for tomada.
- **App mobile nativo.** A tela funciona em celular; app nativo não.
- **Dependências entre tarefas e caminho crítico.** Reconhecemos que falta —
  está no roadmap, depois da execução. Ver [roadmap.md](roadmap.md).
- **Colaboração em tempo real** no estilo edição simultânea.

## Como saberemos que deu certo

Métricas para medir a partir do marco M2. Nenhuma delas é "número de planos
gerados" — gerar é fácil, o que importa é o plano ser usado.

| Métrica | Alvo | Por quê |
| --- | --- | --- |
| Planos gerados que continuam sendo editados 7 dias depois | > 50% | Plano que ninguém volta a abrir foi entretenimento |
| Tarefas editadas ou adicionadas por plano | mediana ≥ 5 | Mede se a pessoa se apropriou do plano |
| Tempo da descrição ao plano aprovado | < 30 min | Compara com o dia de reunião que isso custa hoje |
| Custo de API por plano gerado | < US$ 1,00 | Define se o modelo é sustentável |
| Erro de estimativa em projeto concluído | dentro da faixa de 85% em ≥ 4 de 5 projetos | A prova real. Só medível daqui a meses |

A última é a que importa de verdade e é a mais lenta de obter. Comece a
registrar o esforço real desde o primeiro projeto planejado com a ferramenta,
mesmo que a análise só venha muito depois.
