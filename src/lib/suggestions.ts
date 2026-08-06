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
}): string[] {
  const suggestions: string[] = [];
  const input = `${data.problem} ${data.needed} ${data.existing} ${data.integrations}`.toLowerCase();

  // === ERP/CRM ===
  if (input.includes("erp") || input.includes("sap") || input.includes("neon")) {
    suggestions.push("💼 ERP — Integre seu sistema legado (Neon, SAP, Totvs)");
  }
  if (input.includes("crm") || input.includes("salesforce") || input.includes("hubspot")) {
    suggestions.push("👥 CRM — Gerencie clientes (Salesforce, HubSpot, Pipedrive)");
  }

  // === PAGAMENTOS ===
  if (data.requirePayments || input.includes("pagamento") || input.includes("stripe")) {
    suggestions.push("💳 Pagamentos — Processe transações (Stripe, Mercado Pago, PayPal)");
  }

  // === COMUNICAÇÃO ===
  if (input.includes("slack") || input.includes("whatsapp") || input.includes("email") || input.includes("notif")) {
    suggestions.push("💬 Slack — Notificações para o time");
    suggestions.push("📧 SendGrid ou Mailgun — Envio de emails");
  }

  // === ARMAZENAMENTO ===
  if (input.includes("arquivo") || input.includes("upload") || input.includes("storage") || input.includes("imagem")) {
    suggestions.push("☁️ AWS S3 ou Google Cloud Storage — Armazene arquivos");
  }

  // === ANALYTICS ===
  if (input.includes("analítica") || input.includes("métrica") || input.includes("relatório") || input.includes("dashboard")) {
    suggestions.push("📊 Google Analytics ou Mixpanel — Acompanhe usuários");
  }

  // === VIDEO/STREAMING ===
  if (input.includes("vídeo") || input.includes("stream") || input.includes("transmiss")) {
    suggestions.push("🎬 Mux ou AWS MediaConvert — Processe vídeos");
  }

  // === IA ===
  if (data.requireAI || input.includes("ia") || input.includes("ai") || input.includes("inteligência")) {
    suggestions.push("🤖 Claude API ou OpenAI — Adicione IA ao projeto");
  }

  // === AUTENTICAÇÃO SOCIAL ===
  if (input.includes("login") || input.includes("google") || input.includes("github")) {
    suggestions.push("🔐 Auth0 ou Firebase Auth — Login social");
  }

  // === GIT/DEVOPS ===
  if (input.includes("deploy") || input.includes("ci") || input.includes("cd")) {
    suggestions.push("🚀 GitHub Actions ou GitLab CI — Automação de deploy");
  }

  // === MONITORAMENTO ===
  if (input.includes("erro") || input.includes("log") || input.includes("monitor") || input.includes("performance")) {
    suggestions.push("📈 Sentry ou DataDog — Monitore erros em produção");
  }

  return suggestions.length > 0
    ? suggestions
    : [
        "💼 ERP — Se precisa integrar sistemas legados",
        "💳 Stripe — Se precisa processar pagamentos",
        "💬 Slack — Para notificações do time",
        "📊 Google Analytics — Para acompanhar uso",
        "🚀 GitHub Actions — Para CI/CD",
      ];
}
