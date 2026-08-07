import type { Plan, PlanInput, PlanTask } from "./plan-schema";

/**
 * Motor de planejamento local. É o que roda quando não há ANTHROPIC_API_KEY
 * (ou quando a chamada ao Claude falha): detecta capacidades citadas na descrição
 * e monta um plano a partir de blocos conhecidos. Não substitui o planejamento
 * com IA — serve para o app funcionar de ponta a ponta e para comparação.
 */

type Block = {
  /** Termos que ativam este bloco na descrição do projeto */
  triggers: RegExp;
  title: string;
  summary: string;
  /**
   * Por que a frente existe e o que custa deixá-la para depois. É a camada de
   * ensino do plano: o resumo diz o que fazer, isto diz por quê — o tipo de
   * coisa que normalmente só se aprende errando.
   */
  rationale: string;
  tasks: PlanTask[];
  risks?: Plan["risks"];
};

const t = (
  title: string,
  description: string,
  role: PlanTask["role"],
  priority: PlanTask["priority"],
  o: number,
  m: number,
  p: number,
): PlanTask => ({
  title,
  description,
  role,
  priority,
  optimisticHours: o,
  likelyHours: m,
  pessimisticHours: p,
});

const OPTIONAL_BLOCKS: Block[] = [
  {
    triggers: /login|autentica|usuári|conta|cadastro|permiss|perfil|acesso/i,
    title: "Contas e permissões",
    summary: "Cadastro, login e controle de acesso por papel.",
    rationale: "Quem pode ver o quê muda o desenho da interface, não só do backend. Descobrir a regra de permissão depois das telas prontas obriga a refazer navegação inteira.",
    tasks: [
      t("Modelar usuários, papéis e permissões", "Definir as entidades e a matriz de permissão por papel antes de escrever qualquer tela.", "backend", "alta", 4, 8, 16),
      t("Implementar cadastro e login", "Fluxo de e-mail e senha com hash, sessão e recuperação de senha.", "backend", "alta", 8, 16, 32),
      t("Telas de autenticação", "Login, cadastro, recuperação de senha e estados de erro.", "frontend", "alta", 6, 12, 20),
      t("Middleware de autorização", "Bloquear rotas e ações por papel, no servidor — não só na UI.", "backend", "alta", 4, 8, 16),
    ],
    risks: [
      {
        title: "Regras de permissão descobertas tarde, já com telas prontas",
        mitigation: "Fechar a matriz de papéis × ações na primeira semana e validar com quem opera o sistema hoje.",
        impact: 4,
        probability: 3,
      },
    ],
  },
  {
    // "assinatura" sozinho não entra: quase sempre é assinatura digital, não plano pago.
    triggers:
      /pagamento|cobran|checkout|financeiro|fatura|billing|pix|cart(ão|ao) de cr[eé]dito|assinatura de plano|plano de assinatura|recorr[eê]nc/i,
    title: "Pagamentos e cobrança",
    summary: "Integração com gateway, ciclo de cobrança e conciliação.",
    rationale: "Dinheiro é a única parte do sistema em que um bug vira prejuízo direto e ligação de cliente. Conciliação entre o que o gateway registrou e o que seu banco acha que aconteceu precisa existir desde o primeiro dia.",
    tasks: [
      t("Escolher gateway e mapear os fluxos de dinheiro", "Comparar taxas, meios de pagamento e suporte a estorno. Documentar cada estado possível de uma cobrança.", "produto", "alta", 6, 12, 24),
      t("Integrar checkout", "Fluxo de pagamento fim a fim no ambiente de sandbox.", "backend", "alta", 12, 24, 48),
      t("Tratar webhooks do gateway", "Confirmação, falha, estorno e chargeback — com idempotência.", "backend", "alta", 8, 16, 40),
      t("Tela de faturas e histórico", "O usuário precisa ver o que pagou e baixar comprovante.", "frontend", "media", 6, 12, 20),
      t("Conciliação e relatório financeiro", "Bater o que o gateway diz com o que o sistema registrou.", "dados", "media", 8, 16, 32),
    ],
    risks: [
      {
        title: "Divergência entre o estado da cobrança no gateway e no banco de dados",
        mitigation: "Tratar webhooks como fonte da verdade, com idempotência e uma rotina diária de conciliação.",
        impact: 5,
        probability: 3,
      },
    ],
  },
  {
    triggers: /integra|api externa|erp|crm|webhook|sincroniz|importa|planilha|legado/i,
    title: "Integrações e migração de dados",
    summary: "Conectar com os sistemas que já existem e trazer os dados atuais.",
    rationale: "Dado legado quase sempre está mais sujo do que parece: campo vazio, duplicado, formato trocado. Descobrir isso na véspera do lançamento trava a entrega, porque limpar dado não se acelera com mais gente.",
    tasks: [
      t("Levantar contratos das APIs externas", "Documentação, limites de taxa, autenticação e ambiente de teste de cada sistema.", "backend", "alta", 6, 12, 24),
      t("Camada de integração com retry e fila", "Chamadas externas falham. Isolar em uma camada com retry, timeout e dead-letter.", "backend", "alta", 12, 24, 48),
      t("Script de migração dos dados atuais", "Extrair, limpar e carregar. Rodar em ensaio antes do real.", "dados", "alta", 12, 24, 60),
      t("Reconciliação pós-migração", "Comparar contagens e amostras entre origem e destino.", "dados", "alta", 4, 8, 16),
    ],
    risks: [
      {
        title: "Dados legados mais sujos do que o esperado",
        mitigation: "Rodar um perfilamento dos dados reais na primeira semana, não na semana da migração.",
        impact: 4,
        probability: 4,
      },
    ],
  },
  {
    triggers: /dashboard|relatóri|métric|indicador|gráfico|bi|analytics|painel/i,
    title: "Relatórios e indicadores",
    summary: "Consultas, agregações e visualizações para decisão.",
    rationale: "Relatório é o que o gestor usa para justificar o projeto ter existido. Se depender de consulta pesada sobre a base de produção, ele nasce lento e vai piorando conforme os dados crescem.",
    tasks: [
      t("Definir os indicadores que importam", "Cada gráfico precisa responder a uma pergunta de negócio específica.", "produto", "alta", 4, 8, 16),
      t("Modelar as consultas agregadas", "Agregações no banco, com índices adequados ao volume esperado.", "dados", "alta", 8, 16, 32),
      t("Construir o painel", "Gráficos, filtros e estados de carregamento e vazio.", "frontend", "media", 12, 24, 40),
      t("Exportação para CSV e PDF", "Todo relatório acaba precisando sair do sistema.", "frontend", "baixa", 4, 8, 16),
    ],
  },
  {
    triggers: /ia|inteligência artificial|llm|gpt|claude|machine learning|modelo|embedding|rag/i,
    title: "Camada de IA",
    summary: "Integração com modelo, avaliação de qualidade e controle de custo.",
    rationale: "Modelo de IA não dá resposta previsível como uma função comum: a mesma entrada pode variar. Sem medir qualidade e custo por requisição desde cedo, você só descobre que ficou caro ou ruim quando já está em produção.",
    tasks: [
      t("Prototipar os prompts com casos reais", "Antes de escrever produto, validar que o modelo resolve o problema em 10 casos reais.", "produto", "alta", 8, 16, 32),
      t("Integrar o modelo com saída estruturada", "Schema de saída, validação e tratamento de resposta inválida.", "backend", "alta", 8, 16, 32),
      t("Conjunto de avaliação", "Casos de teste com resposta esperada, para saber se uma mudança de prompt piorou algo.", "qa", "alta", 8, 16, 32),
      t("Controle de custo e limites de uso", "Cache, limite por usuário e monitoramento de gasto por requisição.", "backend", "media", 6, 12, 24),
      t("Fallback quando o modelo falha", "O produto não pode parar quando a API está fora ou recusa a requisição.", "backend", "media", 4, 8, 16),
    ],
    risks: [
      {
        title: "Qualidade da saída do modelo abaixo do aceitável para o usuário final",
        mitigation: "Montar o conjunto de avaliação antes de construir a interface e definir o critério mínimo de aceitação.",
        impact: 4,
        probability: 3,
      },
      {
        title: "Custo por requisição inviabilizando o modelo de negócio",
        mitigation: "Medir o custo real por operação em protótipo e projetar para o volume esperado antes de escalar.",
        impact: 4,
        probability: 3,
      },
    ],
  },
  {
    triggers: /mobile|app|android|ios|celular|offline|pwa/i,
    title: "Experiência mobile",
    summary: "Uso em tela pequena, com rede instável.",
    rationale: "Mobile não é a mesma tela menor: é rede que cai, bateria acabando e uso com uma mão só, em movimento. Adaptar no fim significa refazer fluxo, não ajustar CSS.",
    tasks: [
      t("Definir a estratégia mobile", "App nativo, híbrido ou PWA — decidir com base em uso offline, notificação e acesso a hardware.", "produto", "alta", 4, 8, 16),
      t("Adaptar a interface para tela pequena", "Não é encolher o desktop: revisar navegação, toque e densidade.", "frontend", "alta", 12, 24, 40),
      t("Comportamento offline e sincronização", "O que funciona sem rede e como os dados voltam a convergir.", "frontend", "media", 12, 24, 60),
      t("Testes em dispositivos reais", "Emulador não pega problema de rede, bateria e teclado.", "qa", "media", 6, 12, 20),
    ],
  },
  {
    triggers: /notifica|e-?mail|alerta|mensagem|whatsapp|sms|push/i,
    title: "Notificações",
    summary: "Avisar a pessoa certa, no canal certo, sem virar spam.",
    rationale: "Notificação mal calibrada é desinstalada ou silenciada, e aí você perde também as importantes. A regra de quem recebe o quê e com que frequência é decisão de produto, não detalhe técnico.",
    tasks: [
      t("Mapear eventos que geram notificação", "Quem recebe o quê, em qual canal e com qual urgência.", "produto", "media", 3, 6, 12),
      t("Serviço de envio com fila", "Envio assíncrono, retry e registro de entrega.", "backend", "media", 8, 16, 32),
      t("Preferências de notificação por usuário", "Descadastro por canal — requisito legal e de sanidade.", "frontend", "baixa", 4, 8, 16),
    ],
  },
];

function baseBlocks(input: PlanInput): Block[] {
  return [
    {
      triggers: /.^/,
      title: "Descoberta e alinhamento",
      summary: "Fechar escopo, critérios de aceite e o que fica de fora.",
      rationale: "Escopo que não foi escrito volta como discussão no meio da execução, quando mudar já custa caro. Registrar o que fica de fora evita mais retrabalho do que listar o que fica dentro.",
      tasks: [
        t("Entrevistar quem vai usar o sistema", "Três a cinco conversas com usuários reais. O que dói hoje e como resolvem no improviso.", "produto", "alta", 6, 12, 20),
        t("Escrever os critérios de aceite do MVP", "Lista verificável do que precisa funcionar para o projeto ser considerado entregue.", "produto", "alta", 4, 8, 16),
        t("Definir explicitamente o que fica fora", "A lista de não-escopo evita mais atraso do que qualquer estimativa.", "produto", "alta", 2, 4, 8),
        t("Desenhar os fluxos principais", "Protótipo navegável dos 3 fluxos mais usados, validado com usuário antes de codar.", "design", "alta", 8, 16, 32),
      ],
    },
    {
      triggers: /.^/,
      title: "Fundação técnica",
      summary: "Repositório, ambientes e o caminho até produção — antes da primeira feature.",
      rationale: "Deploy deixado para o fim é o erro mais caro do projeto. Quando o ambiente falha, já existem features prontas paradas esperando, e você conserta infraestrutura sob pressão de prazo.",
      tasks: [
        t("Configurar repositório e padrões de código", "Lint, formatação, convenção de commit e revisão obrigatória.", "devops", "alta", 3, 6, 12),
        t("Modelar o banco de dados", "Entidades, relacionamentos e migrações versionadas.", "backend", "alta", 6, 12, 24),
        t("Esqueleto da aplicação rodando", `Projeto ${input.stack ? `em ${input.stack} ` : ""}subindo local e em ambiente de teste, com uma rota real.`, "backend", "alta", 6, 12, 24),
        t("Pipeline de CI/CD", "Build, teste e deploy automáticos. Fazer isso na semana 1 economiza meses.", "devops", "alta", 8, 16, 32),
        t("Observabilidade mínima", "Logs estruturados, monitoramento de erro e alerta básico.", "devops", "media", 4, 8, 16),
      ],
    },
    {
      triggers: /.^/,
      title: "Núcleo do produto",
      summary: "As funcionalidades que justificam o projeto existir.",
      rationale: "É a única frente que o usuário percebe diretamente. Vem depois da fundação de propósito: construir sobre base instável significa refazer isto mais tarde.",
      tasks: [
        t("Implementar o fluxo principal de ponta a ponta", "Uma fatia vertical completa: interface, servidor e banco funcionando juntos.", "backend", "alta", 16, 32, 64),
        t("Construir as telas do fluxo principal", "Incluindo estados de carregamento, erro e lista vazia.", "frontend", "alta", 16, 32, 56),
        t("Cadastros e listagens de apoio", "As telas de CRUD que sustentam o fluxo principal.", "frontend", "media", 12, 24, 40),
        t("Validação de dados no servidor", "Nunca confiar na validação da interface.", "backend", "alta", 6, 12, 20),
        t("Busca e filtros", "Como a pessoa encontra o que precisa quando houver 10 mil registros.", "backend", "media", 8, 16, 28),
      ],
    },
    {
      triggers: /.^/,
      title: "Qualidade e endurecimento",
      summary: "Testes, desempenho e segurança antes de abrir para usuários.",
      rationale: "Bug encontrado em produção custa muito mais do que em teste, porque envolve usuário real, dado real e correção às pressas. Segurança tratada no fim vira remendo em cima de decisão já tomada.",
      tasks: [
        t("Testes automatizados do caminho crítico", "Cobrir os fluxos que, se quebrarem, param o negócio.", "qa", "alta", 12, 24, 40),
        t("Teste de carga no volume esperado", "Descobrir o limite antes que o usuário descubra.", "qa", "media", 6, 12, 24),
        t("Revisão de segurança", "Injeção, autorização quebrada, dados sensíveis em log e dependências vulneráveis.", "backend", "alta", 6, 12, 24),
        t("Rodada de correção de bugs", "Reservar tempo para isso é planejamento; não reservar é otimismo.", "backend", "alta", 12, 24, 48),
      ],
    },
    {
      triggers: /.^/,
      title: "Lançamento e transferência",
      summary: "Colocar em produção e deixar o time operando sem depender de quem construiu.",
      rationale: "Projeto que só funciona com quem o escreveu por perto não terminou. Documentação e handover são o que separa entrega de dependência permanente.",
      tasks: [
        t("Preparar ambiente de produção", "Infraestrutura, backup, restauração testada e plano de retorno.", "devops", "alta", 6, 12, 24),
        t("Lançamento controlado", "Grupo pequeno de usuários primeiro, com acompanhamento de perto.", "produto", "alta", 4, 8, 16),
        t("Documentação de operação", "Como subir, como reverter, o que fazer quando cair.", "devops", "media", 4, 8, 16),
        t("Treinamento dos usuários", "Sessão prática e material de consulta.", "produto", "media", 4, 8, 16),
      ],
    },
  ];
}

const BASE_RISKS: Plan["risks"] = [
  {
    title: "Escopo crescendo durante a execução por pedidos fora do combinado",
    mitigation: "Manter a lista de não-escopo visível e tratar todo pedido novo como troca, não como adição.",
    impact: 4,
    probability: 4,
  },
  {
    title: "Time sem disponibilidade real de dedicação prevista no plano",
    mitigation: "Confirmar a carga semanal efetiva de cada pessoa e replanejar a capacidade antes de assumir o prazo.",
    impact: 4,
    probability: 3,
  },
  {
    title: "Decisões travadas por falta de um responsável único pelo produto",
    mitigation: "Nomear uma pessoa com autoridade para decidir e um prazo máximo de resposta para dúvidas de escopo.",
    impact: 3,
    probability: 3,
  },
];

export function buildHeuristicPlan(input: PlanInput): Plan {
  const haystack = `${input.name} ${input.description} ${input.stack ?? ""}`;
  const matched = OPTIONAL_BLOCKS.filter((b) => b.triggers.test(haystack));

  const base = baseBlocks(input);
  // Blocos opcionais entram depois da fundação e antes de qualidade.
  const ordered = [...base.slice(0, 3), ...matched, ...base.slice(3)];

  const epics = ordered.map((block) => ({
    title: block.title,
    summary: block.summary,
    rationale: block.rationale,
    tasks: block.tasks,
  }));

  const risks = [...matched.flatMap((b) => b.risks ?? []), ...BASE_RISKS].slice(0, 6);

  const totalHours = epics
    .flatMap((e) => e.tasks)
    .reduce((sum, task) => sum + (task.optimisticHours + 4 * task.likelyHours + task.pessimisticHours) / 6, 0);
  const capacity = Math.max(1, input.teamSize * input.weeklyHours);
  const weeks = Math.max(2, Math.ceil(totalHours / capacity));

  const at = (fraction: number) => Math.max(1, Math.round(weeks * fraction));

  const milestones = [
    {
      title: "Escopo fechado e protótipo validado",
      description: "Critérios de aceite escritos, não-escopo definido e fluxos principais validados com usuário real.",
      week: at(0.15),
    },
    {
      title: "Esqueleto em produção",
      description: "Aplicação sobe sozinha pelo pipeline, com uma rota real funcionando e monitoramento ligado.",
      week: at(0.3),
    },
    {
      title: "Fluxo principal completo",
      description: "É possível executar de ponta a ponta a operação que justifica o projeto.",
      week: at(0.65),
    },
    {
      title: "Versão candidata a lançamento",
      description: "Testes do caminho crítico passando, revisão de segurança feita e bugs bloqueantes resolvidos.",
      week: at(0.88),
    },
    {
      title: "Em produção com usuários reais",
      description: "Lançamento controlado feito, documentação de operação entregue e time treinado.",
      week: weeks,
    },
  ];

  const openQuestions: Plan["openQuestions"] = [
    {
      text: `Assumimos ${input.teamSize} pessoa(s) com ${input.weeklyHours}h semanais efetivas — sem contar reuniões, suporte e férias.`,
      kind: "premissa",
    },
    {
      text: "Assumimos que não há requisito regulatório específico (LGPD além do básico, auditoria, certificação).",
      kind: "premissa",
    },
    {
      text: "Qual o volume esperado de usuários e de dados no primeiro ano? Isso muda decisões de arquitetura.",
      kind: "pergunta",
    },
    {
      text: "Existe sistema legado a substituir? Se sim, os dois vão conviver por quanto tempo?",
      kind: "pergunta",
    },
    {
      text: "Quem é a pessoa com autoridade para decidir escopo quando houver conflito?",
      kind: "pergunta",
    },
  ];

  const summary = `${input.name}: ${input.description.trim().slice(0, 240)}${input.description.length > 240 ? "…" : ""} O plano abaixo cobre ${epics.length} frentes de trabalho, da descoberta ao lançamento com usuários reais, dimensionado para ${input.teamSize} pessoa(s) a ${input.weeklyHours}h semanais. As estimativas usam três pontos (otimista, provável, pessimista) para que o prazo seja expresso como faixa de confiança, não como número único.`;

  return { summary, epics, risks, milestones, openQuestions };
}
