/**
 * Sugere um stack de tecnologias baseado na descrição do projeto.
 * Usa heurísticas locais — sem API, sem custo.
 * Educativo: aprenda a reconhecer padrões em descrições de projeto!
 */

export function suggestStack(description: string): string {
  const lower = description.toLowerCase();

  // === DETECÇÃO DE REQUISITOS ===
  const hasWeb = /\b(site|portal|dashboard|web|frontend|interface|tela|plataforma|aplicação web|página)\b/.test(lower);
  const hasMobile = /\b(app|mobile|android|ios|react native|flutter|dispositivo móvel)\b/.test(lower);
  const hasRealtime = /\b(tempo real|realtime|chat|notif|live|websocket|sincron)\b/.test(lower);
  const hasAuth = /\b(autenticação|login|cadastro|usuário|permiss|acesso|rol|duas?-factor)\b/.test(lower);
  const hasPayment = /\b(pagamento|stripe|paypal|cobrança|checkout|transação|cartão|fatura)\b/.test(lower);
  const hasSearch = /\b(busca|pesquisa|filtro|indexação|elasticsearch)\b/.test(lower);
  const hasAI = /\b(ia|ai|ml|machine learning|modelo|llm|claude|openai|inteligência)\b/.test(lower);
  const hasScale = /\b(escala|1[0-9]k|100k|milh|performance|cdn|cache)\b/.test(lower);
  const hasReporting = /\b(relat|dashboard|analít|métricas|bi|gráfico|estatístic)\b/.test(lower);
  const hasOffline = /\b(offline|offline-first|sincroniz|conexão fraca)\b/.test(lower);
  const hasVideo = /\b(vídeo|transmiss|stream|upload|processament)\b/.test(lower);
  const hasLegacy = /\b(legado|integr|erp|sap|existing|monolito|sistema antigo)\b/.test(lower);

  const technologies: string[] = [];

  // === FRONTEND ===
  if (hasWeb) {
    technologies.push("React ou Next.js 14");
    technologies.push("TypeScript");
    technologies.push("Tailwind CSS");
    if (hasReporting) technologies.push("Recharts ou Plotly");
    if (hasOffline) technologies.push("React Query ou SWR");
  }

  // === MOBILE ===
  if (hasMobile) {
    technologies.push("React Native");
    if (hasOffline) technologies.push("WatermelonDB ou Realm");
  }

  // === BACKEND ===
  if (hasWeb || hasMobile) {
    technologies.push("Node.js + Express ou Fastify");
  }

  // === AUTENTICAÇÃO ===
  if (hasAuth) {
    if (hasScale || hasWeb) {
      technologies.push("JWT + OAuth2");
    }
  }

  // === BANCO DE DADOS ===
  // Regra: se tem busca complexa ou escala → PostgreSQL
  // Se tem documentos flexíveis → MongoDB
  // Padrão: PostgreSQL é mais robusto
  if (hasSearch || hasScale || hasPayment) {
    technologies.push("PostgreSQL");
  } else if (/\b(documento|flexible|json|dinâmic)\b/.test(lower)) {
    technologies.push("MongoDB");
  } else {
    technologies.push("PostgreSQL"); // padrão seguro
  }

  // === CACHE & PERFORMANCE ===
  if (hasScale || hasRealtime) {
    technologies.push("Redis");
  }

  // === REALTIME ===
  if (hasRealtime) {
    technologies.push("WebSocket (Socket.io)");
  }

  // === PAGAMENTO ===
  if (hasPayment) {
    technologies.push("Stripe API ou Mercado Pago");
  }

  // === BUSCA & INDEXAÇÃO ===
  if (hasSearch) {
    technologies.push("Elasticsearch ou Typesense");
  }

  // === IA ===
  if (hasAI) {
    technologies.push("Claude API ou Ollama local");
  }

  // === VIDEO/STREAMING ===
  if (hasVideo) {
    technologies.push("FFmpeg ou Mux");
  }

  // === DEVOPS & INFRAESTRUTURA ===
  if (hasScale) {
    technologies.push("Docker + Kubernetes");
    technologies.push("GitHub Actions + CI/CD");
    technologies.push("CloudFlare ou similar pra CDN");
  } else if (hasWeb || hasMobile) {
    technologies.push("Docker");
    technologies.push("GitHub Actions ou similar");
    technologies.push("Vercel, Railway ou Render pra deploy");
  }

  // === INTEGRAÇÃO COM LEGADO ===
  if (hasLegacy) {
    technologies.push("API Adapter Pattern");
    technologies.push("Message Queue (RabbitMQ ou Redis)");
  }

  // Padrão: se detectou muito pouco, retorna stack básico
  if (technologies.length === 0) {
    return "React + TypeScript, Node.js + Express, PostgreSQL, Tailwind CSS, Docker, GitHub Actions";
  }

  // Remove duplicatas e formata
  const unique = Array.from(new Set(technologies));
  return unique.join(", ");
}
