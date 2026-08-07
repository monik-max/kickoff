/**
 * Sugere Stack e Integrações baseado no escopo do projeto
 * Ideal para iniciantes que não sabem qual ferramenta usar
 */

export interface StackItem {
  layer: string;
  description: string;
  options: string;
}

/**
 * Casa palavra inteira, não pedaço de palavra.
 *
 * `includes()` com termos curtos dá falso positivo em português: "ai" casa com
 * "painel", "email" e "mais"; "ia" casa com "diário"; "ci" casa com "precisa";
 * "log" casa com "catálogo". Isso fazia a sugestão de IA/ML aparecer para quem
 * só escreveu "painel web".
 *
 * \p{L} cobre acentuação, então "inteligência" não é cortada no meio.
 */
function hasWord(text: string, ...words: string[]): boolean {
  return words.some((word) =>
    new RegExp(`(^|[^\\p{L}\\p{N}])${word}([^\\p{L}\\p{N}]|$)`, "iu").test(text),
  );
}

export function suggestStackFromScope(data: {
  problem?: string;
  needed?: string;
  technologies?: string;
  requireRealtime?: boolean;
  requireScale?: boolean;
  requireOffline?: boolean;
  requirePayments?: boolean;
  requireAI?: boolean;
}): StackItem[] {
  const items: StackItem[] = [];
  const input = `${data.problem} ${data.needed} ${data.technologies}`.toLowerCase();

  // === FRONTEND ===
  if (input.includes("web") || input.includes("portal") || input.includes("dashboard")) {
    items.push({
      layer: "Frontend",
      description: "Interface e experiência do usuário",
      options: "Next.js 14, React, TypeScript, Tailwind CSS"
    });
  }

  // === MOBILE ===
  if (input.includes("mobile") || input.includes("android") || hasWord(input, "app", "ios")) {
    items.push({
      layer: "Mobile",
      description: "Aplicativo nativo ou multiplataforma",
      options: "React Native, Flutter, Expo"
    });
  }

  // === BACKEND ===
  if (input.includes("api") || input.includes("backend") || input.includes("servidor")) {
    items.push({
      layer: "Backend",
      description: "Servidor e lógica de negócio",
      options: "Node.js + Express, Fastify, NestJS"
    });
  }

  // === DATABASE ===
  if (data.requireScale || input.includes("grande") || input.includes("muitos")) {
    items.push({
      layer: "Banco de Dados",
      description: "Persistência e consultas estruturadas",
      options: "PostgreSQL, MySQL, Amazon RDS"
    });
  } else if (input.includes("flexível") || input.includes("documento")) {
    items.push({
      layer: "Banco de Dados",
      description: "Armazenamento flexível de documentos",
      options: "MongoDB, Firebase, DynamoDB"
    });
  } else {
    items.push({
      layer: "Banco de Dados",
      description: "SQL robusto e confiável (recomendado)",
      options: "PostgreSQL, MySQL, MariaDB"
    });
  }

  // === REALTIME ===
  if (data.requireRealtime || input.includes("tempo real") || input.includes("chat") || input.includes("notif")) {
    items.push({
      layer: "Realtime",
      description: "Comunicação bidirecional em tempo real",
      options: "Socket.io, WebSocket, Pusher, Ably"
    });
  }

  // === CACHE ===
  if (data.requireScale || data.requireRealtime) {
    items.push({
      layer: "Cache",
      description: "Aceleração de dados e sessões",
      options: "Redis, Memcached, ElastiCache"
    });
  }

  // === AUTENTICAÇÃO ===
  if (input.includes("usuário") || input.includes("login") || input.includes("auth")) {
    items.push({
      layer: "Autenticação",
      description: "Segurança e gerencimento de acesso",
      options: "JWT + OAuth2, Firebase Auth, Auth0"
    });
  }

  // === PAGAMENTOS ===
  if (data.requirePayments || input.includes("pagamento") || input.includes("cobranç")) {
    items.push({
      layer: "Pagamentos",
      description: "Processamento de transações seguras",
      options: "Stripe, Mercado Pago, PayPal"
    });
  }

  // === IA ===
  if (data.requireAI || input.includes("inteligência") || hasWord(input, "ia", "ai", "ml")) {
    items.push({
      layer: "IA/ML",
      description: "Inteligência artificial e automação",
      options: "Claude API, OpenAI, TensorFlow"
    });
  }

  // === DEVOPS ===
  items.push({
    layer: "DevOps",
    description: "Containerização e automação",
    options: data.requireScale ? "Docker, Kubernetes, GitHub Actions" : "Docker, GitHub Actions, Jenkins"
  });

  // === DEPLOY ===
  items.push({
    layer: "Deploy",
    description: "Hospedagem e infraestrutura",
    options: data.requireScale ? "AWS, Google Cloud, Azure" : "Vercel, Railway, Render"
  });

  return items.length > 0
    ? items
    : [
        {
          layer: "Frontend",
          description: "Interface do usuário",
          options: "React, Next.js, TypeScript, Tailwind CSS"
        },
        {
          layer: "Backend",
          description: "Servidor e API",
          options: "Node.js + Express, TypeScript"
        },
        {
          layer: "Banco de Dados",
          description: "Persistência de dados",
          options: "PostgreSQL, SQL"
        },
        {
          layer: "DevOps",
          description: "Infraestrutura",
          options: "Docker, GitHub Actions"
        },
        {
          layer: "Deploy",
          description: "Hospedagem",
          options: "Vercel, Railway"
        }
      ];
}

export function suggestIntegrationsFromScope(data: {
  problem?: string;
  needed?: string;
  existing?: string;
  integrations?: string;
  requirePayments?: boolean;
  requireAI?: boolean;
}): { name: string; description: string; examples: string }[] {
  const suggestions: { name: string; description: string; examples: string }[] = [];
  const input = `${data.problem} ${data.needed} ${data.existing} ${data.integrations}`.toLowerCase();

  // === ERP/CRM ===
  if (hasWord(input, "erp", "sap", "neon")) {
    suggestions.push({
      name: "ERP/Sistemas Legados",
      description: "Integre seu sistema antigo com a nova plataforma sem perder dados",
      examples: "Neon, SAP, Totvs, Oracle"
    });
  }
  if (input.includes("crm") || input.includes("salesforce") || input.includes("hubspot")) {
    suggestions.push({
      name: "CRM",
      description: "Gerencie clientes, vendas e relacionamentos de forma centralizada",
      examples: "Salesforce, HubSpot, Pipedrive, Zendesk"
    });
  }

  // === PAGAMENTOS ===
  if (data.requirePayments || input.includes("pagamento") || input.includes("stripe")) {
    suggestions.push({
      name: "Processamento de Pagamentos",
      description: "Processe transações, cartões de crédito e cobranças com segurança",
      examples: "Stripe, Mercado Pago, PayPal, Square"
    });
  }

  // === COMUNICAÇÃO ===
  if (input.includes("slack") || input.includes("whatsapp") || input.includes("email") || input.includes("notif")) {
    suggestions.push({
      name: "Notificações e Chat",
      description: "Envie notificações e integre comunicação em tempo real com o time",
      examples: "Slack, Discord, Twilio, SendGrid"
    });
    suggestions.push({
      name: "Email Marketing",
      description: "Envie emails em massa, automação e rastreamento de campanhas",
      examples: "Mailgun, SendGrid, AWS SES, Klaviyo"
    });
  }

  // === ARMAZENAMENTO ===
  if (input.includes("arquivo") || input.includes("upload") || input.includes("storage") || input.includes("imagem")) {
    suggestions.push({
      name: "Armazenamento em Nuvem",
      description: "Armazene arquivos, imagens e backups de forma segura e escalável",
      examples: "AWS S3, Google Cloud Storage, Azure Blob, Cloudinary"
    });
  }

  // === ANALYTICS ===
  if (input.includes("analítica") || input.includes("métrica") || input.includes("relatório") || input.includes("dashboard")) {
    suggestions.push({
      name: "Analytics e Métricas",
      description: "Acompanhe usuários, comportamento e desempenho em tempo real",
      examples: "Google Analytics, Mixpanel, Amplitude, Plausible"
    });
  }

  // === VIDEO/STREAMING ===
  if (input.includes("vídeo") || input.includes("stream") || input.includes("transmiss")) {
    suggestions.push({
      name: "Processamento de Vídeo",
      description: "Comprima, processe e hospede vídeos com qualidade profissional",
      examples: "Mux, AWS MediaConvert, Cloudinary, Bunny CDN"
    });
  }

  // === IA ===
  if (data.requireAI || input.includes("inteligência") || hasWord(input, "ia", "ai", "ml")) {
    suggestions.push({
      name: "IA e Machine Learning",
      description: "Adicione inteligência artificial, automação e análise preditiva",
      examples: "Claude API, OpenAI, Google AI, AWS SageMaker"
    });
  }

  // === AUTENTICAÇÃO SOCIAL ===
  if (input.includes("login") || input.includes("google") || input.includes("github")) {
    suggestions.push({
      name: "Autenticação e Login Social",
      description: "Permita login com redes sociais e gerencie identidades de forma segura",
      examples: "Auth0, Firebase Auth, Okta, Google OAuth"
    });
  }

  // === GIT/DEVOPS ===
  if (input.includes("deploy") || hasWord(input, "ci", "cd", "ci/cd")) {
    suggestions.push({
      name: "CI/CD e Automação",
      description: "Automatize testes, builds e deployments para cada mudança no código",
      examples: "GitHub Actions, GitLab CI, Jenkins, CircleCI"
    });
  }

  // === MONITORAMENTO ===
  if (input.includes("erro") || input.includes("monitor") || input.includes("performance") || hasWord(input, "log", "logs")) {
    suggestions.push({
      name: "Monitoramento e Logs",
      description: "Acompanhe erros, performance e saúde da aplicação em produção",
      examples: "Sentry, DataDog, New Relic, LogRocket"
    });
  }

  return suggestions.length > 0
    ? suggestions
    : [
        {
          name: "ERP/Sistemas Legados",
          description: "Integre sistemas antigos sem perder dados ou funcionalidades",
          examples: "Neon, SAP, Totvs, Oracle"
        },
        {
          name: "Processamento de Pagamentos",
          description: "Processe transações e cobranças com segurança",
          examples: "Stripe, Mercado Pago, PayPal"
        },
        {
          name: "Notificações",
          description: "Comunique-se com usuários e time em tempo real",
          examples: "Slack, SendGrid, Twilio"
        },
        {
          name: "Analytics",
          description: "Entenda o comportamento dos usuários",
          examples: "Google Analytics, Mixpanel"
        },
        {
          name: "CI/CD",
          description: "Automatize testes e deployments",
          examples: "GitHub Actions, GitLab CI"
        }
      ];
}
