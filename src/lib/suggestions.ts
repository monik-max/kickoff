/**
 * Sugere Stack e Integrações baseado no escopo do projeto
 * Ideal para iniciantes que não sabem qual ferramenta usar
 */

export function suggestStackFromScope(data: {
  problem?: string;
  needed?: string;
  technologies?: string;
  requireRealtime?: boolean;
  requireScale?: boolean;
  requireOffline?: boolean;
  requirePayments?: boolean;
  requireAI?: boolean;
}): string {
  const suggestions: string[] = [];
  const input = `${data.problem} ${data.needed} ${data.technologies}`.toLowerCase();

  // === FRONTEND ===
  if (input.includes("web") || input.includes("portal") || input.includes("dashboard")) {
    suggestions.push("Next.js 14 ou React");
    suggestions.push("TypeScript");
    suggestions.push("Tailwind CSS");
  }

  // === MOBILE ===
  if (input.includes("app") || input.includes("mobile") || input.includes("ios") || input.includes("android")) {
    suggestions.push("React Native ou Flutter");
  }

  // === BACKEND ===
  if (input.includes("api") || input.includes("backend") || input.includes("servidor")) {
    suggestions.push("Node.js + Express/Fastify");
  }

  // === DATABASE ===
  if (data.requireScale || input.includes("grande") || input.includes("muitos")) {
    suggestions.push("PostgreSQL");
  } else if (input.includes("flexível") || input.includes("documento")) {
    suggestions.push("MongoDB");
  } else {
    suggestions.push("PostgreSQL (recomendado)");
  }

  // === REALTIME ===
  if (data.requireRealtime || input.includes("tempo real") || input.includes("chat") || input.includes("notif")) {
    suggestions.push("Socket.io ou WebSocket");
  }

  // === CACHE ===
  if (data.requireScale || data.requireRealtime) {
    suggestions.push("Redis");
  }

  // === AUTENTICAÇÃO ===
  if (input.includes("usuário") || input.includes("login") || input.includes("auth")) {
    suggestions.push("JWT + OAuth2 ou Firebase Auth");
  }

  // === PAGAMENTOS ===
  if (data.requirePayments || input.includes("pagamento") || input.includes("cobranç")) {
    suggestions.push("Stripe ou Mercado Pago");
  }

  // === IA ===
  if (data.requireAI || input.includes("ia") || input.includes("ai") || input.includes("inteligência")) {
    suggestions.push("Claude API ou Ollama");
  }

  // === DEVOPS ===
  suggestions.push("Docker");
  if (data.requireScale) {
    suggestions.push("Kubernetes");
  }
  suggestions.push("GitHub Actions (CI/CD)");

  // === DEPLOY ===
  if (data.requireScale) {
    suggestions.push("AWS ou Google Cloud");
  } else {
    suggestions.push("Vercel ou Railway (fácil)");
  }

  // Retornar sugestões únicas
  const unique = Array.from(new Set(suggestions));
  return unique.length > 0 ? unique.join(", ") : "React, Node.js, PostgreSQL, Docker, GitHub Actions";
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
  if (input.includes("erp") || input.includes("sap") || input.includes("neon")) {
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
  if (data.requireAI || input.includes("ia") || input.includes("ai") || input.includes("inteligência")) {
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
  if (input.includes("deploy") || input.includes("ci") || input.includes("cd")) {
    suggestions.push({
      name: "CI/CD e Automação",
      description: "Automatize testes, builds e deployments para cada mudança no código",
      examples: "GitHub Actions, GitLab CI, Jenkins, CircleCI"
    });
  }

  // === MONITORAMENTO ===
  if (input.includes("erro") || input.includes("log") || input.includes("monitor") || input.includes("performance")) {
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
