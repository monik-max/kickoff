/**
 * Glossário de ferramentas. A intenção não é listar tudo que existe — é dar,
 * para cada necessidade, as opções que valem consideração e o critério para
 * escolher entre elas.
 *
 * `pricing` é indicativo e muda com o tempo. Confirme no site antes de decidir:
 *  - gratis    open source ou gratuito de verdade, incluindo auto-hospedar
 *  - freemium  camada grátis utilizável em projeto real, paga acima disso
 *  - pago      exige pagamento para uso sério
 */

export type Pricing = "gratis" | "freemium" | "pago";

export type Tool = {
  name: string;
  /** Para que serve, em uma frase. */
  what: string;
  /** O que diferencia esta das outras da mesma categoria. */
  edge: string;
  pricing: Pricing;
};

export type Category = {
  slug: string;
  name: string;
  /** Quando você precisa de algo desta categoria. */
  when: string;
  tools: Tool[];
};

export const CATEGORIES: Category[] = [
  {
    slug: "design",
    name: "Design e prototipagem",
    when: "Antes de escrever código: desenhar telas, testar fluxo e alinhar com quem decide.",
    tools: [
      { name: "Figma", what: "Editor de interface colaborativo, no navegador.", edge: "Padrão de fato do mercado. Se você vai trabalhar com designers, é este que eles usam.", pricing: "freemium" },
      { name: "Penpot", what: "Alternativa open source ao Figma.", edge: "Auto-hospedável e sem limite de projetos. Vale quando o custo ou a dependência de fornecedor pesa.", pricing: "gratis" },
      { name: "Excalidraw", what: "Quadro branco de diagramas com aparência de rascunho.", edge: "O visual de rascunho é intencional: sinaliza que a ideia está aberta a mudança, então as pessoas criticam mais.", pricing: "freemium" },
      { name: "tldraw", what: "Quadro branco infinito, rápido e colaborativo.", edge: "Ótimo para desenhar arquitetura ao vivo numa reunião.", pricing: "freemium" },
      { name: "Canva", what: "Design gráfico com modelos prontos.", edge: "Para quem não é designer produzir material apresentável. Não serve para interface de software.", pricing: "freemium" },
    ],
  },
  {
    slug: "frontend",
    name: "Frontend — frameworks",
    when: "Construir a parte que o usuário vê e com que interage.",
    tools: [
      { name: "React", what: "Biblioteca para construir interfaces por componentes.", edge: "Maior ecossistema e mercado de trabalho. Sozinha não resolve rotas nem dados — você monta o resto.", pricing: "gratis" },
      { name: "Next.js", what: "Framework sobre React, com rotas, renderização no servidor e build.", edge: "Traz decisões prontas que no React puro você teria de tomar. É o que este Kickoff usa.", pricing: "gratis" },
      { name: "Vue", what: "Framework de interface com curva de aprendizado mais suave.", edge: "Sintaxe mais próxima de HTML. Costuma ser mais fácil de começar que React.", pricing: "gratis" },
      { name: "Svelte", what: "Framework que compila o componente em JavaScript direto.", edge: "Sem runtime pesado no navegador: aplicações menores e mais rápidas.", pricing: "gratis" },
      { name: "Angular", what: "Framework completo, com tudo já decidido.", edge: "Opinativo e verboso, mas previsível. Comum em empresa grande e sistema de longa vida.", pricing: "gratis" },
      { name: "Astro", what: "Framework focado em sites de conteúdo.", edge: "Manda zero JavaScript por padrão. Imbatível para blog, documentação e site institucional.", pricing: "gratis" },
    ],
  },
  {
    slug: "estilo",
    name: "Estilo e componentes",
    when: "Dar aparência ao frontend sem escrever CSS do zero.",
    tools: [
      { name: "Tailwind CSS", what: "CSS por classes utilitárias aplicadas direto no HTML.", edge: "Você não inventa nome de classe nem alterna entre arquivos. O HTML fica verboso — é o custo.", pricing: "gratis" },
      { name: "shadcn/ui", what: "Componentes prontos que você copia para dentro do projeto.", edge: "Não é dependência: o código passa a ser seu e você edita à vontade.", pricing: "gratis" },
      { name: "Material UI", what: "Componentes React seguindo o Material Design do Google.", edge: "Muito completo. Em compensação, tudo tende a parecer um app do Google.", pricing: "freemium" },
      { name: "Radix UI", what: "Componentes sem estilo, com acessibilidade resolvida.", edge: "Cuida de teclado, foco e leitor de tela — a parte difícil e invisível — e deixa o visual com você.", pricing: "gratis" },
      { name: "Chakra UI", what: "Biblioteca de componentes React com foco em acessibilidade.", edge: "Bom equilíbrio entre pronto para usar e customizável.", pricing: "gratis" },
    ],
  },
  {
    slug: "backend",
    name: "Backend — linguagens e frameworks",
    when: "Regras de negócio, APIs e tudo que não pode ficar no navegador.",
    tools: [
      { name: "Node.js + Express", what: "Servidor JavaScript com o framework web mais usado.", edge: "Mesma linguagem do frontend. Express é minimalista: simples de começar, você decide a estrutura.", pricing: "gratis" },
      { name: "NestJS", what: "Framework Node.js com arquitetura definida.", edge: "Impõe organização desde o início. Vale quando o projeto vai crescer ou o time é grande.", pricing: "gratis" },
      { name: "Fastify", what: "Framework Node.js focado em desempenho.", edge: "Mais rápido que Express e com validação de schema embutida.", pricing: "gratis" },
      { name: "Django", what: "Framework Python com tudo incluso.", edge: "Vem com painel administrativo pronto — economiza semanas em sistema interno.", pricing: "gratis" },
      { name: "FastAPI", what: "Framework Python moderno para APIs.", edge: "Gera documentação interativa da API sozinho, a partir dos tipos.", pricing: "gratis" },
      { name: "Laravel", what: "Framework PHP completo.", edge: "Enorme no Brasil. Hospedagem barata e muita mão de obra disponível.", pricing: "gratis" },
      { name: "Spring Boot", what: "Framework Java para aplicações corporativas.", edge: "Onde há Java corporativo, é isto. Robusto e verboso.", pricing: "gratis" },
      { name: "Go", what: "Linguagem compilada da Google, para serviços.", edge: "Binário único, sem runtime para instalar. Excelente para serviço que precisa aguentar carga.", pricing: "gratis" },
    ],
  },
  {
    slug: "banco",
    name: "Banco de dados",
    when: "Guardar dados que precisam sobreviver ao fim da requisição.",
    tools: [
      { name: "PostgreSQL", what: "Banco relacional open source.", edge: "Escolha padrão quando não há motivo forte para outra coisa. Faz relacional, JSON, busca textual e geoespacial.", pricing: "gratis" },
      { name: "MySQL", what: "Banco relacional muito difundido.", edge: "Hospedagem barata em qualquer lugar. Menos recursos avançados que Postgres.", pricing: "gratis" },
      { name: "SQLite", what: "Banco relacional dentro de um único arquivo.", edge: "Sem servidor para administrar. Perfeito para app local, protótipo e teste.", pricing: "gratis" },
      { name: "MongoDB", what: "Banco de documentos, sem schema fixo.", edge: "Bom quando o formato do dado varia de verdade. Costuma ser escolhido cedo demais, por parecer mais fácil.", pricing: "freemium" },
      { name: "Redis", what: "Armazenamento em memória, chave-valor.", edge: "Muito rápido, mas volátil. Serve para cache, sessão e fila — não como banco principal.", pricing: "freemium" },
      { name: "Neon", what: "Postgres serverless com branches.", edge: "Cria uma cópia do banco por branch de código, como no Git. Escala a zero quando ocioso. É o banco deste Kickoff.", pricing: "freemium" },
      { name: "Supabase", what: "Postgres com API, autenticação e storage prontos.", edge: "Substitui boa parte do backend. Ótimo para começar rápido sozinho.", pricing: "freemium" },
      { name: "PlanetScale", what: "MySQL gerenciado com migração sem downtime.", edge: "Muda schema em produção sem travar a tabela — problema real em base grande.", pricing: "pago" },
    ],
  },
  {
    slug: "orm",
    name: "ORM e acesso a dados",
    when: "Conversar com o banco a partir do código, sem escrever SQL manualmente.",
    tools: [
      { name: "Prisma", what: "ORM com schema próprio e cliente tipado.", edge: "A melhor experiência de desenvolvimento do ecossistema Node. Esconde bastante SQL, o que atrapalha em consulta complexa.", pricing: "freemium" },
      { name: "Drizzle", what: "ORM TypeScript que fica perto do SQL.", edge: "Você enxerga o SQL que será gerado. Leve e sem etapa de build. É o que este Kickoff usa.", pricing: "gratis" },
      { name: "TypeORM", what: "ORM tradicional para TypeScript.", edge: "Estilo clássico, com decoradores. Familiar para quem vem de Java ou C#.", pricing: "gratis" },
      { name: "SQLAlchemy", what: "ORM padrão do Python.", edge: "Maduro e poderoso. Deixa descer ao SQL quando necessário.", pricing: "gratis" },
    ],
  },
  {
    slug: "auth",
    name: "Autenticação",
    when: "Login, cadastro e controle de quem pode fazer o quê.",
    tools: [
      { name: "Auth.js (NextAuth)", what: "Autenticação para aplicações Next.js e Node.", edge: "Roda no seu servidor, sem custo por usuário. Você administra a complexidade.", pricing: "gratis" },
      { name: "Clerk", what: "Autenticação como serviço, com telas prontas.", edge: "Login, cadastro e gestão de conta funcionando em minutos. Cobra por usuário ativo.", pricing: "freemium" },
      { name: "Auth0", what: "Plataforma de identidade corporativa.", edge: "Cobre casos complexos: SSO empresarial, SAML, multi-tenant. Fica caro rápido.", pricing: "freemium" },
      { name: "Supabase Auth", what: "Autenticação integrada ao Postgres do Supabase.", edge: "O usuário vira linha no seu banco, com permissão por linha no próprio Postgres.", pricing: "freemium" },
      { name: "Keycloak", what: "Servidor de identidade open source.", edge: "Auto-hospedado, sem custo por usuário. Exige que alguém opere a infraestrutura.", pricing: "gratis" },
    ],
  },
  {
    slug: "pagamentos",
    name: "Pagamentos",
    when: "Cobrar do usuário, com cartão, assinatura ou Pix.",
    tools: [
      { name: "Stripe", what: "Plataforma de pagamentos com a melhor documentação do setor.", edge: "Referência técnica. No Brasil, cobertura de meios locais é menor que a dos concorrentes daqui.", pricing: "pago" },
      { name: "Mercado Pago", what: "Gateway de pagamentos forte na América Latina.", edge: "Pix, boleto e parcelamento resolvidos. É o caminho natural para produto brasileiro.", pricing: "pago" },
      { name: "Pagar.me", what: "Gateway brasileiro voltado a marketplace.", edge: "Split de pagamento entre vendedores é nativo — dor específica de marketplace.", pricing: "pago" },
      { name: "Asaas", what: "Cobrança recorrente e gestão financeira, no Brasil.", edge: "Pensado para assinatura e cobrança recorrente em real, com régua de inadimplência.", pricing: "pago" },
      { name: "PayPal", what: "Pagamento internacional amplamente reconhecido.", edge: "Confiança do usuário em compra internacional. Taxas altas.", pricing: "pago" },
    ],
  },
  {
    slug: "realtime",
    name: "Tempo real e filas",
    when: "Chat, notificação instantânea, colaboração ao vivo ou processamento em segundo plano.",
    tools: [
      { name: "Socket.IO", what: "Biblioteca de WebSocket com reconexão automática.", edge: "Resolve os detalhes chatos: cair a conexão, voltar, e navegador antigo.", pricing: "gratis" },
      { name: "Pusher", what: "Tempo real como serviço.", edge: "Você não administra servidor de WebSocket. Cobra por conexão e mensagem.", pricing: "freemium" },
      { name: "Ably", what: "Mensageria em tempo real com garantia de entrega.", edge: "Garante ordem e entrega das mensagens — importante quando perder evento é inaceitável.", pricing: "freemium" },
      { name: "BullMQ", what: "Fila de tarefas em Node, sobre Redis.", edge: "Tira trabalho pesado da requisição: e-mail, relatório, processamento de imagem.", pricing: "gratis" },
      { name: "RabbitMQ", what: "Intermediário de mensagens maduro.", edge: "Roteamento sofisticado entre serviços. Peso de infraestrutura considerável.", pricing: "gratis" },
      { name: "Kafka", what: "Plataforma de streaming de eventos em alta escala.", edge: "Para volume realmente alto. Complexo demais para a maioria dos projetos.", pricing: "gratis" },
    ],
  },
  {
    slug: "ia",
    name: "IA e modelos de linguagem",
    when: "Gerar texto, classificar, resumir ou responder pergunta sobre seus dados.",
    tools: [
      { name: "Claude API (Anthropic)", what: "Modelos de linguagem via API.", edge: "Forte em texto longo, raciocínio e seguir instrução detalhada. Suporta saída estruturada validada por schema.", pricing: "pago" },
      { name: "OpenAI API", what: "Modelos GPT via API.", edge: "Maior ecossistema de bibliotecas e exemplos. Muito material de aprendizado disponível.", pricing: "pago" },
      { name: "Ollama", what: "Roda modelos de linguagem na sua própria máquina.", edge: "Custo zero e o dado não sai do computador. Qualidade abaixo dos modelos de API e exige máquina boa.", pricing: "gratis" },
      { name: "Hugging Face", what: "Repositório de modelos abertos e hospedagem.", edge: "Onde ficam os modelos open source. Bom para tarefa específica sem pagar API geral.", pricing: "freemium" },
      { name: "LangChain", what: "Framework para encadear chamadas a modelos.", edge: "Abstrações prontas para RAG e agentes. Adiciona camada que às vezes atrapalha mais que ajuda.", pricing: "gratis" },
      { name: "pgvector", what: "Extensão do Postgres para busca por similaridade.", edge: "Busca semântica sem adicionar outro banco ao projeto.", pricing: "gratis" },
    ],
  },
  {
    slug: "storage",
    name: "Arquivos e mídia",
    when: "Upload de foto, documento ou vídeo pelo usuário.",
    tools: [
      { name: "Amazon S3", what: "Armazenamento de objetos na nuvem.", edge: "Padrão da indústria. Praticamente toda ferramenta fala o protocolo dele.", pricing: "pago" },
      { name: "Cloudflare R2", what: "Armazenamento compatível com S3.", edge: "Não cobra para tirar o dado de lá — o custo que mais surpreende na fatura da AWS.", pricing: "freemium" },
      { name: "Cloudinary", what: "Armazenamento com transformação de imagem por URL.", edge: "Redimensiona, corta e converte formato mudando a URL. Elimina muito código.", pricing: "freemium" },
      { name: "UploadThing", what: "Upload de arquivos para aplicações TypeScript.", edge: "Resolve a parte chata do upload em poucas linhas.", pricing: "freemium" },
      { name: "Mux", what: "Plataforma de vídeo por API.", edge: "Vídeo é muito mais difícil que imagem: codificação, streaming adaptativo, legenda. Isto resolve.", pricing: "pago" },
    ],
  },
  {
    slug: "deploy",
    name: "Deploy e hospedagem",
    when: "Colocar a aplicação no ar para outras pessoas usarem.",
    tools: [
      { name: "Vercel", what: "Hospedagem otimizada para Next.js e sites estáticos.", edge: "Deploy a cada push, sem configurar nada. É onde este Kickoff roda.", pricing: "freemium" },
      { name: "Netlify", what: "Hospedagem para frontend e funções serverless.", edge: "Concorrente direta da Vercel, menos amarrada ao Next.js.", pricing: "freemium" },
      { name: "Railway", what: "Hospedagem de aplicação e banco com pouca configuração.", edge: "Roda backend de longa duração e banco juntos, sem montar infraestrutura.", pricing: "freemium" },
      { name: "Render", what: "Hospedagem de serviços web, workers e bancos.", edge: "Preço previsível e suporta processo que roda continuamente.", pricing: "freemium" },
      { name: "Fly.io", what: "Contêineres rodando perto do usuário.", edge: "Coloca a aplicação em várias regiões do mundo com pouca configuração.", pricing: "freemium" },
      { name: "AWS", what: "Nuvem completa da Amazon.", edge: "Faz tudo, custa proporcional à complexidade. Exige conhecimento próprio para não desperdiçar dinheiro.", pricing: "pago" },
      { name: "Hostinger / Hostgator", what: "Hospedagem compartilhada tradicional.", edge: "Barata e comum no Brasil para site PHP e WordPress. Limitada para aplicação moderna.", pricing: "pago" },
    ],
  },
  {
    slug: "devops",
    name: "DevOps e CI/CD",
    when: "Automatizar teste, build e publicação a cada mudança no código.",
    tools: [
      { name: "Git", what: "Controle de versão do código.", edge: "Não é opcional. Toda vaga pressupõe que você sabe usar.", pricing: "gratis" },
      { name: "GitHub", what: "Hospedagem de repositórios e colaboração.", edge: "Onde está o open source. Seu perfil ali funciona como portfólio.", pricing: "freemium" },
      { name: "GitHub Actions", what: "Automação integrada ao GitHub.", edge: "Já está onde o código está — nada para integrar. Suficiente para a maioria dos projetos.", pricing: "freemium" },
      { name: "Docker", what: "Empacota a aplicação com tudo que ela precisa para rodar.", edge: "Acaba com o \"na minha máquina funciona\". Vale aprender cedo.", pricing: "freemium" },
      { name: "Kubernetes", what: "Orquestra contêineres em escala.", edge: "Poderoso e complexo. Quase sempre é cedo demais — Railway ou Render resolvem antes disso.", pricing: "gratis" },
      { name: "Terraform", what: "Infraestrutura descrita como código.", edge: "Recria o ambiente inteiro a partir de arquivo versionado, sem clicar em painel.", pricing: "freemium" },
    ],
  },
  {
    slug: "observabilidade",
    name: "Observabilidade e erros",
    when: "Descobrir que quebrou antes do usuário avisar, e entender por quê.",
    tools: [
      { name: "Sentry", what: "Captura erros com o rastreamento completo.", edge: "Mostra a linha exata, o navegador e o que o usuário fez antes. Primeira coisa a instalar em produção.", pricing: "freemium" },
      { name: "Better Stack", what: "Logs, monitoramento e página de status.", edge: "Camada grátis generosa e configuração simples.", pricing: "freemium" },
      { name: "Datadog", what: "Plataforma completa de monitoramento.", edge: "Enxerga tudo. Cara, e a fatura surpreende quem não controla o volume.", pricing: "pago" },
      { name: "Grafana + Prometheus", what: "Métricas e painéis open source.", edge: "Sem custo por volume, auto-hospedado. Exige montar e manter.", pricing: "gratis" },
      { name: "LogRocket", what: "Grava a sessão do usuário junto com o erro.", edge: "Você assiste ao que a pessoa fez até quebrar. Resolve bug que ninguém consegue reproduzir.", pricing: "freemium" },
    ],
  },
  {
    slug: "testes",
    name: "Testes",
    when: "Garantir que a mudança de hoje não quebrou o que funcionava ontem.",
    tools: [
      { name: "Vitest", what: "Executor de testes rápido para projetos JavaScript.", edge: "Muito rápido e com pouca configuração. Padrão atual no ecossistema Vite.", pricing: "gratis" },
      { name: "Jest", what: "Executor de testes tradicional do JavaScript.", edge: "Maduro, com muito material. Mais lento que Vitest.", pricing: "gratis" },
      { name: "Playwright", what: "Testa a aplicação controlando um navegador real.", edge: "Roda em Chrome, Firefox e Safari. Espera o elemento aparecer sozinho, o que elimina teste instável.", pricing: "gratis" },
      { name: "Cypress", what: "Testes de ponta a ponta com interface visual.", edge: "Você vê o teste rodando passo a passo. Excelente para aprender a testar.", pricing: "freemium" },
      { name: "Testing Library", what: "Utilitários para testar componentes como o usuário os usa.", edge: "Empurra você a testar comportamento em vez de detalhe interno — teste que não quebra à toa.", pricing: "gratis" },
    ],
  },
  {
    slug: "analytics",
    name: "Analytics e produto",
    when: "Entender o que as pessoas realmente fazem no seu produto.",
    tools: [
      { name: "Google Analytics", what: "Análise de audiência mais usada do mundo.", edge: "Grátis e onipresente. Complexo de configurar e com implicações de privacidade.", pricing: "gratis" },
      { name: "Plausible", what: "Análise simples e sem cookies.", edge: "Respeita privacidade e dispensa banner de consentimento. Um painel, sem labirinto.", pricing: "pago" },
      { name: "PostHog", what: "Análise de produto com gravação de sessão e feature flags.", edge: "Junta várias ferramentas numa só e pode ser auto-hospedado.", pricing: "freemium" },
      { name: "Mixpanel", what: "Análise focada em eventos e funil.", edge: "Forte para entender onde o usuário desiste dentro de um fluxo.", pricing: "freemium" },
      { name: "Vercel Analytics", what: "Métricas de audiência e desempenho na Vercel.", edge: "Zero configuração se você já está lá. Mede desempenho real dos usuários.", pricing: "freemium" },
    ],
  },
  {
    slug: "email",
    name: "E-mail e notificações",
    when: "Enviar confirmação, recuperação de senha ou aviso ao usuário.",
    tools: [
      { name: "Resend", what: "Envio de e-mail transacional por API.", edge: "Feito para quem programa, com e-mail escrito em React. Configuração muito simples.", pricing: "freemium" },
      { name: "SendGrid", what: "Plataforma de e-mail em volume.", edge: "Madura e escalável. Painel mais complexo.", pricing: "freemium" },
      { name: "Amazon SES", what: "Envio de e-mail da AWS.", edge: "De longe o mais barato em volume alto. Exige cuidado com reputação de envio.", pricing: "pago" },
      { name: "Twilio", what: "SMS, voz e WhatsApp por API.", edge: "Referência para SMS e verificação por telefone.", pricing: "pago" },
      { name: "Novu", what: "Infraestrutura de notificação multicanal, open source.", edge: "Centraliza e-mail, push e in-app num lugar só, com preferência por usuário.", pricing: "freemium" },
    ],
  },
  {
    slug: "gestao",
    name: "Gestão e documentação",
    when: "Organizar o trabalho e registrar decisão para quem chegar depois.",
    tools: [
      { name: "Linear", what: "Gestor de issues rápido, para times de produto.", edge: "Velocidade e atalhos de teclado. Opinativo de propósito — menos configuração, mais uso.", pricing: "freemium" },
      { name: "Jira", what: "Gestão de projetos corporativa.", edge: "Configurável ao extremo. Padrão em empresa grande, pesado para time pequeno.", pricing: "freemium" },
      { name: "Notion", what: "Documentos, bases de dados e wiki.", edge: "Flexível a ponto de virar bagunça sem disciplina. Ótimo como base de conhecimento.", pricing: "freemium" },
      { name: "Trello", what: "Quadro kanban simples.", edge: "Aprende em cinco minutos. Suficiente para projeto pequeno.", pricing: "freemium" },
      { name: "Obsidian", what: "Notas locais em arquivos Markdown.", edge: "O arquivo é seu, funciona sem internet e não depende de fornecedor.", pricing: "freemium" },
    ],
  },
];

export const PRICING_LABEL: Record<Pricing, string> = {
  gratis: "Grátis",
  freemium: "Freemium",
  pago: "Pago",
};

export const PRICING_HINT: Record<Pricing, string> = {
  gratis: "Open source ou gratuito, incluindo a opção de auto-hospedar.",
  freemium: "Camada grátis utilizável em projeto real; paga acima disso.",
  pago: "Exige pagamento para uso sério.",
};

export const ALL_TOOLS_COUNT = CATEGORIES.reduce((n, c) => n + c.tools.length, 0);

/* ------------------------------------------------------------------ */

/**
 * Escolha de linguagem por objetivo. Organizado pelo que a pessoa quer
 * construir, não pela linguagem — quem está começando chega com "quero fazer
 * um app", não com "quero saber sobre Kotlin".
 */
export type LanguagePick = {
  slug: string;
  /** O que a pessoa quer construir. */
  goal: string;
  /** A aposta mais segura, e por quê. */
  main: string;
  mainWhy: string;
  /** Alternativas que valem consideração. */
  others: { lang: string; why: string }[];
  /** Erro comum de quem está escolhendo agora. */
  trap: string;
};

export const LANGUAGE_PICKS: LanguagePick[] = [
  {
    slug: "primeira",
    goal: "Aprender a programar do zero",
    main: "Python",
    mainWhy:
      "Sintaxe limpa, pouca cerimônia e mensagem de erro legível. Você gasta energia entendendo lógica, não brigando com ponto e vírgula.",
    others: [
      { lang: "JavaScript", why: "Roda no navegador sem instalar nada e dá resultado visual rápido, o que sustenta a motivação." },
    ],
    trap: "Ficar meses escolhendo a linguagem 'certa'. A primeira serve para aprender a pensar; a segunda você aprende em semanas.",
  },
  {
    slug: "web",
    goal: "Site ou aplicação web",
    main: "TypeScript",
    mainWhy:
      "JavaScript com tipos — e JavaScript é a única linguagem que o navegador executa nativamente, então para a interface não há escolha real. Os tipos acusam erro antes de rodar, e com Node.js a mesma linguagem cobre o servidor.",
    others: [
      { lang: "JavaScript puro", why: "Sem etapa de compilação. Serve para script pequeno e para aprender a base antes de somar os tipos." },
      { lang: "PHP", why: "Enorme em web no Brasil, com Laravel e WordPress. Hospedagem barata e muita vaga." },
      { lang: "Python", why: "Com Django ou FastAPI no backend, se você já sabe Python." },
    ],
    trap: "Aprender JavaScript e pular TypeScript. Migrar depois custa mais do que começar tipado.",
  },
  {
    slug: "backend",
    goal: "API e regras de negócio",
    main: "TypeScript (Node.js)",
    mainWhy:
      "Mesma linguagem do frontend: um vocabulário só para o projeto inteiro, e você troca de camada sem trocar de cabeça.",
    others: [
      { lang: "Python", why: "Ótimo se o sistema envolve dados ou IA — o ecossistema já está lá." },
      { lang: "Java / C#", why: "Padrão em empresa grande e banco. Verboso, previsível, muita vaga formal." },
      { lang: "Go", why: "Para serviço que precisa aguentar carga com pouco recurso. Simples de aprender, difícil de escrever mal." },
      { lang: "PHP", why: "Laravel entrega muito rápido e é forte no mercado brasileiro." },
    ],
    trap: "Escolher a linguagem mais rápida em benchmark. Gargalo de projeto real quase sempre é banco de dados, não linguagem.",
  },
  {
    slug: "mobile",
    goal: "Aplicativo de celular",
    main: "React Native (TypeScript)",
    mainWhy:
      "Um código para Android e iOS. Se você já sabe React, é a distância mais curta entre saber web e ter app publicado.",
    others: [
      { lang: "Flutter (Dart)", why: "Desempenho e visual mais consistentes entre plataformas. Dart é linguagem nova para aprender." },
      { lang: "Kotlin", why: "Nativo Android. Melhor acesso a recurso do aparelho e desempenho." },
      { lang: "Swift", why: "Nativo iOS. Obrigatório para recurso avançado da Apple." },
    ],
    trap: "Ir de nativo antes de validar a ideia — dois códigos, dois times, duas publicações. Multiplataforma primeiro, nativo quando doer.",
  },
  {
    slug: "dados",
    goal: "Análise de dados e relatórios",
    main: "Python",
    mainWhy:
      "Pandas, NumPy e a maior coleção de bibliotecas de dados que existe. É onde a área inteira conversa.",
    others: [
      { lang: "SQL", why: "Não é opcional. Toda análise passa por consultar banco — aprenda junto, não depois." },
      { lang: "R", why: "Forte em estatística e pesquisa acadêmica. Fora da academia, Python domina." },
    ],
    trap: "Pular SQL achando que Python resolve tudo. Filtrar no banco em vez de na memória é a diferença entre segundos e horas.",
  },
  {
    slug: "ia",
    goal: "Inteligência artificial e aprendizado de máquina",
    main: "Python",
    mainWhy:
      "PyTorch, TensorFlow e praticamente todo artigo e tutorial da área. Não há segundo lugar próximo.",
    others: [
      { lang: "TypeScript", why: "Suficiente para consumir API de modelo pronto, que é o caso da maioria dos produtos." },
    ],
    trap: "Achar que precisa treinar modelo do zero. Quase todo produto com IA hoje só consome API — e isso não exige Python.",
  },
  {
    slug: "automacao",
    goal: "Automatizar tarefa repetitiva",
    main: "Python",
    mainWhy:
      "Lê planilha, mexe em arquivo, chama API e raspa site com poucas linhas. Melhor retorno por hora investida.",
    others: [
      { lang: "Bash / PowerShell", why: "Para orquestrar comandos do sistema. Bash em Linux e Mac, PowerShell em Windows." },
      { lang: "JavaScript", why: "Se a automação envolve navegador, com Playwright ou Puppeteer." },
    ],
    trap: "Automatizar algo que roda uma vez por ano. O tempo de automatizar precisa caber no tempo economizado.",
  },
  {
    slug: "desktop",
    goal: "Programa de computador",
    main: "Electron ou Tauri (TypeScript)",
    mainWhy:
      "Aproveita conhecimento de web. Tauri gera aplicativo bem menor que Electron, ao custo de aprender um pouco de Rust.",
    others: [
      { lang: "C#", why: "Nativo Windows, com boa integração ao sistema." },
      { lang: "Python", why: "Para ferramenta interna simples, com PyQt ou Tkinter." },
    ],
    trap: "Escolher desktop quando web resolveria. Web não exige instalação nem atualização na máquina do usuário.",
  },
  {
    slug: "jogos",
    goal: "Jogos",
    main: "C# (Unity)",
    mainWhy:
      "Maior comunidade, mais tutorial e publica para praticamente qualquer plataforma.",
    others: [
      { lang: "GDScript (Godot)", why: "Motor open source, leve e gratuito. Linguagem própria, parecida com Python." },
      { lang: "C++ (Unreal)", why: "Padrão em jogo de grande porte e gráfico pesado. Curva íngreme." },
    ],
    trap: "Começar pelo jogo dos sonhos. Termine três jogos pequenos antes — jogo é o tipo de projeto que mais fica pela metade.",
  },
  {
    slug: "embarcado",
    goal: "Hardware, IoT e sistemas embarcados",
    main: "C",
    mainWhy:
      "Controle direto de memória e roda em microcontrolador com poucos kilobytes. Continua sendo a base da área.",
    others: [
      { lang: "C++", why: "Quando o dispositivo comporta abstração e o projeto é maior." },
      { lang: "Rust", why: "Segurança de memória sem coletor de lixo. Crescendo em embarcado." },
      { lang: "MicroPython", why: "Python em microcontrolador. Excelente para aprender e prototipar." },
    ],
    trap: "Ignorar limite de memória e energia. Em embarcado, a restrição é o projeto — não um detalhe de otimização.",
  },
  {
    slug: "performance",
    goal: "Alto desempenho e sistemas de base",
    main: "Rust",
    mainWhy:
      "Velocidade de C sem as falhas de memória que geram a maior parte das vulnerabilidades graves. O compilador é rígido e ensina.",
    others: [
      { lang: "Go", why: "Bem mais simples de aprender, com concorrência fácil. Excelente para serviço de rede." },
      { lang: "C++", why: "Onde já existe base legada e ecossistema consolidado." },
    ],
    trap: "Escolher por desempenho antes de ter problema de desempenho. Otimizar cedo custa prazo e legibilidade.",
  },
];

/* ------------------------------------------------------------------ */

/** Âncora estável da ferramenta na página do glossário. */
export function toolSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const TOOL_INDEX = new Map<string, Tool>();
for (const category of CATEGORIES) {
  for (const tool of category.tools) {
    TOOL_INDEX.set(toolSlug(tool.name), tool);
  }
}

/**
 * Casa um nome citado numa sugestão de stack com a ferramenta do glossário.
 *
 * As sugestões trazem variações — "Next.js 14" para "Next.js", "Claude API"
 * para "Claude API (Anthropic)". Por isso, além da correspondência exata,
 * aceita quando um slug é prefixo do outro. Sem isso, quase nenhum nome
 * sugerido viraria link.
 */
export function findTool(name: string): { tool: Tool; slug: string } | null {
  const wanted = toolSlug(name);
  if (!wanted) return null;

  const exact = TOOL_INDEX.get(wanted);
  if (exact) return { tool: exact, slug: wanted };

  for (const [slug, tool] of TOOL_INDEX) {
    if (slug.startsWith(`${wanted}-`) || wanted.startsWith(`${slug}-`)) {
      return { tool, slug };
    }
  }
  return null;
}
