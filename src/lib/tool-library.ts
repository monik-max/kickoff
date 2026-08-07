/**
 * Biblioteca mestre de ferramentas.
 *
 * Difere de `glossary.ts`: aqui a unidade é a CATEGORIA, com a descrição do que
 * ela resolve e de quando você precisa dela. Os nomes de ferramenta vêm sem
 * descrição individual nem preço — para isso, `glossary.ts` continua sendo a
 * fonte, e `findTool` cruza os dois quando há verba lá.
 *
 * O objetivo principal não é navegação: é dar ao motor de plano um mapa de
 * "quando isto se aplica" muito maior que as ~12 regras de regex que existiam.
 * Por isso o campo `when` é o que alimenta a busca — é ele que descreve a
 * situação do projeto, não a tecnologia.
 */

export type LibCategory = {
  /** Número na biblioteca original, para rastrear a origem. */
  n: number;
  name: string;
  /** O que a categoria resolve. */
  does: string;
  /** Em que situação de projeto ela se aplica. É o texto que dirige o match. */
  when: string;
  tools: string[];
};

const c = (n: number, name: string, does: string, when: string, tools: string): LibCategory => ({
  n,
  name,
  does,
  when,
  tools: tools.split("|").map((t) => t.trim()),
});

export const LIBRARY: LibCategory[] = [
  c(1, "Design e prototipagem", "Criar interfaces, wireframes, layouts e protótipos antes do desenvolvimento.", "Você precisa desenhar como o sistema vai funcionar e validar telas e fluxos antes de programar.", "Figma|Penpot|Sketch|Framer|Canva|Adobe XD|Excalidraw|tldraw|Miro|FigJam|Whimsical|Balsamiq|ProtoPie|Principle|Zeplin|Maze|Marvel|UXPin|Origami Studio|Lunacy"),
  c(2, "Design systems e storybooks", "Organizar componentes visuais reutilizáveis e documentar padrões de interface.", "O produto possui muitos componentes e você quer manter botões, formulários, cores e elementos consistentes.", "Storybook|Chromatic|Zeroheight|Supernova|Backlight|Bit|Pattern Lab|Style Dictionary|Specify|Knapsack|Frontify"),
  c(3, "Frontend — frameworks e meta-frameworks", "Construir a interface e as páginas que o usuário acessa.", "Você precisa desenvolver sites, sistemas web, dashboards, SaaS ou aplicações interativas.", "React|Next.js|Vue|Nuxt|Svelte|SvelteKit|Angular|Astro|SolidJS|SolidStart|Qwik|Qwik City|Remix|React Router|TanStack Start|Preact|Alpine.js|Lit|HTMX|Fresh|Ember.js|Backbone.js"),
  c(4, "Build frontend e bundlers", "Preparar, compilar e otimizar arquivos do frontend para execução no navegador.", "Seu projeto precisa transformar JavaScript, TypeScript, CSS e outros arquivos em uma aplicação pronta para produção.", "Vite|Webpack|Rspack|Rolldown|Rollup|esbuild|Parcel|SWC|Babel|Turbopack|Snowpack|Gulp|Grunt"),
  c(5, "CSS, estilo e componentes", "Criar aparência, layout e componentes visuais da aplicação.", "Você precisa estilizar rapidamente telas, botões, menus, cards, formulários e outros elementos.", "Tailwind CSS|shadcn/ui|Material UI|Radix UI|Chakra UI|Bootstrap|Ant Design|Mantine|DaisyUI|Headless UI|HeroUI|PrimeReact|PrimeVue|Vuetify|Flowbite|Ark UI|Panda CSS|Styled Components|Emotion|Sass|Less|UnoCSS|Bulma|Foundation|Semantic UI|CSS Modules|Stitches"),
  c(6, "Ícones e assets de interface", "Disponibilizar bibliotecas prontas de ícones para interfaces.", "Você precisa adicionar ícones de menu, usuário, busca, configurações, alertas, redes sociais e ações.", "Lucide|Heroicons|Font Awesome|Phosphor Icons|Tabler Icons|Material Symbols|Iconify|React Icons|Simple Icons|Bootstrap Icons|Feather Icons|Radix Icons"),
  c(7, "Animações e interações", "Criar animações, transições, movimento e experiências interativas.", "Você quer menus animados, transições suaves, elementos 3D, microinterações ou interfaces mais dinâmicas.", "Motion|Framer Motion|GSAP|Lottie|Rive|Anime.js|AutoAnimate|React Spring|Popmotion|Three.js|React Three Fiber|Spline"),
  c(8, "Estado no frontend", "Controlar informações temporárias e compartilhadas dentro da interface.", "Diferentes partes da aplicação precisam acessar dados como usuário logado, carrinho, filtros, tema ou configurações.", "Redux Toolkit|Zustand|Jotai|MobX|Recoil|XState|Valtio|Pinia|Vuex|NgRx|Akita|Nanostores|Effector"),
  c(9, "Fetching, cache e sincronização de dados", "Buscar dados de APIs e manter essas informações atualizadas no frontend.", "A aplicação precisa carregar usuários, produtos, pedidos, dashboards ou qualquer informação do backend.", "TanStack Query|SWR|Apollo Client|urql|RTK Query|Relay|Axios|Ky|ofetch|Fetch API|TanStack Router"),
  c(10, "Formulários e validação", "Criar formulários e verificar se os dados enviados estão corretos.", "Existem cadastros, login, checkout, configurações, criação de registros ou entrada de informações pelo usuário.", "React Hook Form|Formik|TanStack Form|Final Form|Zod|Valibot|Yup|Joi|Ajv|Superstruct|Vest|VeeValidate"),
  c(11, "Backend — JavaScript e TypeScript", "Criar APIs, regras de negócio e serviços usando JavaScript ou TypeScript.", "Você quer utilizar a mesma linguagem do frontend também no servidor.", "Node.js|Express|NestJS|Fastify|Hono|Koa|AdonisJS|FeathersJS|LoopBack|Meteor|Elysia|Bun|Deno|Oak"),
  c(12, "Backend — Python", "Criar APIs, sistemas web, automações e serviços usando Python.", "O projeto utiliza Python ou possui forte integração com dados, automação ou inteligência artificial.", "Django|FastAPI|Flask|Litestar|Falcon|Tornado|Sanic|Bottle|Pyramid|Starlette"),
  c(13, "Backend — PHP", "Construir aplicações web e APIs usando PHP.", "Você desenvolve sistemas tradicionais, e-commerce, plataformas web ou utiliza hospedagem compatível com PHP.", "Laravel|Symfony|CodeIgniter|Slim|CakePHP|Yii|Laminas|Phalcon"),
  c(14, "Backend — Java e JVM", "Criar sistemas backend robustos e aplicações corporativas.", "O projeto exige grande escala, segurança, estabilidade ou integração com ambientes empresariais.", "Spring Boot|Quarkus|Micronaut|Jakarta EE|Vert.x|Play Framework|Ktor|Grails|Dropwizard"),
  c(15, "Backend — .NET", "Desenvolver APIs e sistemas utilizando tecnologias Microsoft.", "O projeto utiliza C#, Azure, Windows ou ambientes empresariais baseados em Microsoft.", "ASP.NET Core|.NET|Minimal APIs|Blazor|Orleans|ServiceStack|Nancy"),
  c(16, "Backend — Go", "Criar serviços rápidos, leves e eficientes.", "Você precisa de APIs, microsserviços, infraestrutura ou sistemas com alto desempenho e concorrência.", "Go|Gin|Fiber|Echo|Chi|Beego|Buffalo|Revel|Iris"),
  c(17, "Backend — Rust", "Desenvolver sistemas de alta performance e segurança de memória.", "Performance, consumo de recursos e segurança são prioridades importantes.", "Rust|Axum|Actix Web|Rocket|Warp|Poem|Salvo|Tide"),
  c(18, "Backend — Ruby", "Construir rapidamente aplicações web e produtos SaaS.", "Você quer produtividade alta e desenvolvimento rápido de sistemas web.", "Ruby on Rails|Sinatra|Hanami|Roda|Grape"),
  c(19, "Backend — Elixir e Erlang", "Criar sistemas altamente concorrentes, distribuídos e em tempo real.", "O projeto envolve chat, mensagens, milhares de conexões simultâneas ou alta disponibilidade.", "Elixir|Phoenix|LiveView|Erlang|Cowboy"),
  c(20, "Backend as a Service (BaaS)", "Fornecer backend pronto com banco, autenticação, storage e APIs.", "Você quer desenvolver rapidamente sem construir toda a infraestrutura de backend do zero.", "Supabase|Firebase|Appwrite|Convex|PocketBase|Nhost|Parse Platform|AWS Amplify|Hasura|Backendless|Xano|8base"),
  c(21, "Banco de dados relacional", "Armazenar dados estruturados relacionados entre si.", "O sistema possui usuários, pedidos, pagamentos, projetos, produtos e informações que precisam de consistência.", "PostgreSQL|MySQL|MariaDB|SQLite|Microsoft SQL Server|Oracle Database|CockroachDB|TiDB|YugabyteDB|Amazon Aurora|Amazon RDS|Google Cloud SQL|Azure SQL|IBM Db2"),
  c(22, "PostgreSQL serverless e distribuído", "Oferecer PostgreSQL gerenciado e preparado para aplicações modernas e serverless.", "Você quer PostgreSQL sem administrar manualmente servidores e infraestrutura.", "Neon|Supabase Database|Tembo|Crunchy Bridge|Aiven PostgreSQL|Timescale Cloud|EDB Postgres AI|Railway PostgreSQL|Render PostgreSQL"),
  c(23, "MySQL serverless e distribuído", "Disponibilizar MySQL gerenciado com escalabilidade automática.", "Seu sistema utiliza MySQL, mas você quer reduzir trabalho de infraestrutura.", "PlanetScale|TiDB Cloud|Aiven MySQL|Amazon Aurora MySQL|HeatWave MySQL|Railway MySQL"),
  c(24, "SQLite e edge databases", "Armazenar dados em bancos leves ou distribuídos próximos do usuário.", "Você precisa de aplicações simples, edge computing, aplicativos locais ou baixa latência.", "SQLite|Turso|Cloudflare D1|libSQL|LiteFS|rqlite|Litestream"),
  c(25, "NoSQL e document databases", "Armazenar dados flexíveis sem exigir tabelas relacionais tradicionais.", "A estrutura dos dados varia bastante ou o projeto precisa escalar documentos e eventos rapidamente.", "MongoDB|MongoDB Atlas|Firestore|Amazon DynamoDB|Couchbase|CouchDB|Azure Cosmos DB|RavenDB|Fauna|FerretDB"),
  c(26, "Key-value e cache", "Armazenar dados muito rapidamente em memória ou no formato chave-valor.", "Você precisa de cache, sessões, filas, rate limiting ou informações temporárias.", "Redis|Valkey|Upstash Redis|Memcached|Dragonfly|KeyDB|Amazon ElastiCache|Momento|Aerospike"),
  c(27, "Banco de dados de grafos", "Armazenar e consultar relacionamentos complexos entre informações.", "O projeto envolve redes sociais, recomendações, conexões, fraudes ou grafos de conhecimento.", "Neo4j|ArangoDB|Dgraph|Amazon Neptune|TigerGraph|Memgraph|JanusGraph|NebulaGraph"),
  c(28, "Banco de dados de séries temporais", "Armazenar informações associadas ao tempo.", "Você registra métricas, sensores, preços, logs ou eventos que acontecem continuamente.", "TimescaleDB|InfluxDB|QuestDB|VictoriaMetrics|Prometheus|Amazon Timestream"),
  c(29, "Banco de dados analítico e OLAP", "Consultar grandes quantidades de dados rapidamente para análise.", "Você precisa gerar dashboards, relatórios, métricas e análises de milhões de registros.", "ClickHouse|DuckDB|Apache Druid|StarRocks|Apache Pinot|MotherDuck|Firebolt|Tinybird"),
  c(30, "Vector databases", "Armazenar embeddings e realizar buscas por similaridade.", "Você está criando busca semântica, recomendações, RAG ou aplicações com IA.", "Pinecone|Qdrant|Weaviate|Milvus|Chroma|LanceDB|Vespa|Zilliz Cloud|pgvector|Redis Vector Search|MongoDB Atlas Vector Search|Elasticsearch Vector Search|OpenSearch Vector Search"),
  c(31, "ORM e query builders — JavaScript/TypeScript", "Facilitar a comunicação entre código JavaScript/TypeScript e bancos de dados.", "Você quer consultar e alterar banco de dados sem escrever SQL manual o tempo todo.", "Prisma|Drizzle|TypeORM|Sequelize|Kysely|MikroORM|Knex.js|Mongoose|Objection.js|Waterline"),
  c(32, "ORM e acesso a dados — outras linguagens", "Mapear objetos da aplicação para registros do banco.", "O backend utiliza Python, Java, C#, PHP, Ruby, Go ou Rust.", "SQLAlchemy|Django ORM|Hibernate|JPA|Entity Framework Core|Dapper|GORM|Eloquent|Diesel|SeaORM|Active Record|Doctrine ORM"),
  c(33, "Migrações e versionamento de banco", "Registrar e aplicar alterações na estrutura do banco de dados.", "Você precisa adicionar tabelas, colunas ou índices sem perder controle das versões.", "Prisma Migrate|Drizzle Kit|Flyway|Liquibase|Alembic|Atlas|dbmate|golang-migrate|Sqitch|Knex Migrations"),
  c(34, "Clientes e gerenciadores de banco", "Visualizar e administrar bancos por interface gráfica.", "Você quer consultar tabelas, editar dados, executar SQL ou administrar servidores de banco.", "DBeaver|DataGrip|TablePlus|Beekeeper Studio|HeidiSQL|pgAdmin|MySQL Workbench|MongoDB Compass|RedisInsight|Sequel Ace|Navicat|Adminer|phpMyAdmin|Studio 3T"),
  c(35, "Autenticação e identidade", "Controlar cadastro, login e identidade dos usuários.", "Seu produto precisa saber quem está utilizando a aplicação.", "Auth.js|Better Auth|Clerk|Auth0|Supabase Auth|Firebase Authentication|WorkOS|Stytch|Descope|FusionAuth|Keycloak|Zitadel|Logto|Ory|AWS Cognito|Microsoft Entra ID|Okta|OneLogin|Magic|SuperTokens|Lucia"),
  c(36, "Autorização e permissões", "Definir o que cada usuário pode visualizar ou fazer.", "Existem administradores, membros, clientes, equipes, cargos ou diferentes níveis de acesso.", "Casbin|OpenFGA|Cerbos|Permit.io|Oso|SpiceDB|Authzed|OPA|Aserto|CASL"),
  c(37, "SSO, SAML e SCIM", "Permitir login corporativo e gerenciamento automático de usuários.", "Seu SaaS atende empresas que desejam utilizar contas Google Workspace, Microsoft ou identidade corporativa.", "WorkOS|Auth0|Okta|Microsoft Entra ID|Clerk|Stytch|Descope|FusionAuth|OneLogin|JumpCloud|Zitadel"),
  c(38, "Pagamentos", "Receber pagamentos por cartão, Pix, boleto e outros meios.", "Seu sistema vende produtos, serviços ou cobranças online.", "Stripe|Mercado Pago|Pagar.me|Asaas|PayPal|Adyen|Braintree|Square|Mollie|PagBank|Efí Bank|Iugu|DLocal|Checkout.com|Razorpay|Authorize.net"),
  c(39, "Assinaturas e billing", "Gerenciar cobranças recorrentes, planos e assinaturas.", "Seu produto funciona como SaaS, assinatura mensal, créditos ou cobrança por uso.", "Stripe Billing|Paddle|Lemon Squeezy|Chargebee|Recurly|Zuora|Maxio|Orb|Metronome|Lago|Polar|Dodo Payments|Kill Bill"),
  c(40, "Impostos e compliance financeiro", "Calcular impostos e auxiliar em obrigações fiscais relacionadas às vendas.", "Seu produto vende para diferentes estados ou países.", "Stripe Tax|Avalara|TaxJar|Paddle|Lemon Squeezy|Quaderno|Anrok"),
  c(41, "Tempo real", "Enviar dados instantaneamente entre servidor e usuários.", "Você precisa de chat, colaboração ao vivo, notificações instantâneas ou dashboards em tempo real.", "Socket.IO|Pusher|Ably|Supabase Realtime|Firebase Realtime Database|PubNub|Centrifugo|Mercure|Liveblocks|PartyKit|Cloudflare Durable Objects"),
  c(42, "Filas e message brokers", "Transportar e processar mensagens de forma assíncrona entre sistemas.", "Uma tarefa não precisa ser executada imediatamente dentro da requisição principal.", "RabbitMQ|Apache Kafka|Redpanda|NATS|Amazon SQS|Amazon SNS|Google Pub/Sub|Azure Service Bus|Apache Pulsar|ActiveMQ|Redis Streams|Cloudflare Queues"),
  c(43, "Background jobs e workflows", "Executar tarefas demoradas em segundo plano.", "Você precisa processar arquivos, gerar relatórios, enviar e-mails ou executar fluxos complexos.", "BullMQ|Inngest|Trigger.dev|Temporal|Celery|Sidekiq|Resque|Hangfire|Quartz|Apache Airflow|Prefect|Dagster|Hatchet|River|Graphile Worker"),
  c(44, "Cron e agendamento", "Executar tarefas automaticamente em horários ou intervalos específicos.", "Algo precisa acontecer todo dia, hora, semana ou em determinada data.", "Vercel Cron|GitHub Actions Scheduled Workflows|Cloudflare Cron Triggers|AWS EventBridge Scheduler|Google Cloud Scheduler|Azure Functions Timer|Upstash QStash|Cronitor|EasyCron|Trigger.dev|Inngest"),
  c(45, "Webhooks", "Receber avisos automáticos quando algo acontece em outro sistema.", "Pagamentos, GitHub, Stripe ou outros serviços precisam avisar sua aplicação sobre eventos.", "Svix|Hookdeck|Convoy|Webhook.site|Beeceptor|RequestBin|Pipedream|Hook0|Standard Webhooks|ngrok"),
  c(46, "IA — provedores de modelos", "Fornecer modelos de inteligência artificial por API.", "Você precisa gerar texto, código, imagens, análises ou respostas inteligentes.", "OpenAI|Anthropic|Google Gemini|xAI|Mistral AI|Cohere|Meta AI|DeepSeek|Alibaba Qwen|AI21 Labs|Microsoft Azure OpenAI|AWS Bedrock|Google Vertex AI|IBM watsonx"),
  c(47, "IA — inferência e hosting de modelos", "Executar modelos de IA em infraestrutura pronta.", "Você quer rodar modelos próprios ou open-source sem administrar GPUs diretamente.", "Groq|Together AI|Fireworks AI|Replicate|OpenRouter|Hugging Face Inference|Baseten|Modal|RunPod|DeepInfra|Cerebras|SambaNova|Fal.ai|Anyscale"),
  c(48, "IA local e self-hosted", "Executar modelos de IA localmente ou em infraestrutura própria.", "Privacidade, redução de custo ou controle dos dados são prioridades.", "Ollama|LM Studio|vLLM|llama.cpp|SGLang|LocalAI|Text Generation Inference|TensorRT-LLM|MLX|Jan|GPT4All"),
  c(49, "SDKs de IA", "Facilitar a integração de modelos de IA dentro do código.", "Você precisa chamar modelos, gerar respostas estruturadas, streaming ou ferramentas.", "Vercel AI SDK|OpenAI SDK|Anthropic SDK|Google Gen AI SDK|LangChain|LlamaIndex|Semantic Kernel|PydanticAI|Haystack|Instructor|LiteLLM"),
  c(50, "Agentes de IA e orquestração", "Criar agentes capazes de executar etapas, usar ferramentas e tomar decisões.", "A IA precisa realizar tarefas complexas além de simplesmente responder perguntas.", "LangGraph|AutoGen|CrewAI|PydanticAI|Semantic Kernel|OpenAI Agents SDK|Google Agent Development Kit|Mastra|Agno|LlamaIndex Agents|Smolagents"),
  c(51, "RAG e retrieval", "Fazer a IA consultar documentos ou bases de conhecimento antes de responder.", "O modelo precisa responder utilizando dados específicos da empresa ou do usuário.", "LlamaIndex|LangChain|Haystack|Unstructured|Firecrawl|Jina AI|Cohere Rerank|Voyage AI|Exa|Tavily|Pinecone|Qdrant|Weaviate|pgvector"),
  c(52, "AI gateways e roteamento", "Centralizar e direcionar chamadas para diferentes modelos de IA.", "Você utiliza diversos provedores ou quer fallback, controle de custos e rate limiting.", "OpenRouter|LiteLLM|Portkey|Helicone Gateway|Cloudflare AI Gateway|Vercel AI Gateway|Kong AI Gateway|AWS Bedrock"),
  c(53, "IA — observabilidade, tracing e evals", "Monitorar qualidade, custo e comportamento das respostas de IA.", "Sua aplicação de IA já está em produção e precisa ser analisada e melhorada.", "LangSmith|Langfuse|Helicone|Arize Phoenix|Braintrust|Weights & Biases Weave|TruLens|DeepEval|Promptfoo|Ragas|OpenLLMetry|Galileo|Humanloop"),
  c(54, "Prompt management", "Organizar, versionar e testar prompts utilizados pela aplicação.", "Muitos prompts estão sendo alterados por desenvolvedores ou equipes de produto.", "LangSmith|Langfuse|PromptLayer|Humanloop|Braintrust|Portkey|Helicone|Agenta"),
  c(55, "Armazenamento de arquivos e objetos", "Guardar imagens, vídeos, PDFs e outros arquivos.", "Usuários fazem upload ou o sistema gera arquivos que precisam ficar armazenados.", "Amazon S3|Cloudflare R2|Supabase Storage|Firebase Storage|Google Cloud Storage|Azure Blob Storage|Backblaze B2|MinIO|DigitalOcean Spaces|Wasabi|Bunny Storage|Tigris"),
  c(56, "Imagens e otimização de mídia", "Redimensionar, comprimir e transformar imagens automaticamente.", "Seu produto trabalha com fotos e precisa entregar arquivos rápidos e otimizados.", "Cloudinary|ImageKit|Imgix|Uploadcare|Cloudflare Images|Filestack|Bytescale|Sharp|Thumbor"),
  c(57, "Uploads", "Criar fluxos de envio de arquivos para o servidor ou storage.", "Usuários precisam enviar fotos, documentos, vídeos ou anexos.", "UploadThing|Uppy|FilePond|Dropzone|Uploadcare|Filestack|Bytescale|Transloadit|Tus|Fine Uploader"),
  c(58, "Vídeo e streaming", "Hospedar, transmitir e processar vídeos e chamadas ao vivo.", "O sistema possui cursos, streaming, videoconferência ou conteúdo em vídeo.", "Mux|Cloudflare Stream|Vimeo|YouTube API|Bunny Stream|AWS Elemental MediaConvert|LiveKit|Daily|Agora|100ms|Jitsi"),
  c(59, "Áudio e voz", "Processar fala, áudio, chamadas e síntese de voz.", "O produto possui transcrição, assistentes por voz ou chamadas.", "ElevenLabs|Deepgram|AssemblyAI|Cartesia|PlayHT|Speechmatics|Google Speech-to-Text|Azure Speech|Amazon Transcribe|Whisper|LiveKit"),
  c(60, "Deploy e hospedagem", "Colocar sua aplicação online.", "O projeto está pronto para ser disponibilizado para usuários reais.", "Vercel|Netlify|Railway|Render|Fly.io|Heroku|Koyeb|Northflank|Zeabur|DigitalOcean App Platform|AWS|Google Cloud|Microsoft Azure|Hetzner|DigitalOcean|Hostinger|HostGator"),
  c(61, "Serverless e edge computing", "Executar código sob demanda sem manter servidores ligados permanentemente.", "Você quer escalar automaticamente e pagar principalmente pelo uso.", "Cloudflare Workers|Vercel Functions|AWS Lambda|Google Cloud Run|Google Cloud Functions|Azure Functions|Netlify Functions|Deno Deploy|Fastly Compute|Fly Machines|Supabase Edge Functions"),
  c(62, "PaaS self-hosted", "Criar sua própria plataforma de deploy semelhante à Vercel ou Heroku.", "Você quer controlar infraestrutura e reduzir dependência de plataformas fechadas.", "Coolify|Dokploy|CapRover|Dokku|Portainer|Rancher|Cloudron|Easypanel"),
  c(63, "Versionamento de código", "Registrar histórico e colaboração sobre alterações no código.", "Praticamente qualquer projeto de software precisa controlar suas versões.", "Git|GitHub|GitLab|Bitbucket|Gitea|Forgejo|Azure Repos|Codeberg"),
  c(64, "CI/CD", "Automatizar testes, builds e publicação da aplicação.", "Você quer que cada alteração de código seja verificada e publicada automaticamente.", "GitHub Actions|GitLab CI/CD|Bitbucket Pipelines|CircleCI|Buildkite|Jenkins|TeamCity|Travis CI|Azure DevOps Pipelines|Drone CI|Woodpecker CI|Semaphore|Harness|Argo Workflows"),
  c(65, "Containers", "Empacotar a aplicação com todas as dependências necessárias para executá-la.", "Você quer que o software rode da mesma forma em desenvolvimento e produção.", "Docker|Podman|containerd|LXC|LXD|Buildah|Kaniko|OrbStack|Rancher Desktop|Colima"),
  c(66, "Orquestração de containers", "Executar e gerenciar muitos containers distribuídos.", "O projeto possui muitos serviços e precisa escalar automaticamente.", "Kubernetes|Docker Swarm|Nomad|Amazon ECS|Amazon EKS|Google Kubernetes Engine|Azure Kubernetes Service|K3s|OpenShift|Rancher"),
  c(67, "Kubernetes e gestão de clusters", "Implantar, configurar e administrar aplicações em Kubernetes.", "Sua infraestrutura utiliza clusters Kubernetes.", "Helm|Kustomize|Argo CD|Flux|Rancher|Lens|K9s|OpenLens|Istio|Linkerd|Cilium"),
  c(68, "Infraestrutura como código", "Criar servidores, redes e serviços de nuvem por arquivos de código.", "Você quer reproduzir infraestrutura automaticamente e evitar configuração manual.", "Terraform|OpenTofu|Pulumi|AWS CDK|CloudFormation|Azure Bicep|Google Cloud Deployment Manager|Crossplane|Ansible|Chef|Puppet|Salt"),
  c(69, "Observabilidade e APM", "Monitorar saúde, desempenho e comportamento da aplicação.", "O sistema está em produção e você precisa descobrir lentidão, erros ou gargalos.", "Datadog|New Relic|Dynatrace|Grafana|Prometheus|OpenTelemetry|Honeycomb|Elastic Observability|Splunk|SigNoz|Better Stack|AppSignal|Sematext|SolarWinds"),
  c(70, "Logs", "Registrar eventos e mensagens produzidos por aplicações e servidores.", "Você precisa investigar erros ou entender o que aconteceu dentro do sistema.", "Grafana Loki|Better Stack Logs|Datadog Logs|Elastic Stack|Splunk|Axiom|Papertrail|Logtail|Loggly|Graylog|Fluent Bit|Fluentd|Vector"),
  c(71, "Monitoramento de erros", "Detectar automaticamente erros e exceções da aplicação.", "Você quer saber que algo quebrou antes do usuário reclamar.", "Sentry|Bugsnag|Rollbar|Airbrake|Raygun|AppSignal|Honeybadger|GlitchTip"),
  c(72, "Session replay e debug frontend", "Gravar sessões dos usuários para visualizar o que aconteceu na tela.", "Você precisa entender bugs, dificuldades de navegação ou comportamento real dos usuários.", "LogRocket|FullStory|PostHog Session Replay|Microsoft Clarity|Hotjar|Highlight.io|OpenReplay|Sentry Replay"),
  c(73, "Uptime e synthetic monitoring", "Verificar continuamente se sites e APIs estão funcionando.", "Você precisa ser avisado imediatamente se sua aplicação ficar fora do ar.", "Better Uptime|UptimeRobot|Pingdom|Checkly|Datadog Synthetic Monitoring|Grafana Synthetic Monitoring|StatusCake|Updown.io|Cronitor|Oh Dear"),
  c(74, "Incidentes e on-call", "Organizar resposta da equipe a falhas graves em produção.", "Existem pessoas responsáveis por resolver indisponibilidades e problemas críticos.", "PagerDuty|Opsgenie|incident.io|Rootly|FireHydrant|Better Stack Incident Management|Grafana OnCall|Squadcast|xMatters"),
  c(75, "Status page", "Informar aos usuários se os serviços estão funcionando normalmente.", "Seu produto precisa comunicar incidentes, manutenção ou indisponibilidade.", "Statuspage|Better Stack Status Pages|Instatus|Cachet|OpenStatus|Hyperping|UptimeRobot Status Pages"),
  c(76, "Testes unitários e integração", "Verificar automaticamente se pequenas partes do código funcionam corretamente.", "Você quer impedir que novas alterações quebrem funções já existentes.", "Vitest|Jest|Mocha|AVA|Jasmine|Testing Library|Pytest|unittest|JUnit|TestNG|RSpec|PHPUnit|xUnit|NUnit|Go Test"),
  c(77, "Testes E2E e automação de browser", "Simular um usuário navegando pela aplicação.", "Você precisa testar login, checkout, cadastro e fluxos completos.", "Playwright|Cypress|Selenium|Puppeteer|WebdriverIO|TestCafe|Nightwatch|Robot Framework"),
  c(78, "Testes de API", "Verificar automaticamente endpoints e respostas de APIs.", "O backend possui APIs REST, SOAP ou outros endpoints que precisam ser validados.", "Postman|Bruno|Insomnia|Hoppscotch|Hurl|REST Assured|Karate|SoapUI|Dredd|Schemathesis"),
  c(79, "Testes de carga e performance", "Simular muitos usuários acessando o sistema simultaneamente.", "Você precisa descobrir quantos usuários sua infraestrutura suporta.", "k6|Artillery|JMeter|Locust|Gatling|Vegeta|wrk|Siege|Loader.io|BlazeMeter"),
  c(80, "Testes de browser e dispositivos", "Testar o sistema em diferentes navegadores, celulares e sistemas operacionais.", "Você quer garantir que a aplicação funcione para diferentes usuários e dispositivos.", "BrowserStack|LambdaTest|Sauce Labs|TestingBot|CrossBrowserTesting|Perfecto|Firebase Test Lab|AWS Device Farm"),
  c(81, "Testes visuais", "Detectar alterações inesperadas no visual da interface.", "Você quer impedir que mudanças de código quebrem layouts ou estilos.", "Chromatic|Percy|Applitools|Argos CI|Lost Pixel|BackstopJS|Loki|RegSuit"),
  c(82, "Acessibilidade", "Identificar problemas que dificultam o uso por pessoas com deficiência.", "Você quer tornar a aplicação mais inclusiva e seguir padrões como WCAG.", "axe DevTools|Lighthouse|Pa11y|WAVE|Accessibility Insights|Deque axe-core|Siteimprove|ARC Toolkit|eslint-plugin-jsx-a11y"),
  c(83, "Performance web", "Medir velocidade, carregamento e desempenho de páginas.", "O site está lento ou você quer melhorar experiência, SEO e Core Web Vitals.", "Lighthouse|PageSpeed Insights|WebPageTest|Chrome DevTools|SpeedCurve|Calibre|DebugBear|GTmetrix|Yellow Lab Tools|Bundlephobia"),
  c(84, "Analytics", "Medir visitas, usuários e comportamento dentro do produto.", "Você quer saber quantas pessoas usam seu sistema e como elas chegaram até ele.", "Google Analytics|Plausible|PostHog|Mixpanel|Amplitude|Vercel Analytics|Matomo|Umami|Simple Analytics|Fathom Analytics|Pirsch|Heap|June"),
  c(85, "Product analytics e funnels", "Analisar etapas e ações específicas realizadas dentro do produto.", "Você quer descobrir onde usuários abandonam cadastro, checkout ou onboarding.", "PostHog|Mixpanel|Amplitude|Heap|June|Pendo|Indicative|Countly|Userpilot"),
  c(86, "Heatmaps e comportamento", "Mostrar visualmente onde usuários clicam, rolam e interagem.", "Você quer descobrir quais partes de uma tela chamam atenção ou causam confusão.", "Hotjar|Microsoft Clarity|FullStory|Crazy Egg|Mouseflow|Lucky Orange|Smartlook|Contentsquare"),
  c(87, "Feature flags", "Ativar ou desativar funcionalidades sem publicar código novamente.", "Você quer liberar recursos gradualmente ou apenas para grupos específicos.", "LaunchDarkly|Unleash|Flagsmith|ConfigCat|PostHog Feature Flags|Statsig|DevCycle|Flipt|Harness Feature Flags|GrowthBook|Split"),
  c(88, "A/B testing e experimentação", "Comparar diferentes versões de uma funcionalidade.", "Você quer descobrir qual versão gera mais conversão ou melhor experiência.", "Statsig|GrowthBook|Optimizely|VWO|PostHog Experiments|LaunchDarkly Experimentation|AB Tasty|Adobe Target|Eppo"),
  c(89, "E-mail transacional", "Enviar e-mails automáticos gerados pelo sistema.", "Você precisa enviar confirmação de cadastro, recuperação de senha, recibos e alertas.", "Resend|Postmark|SendGrid|Amazon SES|Mailgun|Brevo|Mailjet|SparkPost|MailerSend|Loops|ZeptoMail"),
  c(90, "E-mail marketing e automação", "Criar campanhas, sequências e automações de marketing por e-mail.", "Você quer nutrir leads, enviar newsletters e recuperar clientes.", "Mailchimp|Brevo|Customer.io|Loops|ConvertKit|ActiveCampaign|HubSpot|Klaviyo|MailerLite|Drip"),
  c(91, "Teste e desenvolvimento de e-mail", "Testar e-mails sem enviá-los para usuários reais.", "Desenvolvedores estão criando templates ou integrações de e-mail.", "Mailtrap|Mailpit|MailHog|Ethereal Email|PreviewMyEmail|Litmus|Email on Acid"),
  c(92, "SMS, WhatsApp e telefonia", "Enviar mensagens, códigos de verificação e chamadas.", "Seu produto utiliza SMS, WhatsApp, telefone ou comunicação direta.", "Twilio|Vonage|Bird|Infobip|MessageBird|Zenvia|Sinch|Plivo|Telnyx|Meta WhatsApp Cloud API|AWS SNS"),
  c(93, "Push notifications", "Enviar notificações diretamente para dispositivos e navegadores.", "Você quer avisar o usuário mesmo quando ele não está dentro do aplicativo.", "OneSignal|Firebase Cloud Messaging|Expo Notifications|Pusher Beams|Airship|Amazon SNS|WonderPush"),
  c(94, "Notificações multicanal", "Gerenciar e-mail, SMS, push e notificações dentro do produto em um único sistema.", "O produto possui vários tipos de comunicação com usuários.", "Novu|Knock|Courier|SuprSend|MagicBell|Engagespot|NotificationAPI"),
  c(95, "Gestão de projetos", "Organizar tarefas, responsáveis, prazos e andamento do desenvolvimento.", "Uma equipe precisa acompanhar o que está sendo construído.", "Linear|Jira|Trello|Asana|ClickUp|Monday.com|GitHub Projects|GitLab Issues|Shortcut|YouTrack|Basecamp|Height"),
  c(96, "Documentação e wikis internas", "Registrar conhecimento, processos e decisões da equipe.", "Você quer evitar que informações importantes fiquem apenas na cabeça das pessoas.", "Notion|Confluence|Obsidian|Coda|Slite|Outline|BookStack|Wiki.js|Nuclino|GitBook"),
  c(97, "API clients", "Enviar requisições para APIs manualmente.", "Você está desenvolvendo ou testando endpoints.", "Postman|Insomnia|Bruno|Hoppscotch|HTTPie|Yaak|RapidAPI Client|Thunder Client|REST Client"),
  c(98, "API design e documentação", "Definir e documentar como uma API funciona.", "Outros desenvolvedores ou sistemas precisam consumir sua API.", "OpenAPI|Swagger|Swagger UI|Redocly|Stoplight|Scalar|ReadMe|Mintlify|Fern|Speakeasy|Apidog"),
  c(99, "GraphQL", "Criar APIs onde o cliente escolhe exatamente quais dados deseja receber.", "O frontend possui consultas complexas ou várias combinações de dados.", "GraphQL|Apollo GraphQL|GraphQL Yoga|GraphiQL|Hasura|Mercurius|urql|Relay|The Guild|GraphQL Code Generator"),
  c(100, "RPC e APIs type-safe", "Criar comunicação direta entre serviços ou frontend/backend com tipos compartilhados.", "Você quer APIs rápidas, fortemente tipadas ou comunicação entre microsserviços.", "gRPC|ConnectRPC|Buf|tRPC|Twirp|Apache Thrift|JSON-RPC|Dubbo"),
  c(101, "API gateways", "Controlar e distribuir acesso a várias APIs.", "Você possui múltiplos serviços e precisa centralizar autenticação, rate limiting e roteamento.", "Kong|Tyk|Apache APISIX|AWS API Gateway|Azure API Management|Google Cloud API Gateway|KrakenD|Traefik|NGINX|Envoy|Zuplo|Gravitee"),
  c(102, "API mocking", "Criar APIs falsas para desenvolvimento e testes.", "O frontend precisa avançar antes que o backend esteja pronto.", "Mockoon|WireMock|Beeceptor|MockServer|Prism|MSW|JSON Server|Requestly"),
  c(103, "Busca interna", "Criar mecanismos de busca dentro do produto.", "Usuários precisam pesquisar produtos, documentos, usuários ou conteúdos rapidamente.", "Algolia|Meilisearch|Typesense|Elasticsearch|OpenSearch|Apache Solr|Vespa|Sonic|ZincSearch|Manticore Search|Quickwit"),
  c(104, "CMS e headless CMS", "Gerenciar textos, páginas, imagens e conteúdos sem alterar o código.", "Pessoas não técnicas precisam editar conteúdo do site ou aplicativo.", "Sanity|Strapi|Contentful|Directus|Payload CMS|Hygraph|Storyblok|Prismic|DatoCMS|Ghost|WordPress|KeystoneJS|TinaCMS|Builder.io|Craft CMS|Umbraco|Drupal"),
  c(105, "Segurança — SAST e análise de código", "Encontrar vulnerabilidades analisando o código-fonte.", "Você quer identificar problemas de segurança antes da aplicação chegar à produção.", "Semgrep|SonarQube|SonarCloud|CodeQL|Snyk Code|Checkmarx|Veracode|Fortify|Codacy|DeepSource"),
  c(106, "Segurança — dependências e supply chain", "Detectar bibliotecas vulneráveis e riscos em dependências externas.", "Seu projeto utiliza pacotes npm, PyPI, Maven, NuGet ou outras dependências.", "Snyk Open Source|Dependabot|Renovate|Socket|Mend|OWASP Dependency-Check|Trivy|Grype|Syft|OSV-Scanner"),
  c(107, "Segurança — DAST e pentest web", "Testar a aplicação pronta procurando vulnerabilidades externas.", "Você quer simular ataques e descobrir falhas reais em produção ou homologação.", "OWASP ZAP|Burp Suite|Nuclei|Nikto|Acunetix|Invicti|Arachni|Wapiti"),
  c(108, "Segurança de containers e cloud", "Verificar configurações e vulnerabilidades na infraestrutura.", "O projeto utiliza Docker, Kubernetes ou nuvem.", "Trivy|Grype|Clair|Falco|Kubescape|Kube-bench|Checkov|Terrascan|Prowler|ScoutSuite|Wiz|Orca Security"),
  c(109, "Secrets e configuração", "Guardar senhas, tokens, chaves de API e variáveis sensíveis.", "A aplicação precisa utilizar credenciais que não podem aparecer no código.", "HashiCorp Vault|Doppler|Infisical|1Password Secrets Automation|AWS Secrets Manager|Google Secret Manager|Azure Key Vault|SOPS|Sealed Secrets|External Secrets Operator|Akeyless"),
  c(110, "CAPTCHA, anti-bot e abuso", "Diferenciar usuários reais de bots e bloquear abuso automatizado.", "Existem formulários públicos, cadastro, login, votação ou ações vulneráveis a bots.", "Cloudflare Turnstile|Google reCAPTCHA|hCaptcha|Friendly Captcha|Arkose Labs|Fingerprint|Arcjet"),
  c(111, "WAF, CDN security e DDoS", "Proteger sites e APIs contra ataques e tráfego malicioso.", "Sua aplicação pública precisa de proteção contra DDoS e ataques web.", "Cloudflare|AWS WAF|AWS Shield|Fastly|Akamai|Imperva|Sucuri|Google Cloud Armor|Azure Web Application Firewall"),
  c(112, "Lint, format e qualidade de código", "Detectar problemas de código e manter estilo consistente.", "Você quer evitar erros simples e padronizar código entre desenvolvedores.", "ESLint|Biome|Prettier|Stylelint|Ruff|Black|mypy|Pylint|Flake8|PHPStan|Psalm|RuboCop|golangci-lint|Clippy|SonarQube|Codacy|DeepSource"),
  c(113, "IDEs e editores", "Ambiente onde desenvolvedores escrevem e editam código.", "Basicamente em qualquer projeto de programação.", "Visual Studio Code|Visual Studio|IntelliJ IDEA|WebStorm|PyCharm|Rider|GoLand|RubyMine|PhpStorm|Android Studio|Xcode|Neovim|Vim|Zed|Sublime Text|Eclipse|NetBeans|Fleet"),
  c(114, "Terminais", "Executar comandos, scripts e ferramentas do sistema.", "Desenvolvedores precisam interagir diretamente com ambiente, Git, servidores e pacotes.", "Warp|Ghostty|iTerm2|Windows Terminal|Kitty|Alacritty|WezTerm|Tabby|Hyper|Rio"),
  c(115, "Ambientes de desenvolvimento na nuvem", "Disponibilizar computador e ambiente de programação pelo navegador ou nuvem.", "Você quer desenvolver sem configurar uma máquina local.", "GitHub Codespaces|Gitpod|Replit|StackBlitz|CodeSandbox|Coder|Daytona|DevPod|Dev Containers"),
  c(116, "IA para programação", "Utilizar IA para escrever, revisar, explicar e modificar código.", "Você quer acelerar o desenvolvimento ou utilizar agentes capazes de implementar funcionalidades.", "GitHub Copilot|Cursor|Claude Code|OpenAI Codex|Gemini CLI|Gemini Code Assist|Windsurf|Devin|Cline|Aider|OpenCode|Continue|Amazon Q Developer|JetBrains AI Assistant|Junie|Kiro|Tabnine|Sourcegraph Cody|Qodo|CodeRabbit|Greptile|Bito"),
  c(117, "Code review", "Revisar mudanças no código antes de integrá-las ao projeto.", "Uma equipe trabalha com pull requests ou merge requests.", "GitHub Pull Requests|GitLab Merge Requests|CodeRabbit|Qodo Merge|Greptile|Graphite|Reviewable|Codacy|DeepSource|SonarCloud"),
  c(118, "Mobile — multiplataforma", "Criar aplicativos para Android e iOS com uma base de código compartilhada.", "Você quer lançar aplicativo em várias plataformas reduzindo duplicação de desenvolvimento.", "React Native|Expo|Flutter|Ionic|Capacitor|NativeScript|.NET MAUI|Kotlin Multiplatform|Unity"),
  c(119, "iOS", "Desenvolver aplicativos nativos para iPhone, iPad e ecossistema Apple.", "O projeto precisa de aplicativo especificamente para dispositivos Apple.", "Swift|SwiftUI|UIKit|Xcode|CocoaPods|Swift Package Manager|TestFlight|Fastlane"),
  c(120, "Android", "Desenvolver aplicativos nativos para Android.", "O projeto precisa de integração completa com dispositivos Android.", "Kotlin|Jetpack Compose|Android Studio|Java|Gradle|Firebase|Google Play Console|Fastlane"),
  c(121, "Desktop", "Criar aplicativos instaláveis para Windows, macOS e Linux.", "O produto precisa funcionar como programa de computador e não apenas no navegador.", "Electron|Tauri|Flutter Desktop|.NET MAUI|Qt|GTK|Avalonia|Wails|Neutralinojs|NW.js|JavaFX"),
  c(122, "PWA", "Transformar aplicações web em experiências semelhantes a aplicativos instaláveis.", "Você quer recursos offline, instalação e notificações sem criar apps nativos separados.", "Workbox|Vite PWA|Serwist|PWABuilder|Capacitor|Lighthouse"),
  c(123, "Package managers — JavaScript", "Instalar e controlar bibliotecas utilizadas em projetos JavaScript.", "Seu projeto possui dependências npm.", "npm|pnpm|Yarn|Bun"),
  c(124, "Package managers — outras linguagens", "Instalar bibliotecas e dependências de diferentes ecossistemas.", "Seu projeto utiliza Python, Java, .NET, PHP, Ruby, Rust, Go ou Swift.", "pip|Poetry|uv|Conda|Maven|Gradle|NuGet|Composer|Bundler|Cargo|Go Modules|CocoaPods|Swift Package Manager|Homebrew"),
  c(125, "Monorepos", "Organizar vários aplicativos e bibliotecas dentro do mesmo repositório.", "Frontend, backend, mobile e pacotes compartilham código entre si.", "Turborepo|Nx|Lerna|Rush|Bazel|Pants|Moonrepo|Lage"),
  c(126, "Package registries", "Armazenar e distribuir bibliotecas e pacotes de software.", "Sua equipe publica pacotes públicos ou privados.", "npm Registry|GitHub Packages|GitLab Package Registry|JFrog Artifactory|Sonatype Nexus|PyPI|Maven Central|NuGet Gallery|RubyGems|crates.io|Packagist"),
  c(127, "Container registries", "Armazenar imagens Docker e outros containers.", "Sua infraestrutura faz deploy utilizando containers.", "Docker Hub|GitHub Container Registry|GitLab Container Registry|Amazon ECR|Google Artifact Registry|Azure Container Registry|Quay|JFrog Artifactory|Harbor"),
  c(128, "Automação e iPaaS", "Conectar sistemas e automatizar processos sem desenvolver toda a integração manualmente.", "Você quer conectar CRM, e-mail, banco, APIs, planilhas e outras ferramentas.", "Zapier|Make|n8n|Pipedream|Activepieces|Workato|Tray.ai|IFTTT|Parabola|Node-RED|Windmill"),
  c(129, "Internacionalização (i18n)", "Preparar interfaces para diferentes idiomas e formatos regionais.", "O produto será utilizado em mais de um idioma ou país.", "i18next|FormatJS|react-intl|next-intl|Lingui|Vue I18n|Angular Localize|Paraglide JS"),
  c(130, "Tradução e localização", "Gerenciar tradução de textos do produto entre idiomas.", "Tradutores e equipes precisam colaborar na localização do software.", "Crowdin|Lokalise|Phrase|Transifex|Tolgee|Weblate|POEditor|Localazy|Smartling"),
  c(131, "Documentação para desenvolvedores", "Criar documentação técnica pública ou interna.", "Você possui API, biblioteca, SDK ou produto que precisa explicar como funciona.", "Docusaurus|Nextra|Mintlify|GitBook|ReadMe|MkDocs|Material for MkDocs|VitePress|Astro Starlight|Fern|Scalar|Sphinx|Jekyll|Hugo"),
  c(132, "Data integration, ETL e ELT", "Transportar dados entre bancos, APIs e sistemas.", "Informações de várias fontes precisam ser centralizadas para análise ou processamento.", "Airbyte|Fivetran|Meltano|Stitch|Hevo Data|Estuary Flow|Airflow|Dagster|Prefect|Debezium|Kafka Connect"),
  c(133, "Transformação de dados", "Limpar, organizar e transformar dados brutos.", "Informações precisam ser preparadas para relatórios, BI ou machine learning.", "dbt|Dataform|SQLMesh|Coalesce|Apache Spark|Polars|Pandas"),
  c(134, "Data warehouses e lakehouses", "Centralizar grandes volumes de dados para análise.", "A empresa possui dados vindos de muitos sistemas e precisa analisá-los em conjunto.", "Snowflake|Google BigQuery|Amazon Redshift|Databricks|Microsoft Fabric|Azure Synapse|ClickHouse|Apache Iceberg|Delta Lake"),
  c(135, "Business intelligence e dashboards", "Criar relatórios e dashboards visuais sobre dados empresariais.", "Gestores precisam acompanhar vendas, usuários, receita e indicadores.", "Power BI|Tableau|Looker|Metabase|Apache Superset|Grafana|Redash|Lightdash|Evidence|Preset|Mode"),
  c(136, "CDN", "Distribuir arquivos do site por servidores próximos dos usuários.", "Você quer reduzir tempo de carregamento global.", "Cloudflare|CloudFront|Fastly|Akamai|Bunny CDN|Google Cloud CDN|Azure Front Door|KeyCDN"),
  c(137, "DNS e domínios", "Gerenciar domínios e apontá-los para servidores e serviços.", "Você precisa conectar domínio como empresa.com à aplicação.", "Cloudflare DNS|Amazon Route 53|Google Cloud DNS|Azure DNS|Namecheap|GoDaddy|Porkbun|Gandi|Squarespace Domains"),
  c(138, "Reverse proxy e load balancing", "Distribuir requisições entre servidores e controlar tráfego.", "Existem várias instâncias, APIs ou serviços atrás do mesmo domínio.", "NGINX|Caddy|Traefik|HAProxy|Envoy|Apache HTTP Server|Cloudflare|AWS Elastic Load Balancing"),
  c(139, "Túneis e desenvolvimento local", "Expor temporariamente um servidor local para a internet.", "Você precisa testar webhooks ou mostrar seu ambiente local para outra pessoa.", "ngrok|Cloudflare Tunnel|LocalTunnel|Tailscale Funnel|Pinggy|localhost.run|Serveo"),
  c(140, "VPN e zero trust", "Criar redes privadas e restringir acesso a sistemas internos.", "Bancos, dashboards ou ambientes administrativos não devem ficar públicos.", "Tailscale|Cloudflare Zero Trust|ZeroTier|WireGuard|OpenVPN|Teleport|Boundary"),
  c(141, "Mapas e geolocalização", "Mostrar mapas e posições geográficas dentro da aplicação.", "Seu produto utiliza localização, entregas, imóveis, transporte ou pontos de interesse.", "Google Maps Platform|Mapbox|MapLibre|HERE Technologies|TomTom|OpenStreetMap|Leaflet|OpenLayers|Geoapify|Radar|LocationIQ|Esri ArcGIS"),
  c(142, "Endereços e geocoding", "Converter endereço em coordenadas ou coordenadas em endereço.", "Usuários digitam locais e o sistema precisa encontrá-los no mapa.", "Google Geocoding API|Mapbox Geocoding|HERE Geocoding|Radar|Geoapify|LocationIQ|Nominatim|Smarty|Loqate"),
  c(143, "Formulários como serviço", "Criar e receber formulários sem desenvolver backend próprio.", "Você precisa rapidamente de contato, pesquisa, cadastro ou coleta de informações.", "Typeform|Tally|Jotform|Formspree|Formcarry|Basin|Getform|Fillout|Paperform|Formspark"),
  c(144, "PDF e geração de documentos", "Criar, editar ou converter PDFs e documentos automaticamente.", "O sistema precisa gerar propostas, contratos, recibos, boletos ou relatórios.", "PDFKit|jsPDF|PDF-lib|Puppeteer|Playwright|React-pdf|Gotenberg|DocRaptor|PDFMonkey|PSPDFKit|Apryse|PDF.co|CloudConvert"),
  c(145, "Assinatura eletrônica", "Permitir assinatura digital de documentos.", "O produto trabalha com contratos, propostas, autorizações ou termos.", "DocuSign|Dropbox Sign|Adobe Acrobat Sign|PandaDoc|SignNow|BoldSign|Documenso|SignWell"),
  c(146, "E-commerce", "Construir lojas, catálogos, pedidos e venda de produtos online.", "O projeto é loja virtual, marketplace ou possui catálogo comercial.", "Shopify|WooCommerce|Medusa|Saleor|Vendure|Commerce Layer|BigCommerce|Magento|Sylius|Shopware|Swell"),
  c(147, "Carrinho e checkout", "Gerenciar carrinho e etapa final de compra.", "Usuários selecionam itens e precisam concluir o pagamento.", "Stripe Checkout|Shopify Checkout|Paddle Checkout|Lemon Squeezy|Snipcart|Medusa|Saleor"),
  c(148, "Suporte ao cliente", "Organizar atendimento, tickets, chat e ajuda ao usuário.", "Clientes precisam falar com sua equipe para resolver problemas.", "Intercom|Zendesk|Freshdesk|Crisp|Help Scout|Front|Gorgias|Tidio|Chatwoot|LiveChat"),
  c(149, "Chat e mensageria para produto", "Adicionar chat entre usuários dentro da própria aplicação.", "Seu produto possui mensagens privadas, grupos ou comunicação em tempo real.", "Stream|Sendbird|Twilio Conversations|CometChat|TalkJS|PubNub|Ably|Pusher|Firebase|Supabase Realtime"),
  c(150, "Feedback de usuários", "Coletar sugestões, problemas e pedidos de funcionalidades.", "Você quer saber o que os clientes desejam que seja desenvolvido.", "Canny|Productboard|UserVoice|Nolt|Featurebase|Savio|Frill|Fider"),
  c(151, "Onboarding de usuários", "Ensinar novos usuários a utilizar o produto.", "A aplicação possui recursos que precisam ser apresentados passo a passo.", "Userflow|Appcues|Userpilot|Pendo|Chameleon|Product Fruits|Intercom|Intro.js|Shepherd.js|Driver.js"),
  c(152, "Changelogs e release notes", "Comunicar novidades e alterações do produto.", "Você lança atualizações frequentes e quer informar usuários.", "Headway|Beamer|Featurebase|Canny|Changes.page|GitHub Releases|GitLab Releases|Release Please"),
  c(153, "Privacidade, cookies e consentimento", "Gerenciar autorização do usuário para cookies e coleta de dados.", "O produto precisa cumprir LGPD, GDPR ou outras leis de privacidade.", "OneTrust|Cookiebot|Termly|Iubenda|Osano|CookieYes|Didomi|Usercentrics|ConsentManager"),
  c(154, "Low-code e no-code", "Criar aplicações e páginas com pouco ou nenhum código.", "Você quer validar uma ideia rapidamente ou permitir desenvolvimento por pessoas não técnicas.", "Webflow|Bubble|FlutterFlow|Softr|Glide|Adalo|WeWeb|Wappler|Draftbit|Framer|Dorik"),
  c(155, "Ferramentas internas e admin panels", "Criar dashboards administrativos e sistemas internos rapidamente.", "Sua equipe precisa gerenciar usuários, pedidos, dados ou operações internas.", "Retool|Appsmith|Budibase|ToolJet|Superblocks|UI Bakery|Forest Admin|Refine|React Admin|Directus|NocoBase"),
  c(156, "Banco e backend no-code", "Criar bancos, APIs e backend sem programar tudo manualmente.", "Projetos no-code ou MVPs precisam de backend rápido.", "Xano|Backendless|Supabase|Firebase|Airtable|Baserow|NocoDB|Directus|Appwrite"),
  c(157, "AI app builders e vibe coding", "Criar aplicações completas descrevendo em linguagem natural o que você deseja.", "Você quer gerar rapidamente frontend, backend ou protótipos com ajuda intensa de IA.", "v0|Lovable|Bolt|Replit Agent|Firebase Studio|Figma Make|Builder.io|Tempo Labs|Databutton|Softgen|Emergent|Marblism"),
  c(158, "Automação de browser", "Controlar navegadores automaticamente através de código.", "O sistema precisa preencher formulários, navegar em sites, testar páginas ou executar tarefas repetitivas.", "Playwright|Puppeteer|Selenium|Browserbase|Browserless|Stagehand|Skyvern|Browser Use|Hyperbrowser"),
  c(159, "Web scraping e crawling", "Extrair dados automaticamente de páginas da internet.", "Você precisa coletar preços, produtos, notícias ou informações públicas de sites.", "Apify|Firecrawl|Crawlee|ScrapingBee|ScraperAPI|Bright Data|Zyte|Oxylabs|Diffbot|Scrapy|Beautiful Soup|Cheerio"),
  c(160, "Proxies para scraping", "Alterar IP utilizado para acessar páginas durante coleta de dados.", "Scrapers precisam acessar grandes quantidades de páginas distribuindo requisições.", "Bright Data|Oxylabs|Smartproxy|ScraperAPI|Webshare|IPRoyal|SOAX|NetNut"),
  c(161, "SEO para desenvolvedores", "Melhorar visibilidade do site em mecanismos de busca.", "O produto depende de tráfego orgânico do Google ou Bing.", "Google Search Console|Bing Webmaster Tools|Ahrefs|Semrush|Screaming Frog|Sitebulb|Lighthouse|PageSpeed Insights|Schema.org|Rich Results Test"),
  c(162, "Componentes de tabelas e data grids", "Exibir grandes quantidades de dados em tabelas avançadas.", "Dashboards precisam de filtros, ordenação, edição ou milhares de registros.", "TanStack Table|AG Grid|Handsontable|MUI Data Grid|React Data Grid|DataTables|PrimeReact DataTable|Glide Data Grid"),
  c(163, "Editores rich text", "Criar áreas de edição semelhante a Word, Notion ou Google Docs.", "Usuários precisam escrever textos formatados dentro do produto.", "TipTap|Lexical|Slate|ProseMirror|Quill|CKEditor|TinyMCE|Editor.js|Milkdown|BlockNote"),
  c(164, "Editores de código embutidos", "Colocar editor de código dentro da própria aplicação.", "Você está criando IDE online, playground, editor SQL ou plataforma educacional.", "Monaco Editor|CodeMirror|Ace Editor|Shiki|Prism|Highlight.js"),
  c(165, "Colaboração em tempo real e CRDT", "Permitir que várias pessoas editem o mesmo conteúdo simultaneamente.", "Você está criando algo semelhante a Google Docs, Figma ou Notion colaborativo.", "Yjs|Automerge|Liveblocks|PartyKit|ElectricSQL|Replicache|PowerSync|Jazz|InstantDB"),
  c(166, "Local-first e offline-first", "Permitir uso mesmo sem internet e sincronizar depois.", "A aplicação precisa continuar funcionando offline ou com conexão instável.", "ElectricSQL|RxDB|Replicache|PowerSync|PouchDB|WatermelonDB|Dexie.js|TinyBase|Jazz|Legend-State"),
  c(167, "Browser storage", "Armazenar informações diretamente no navegador do usuário.", "Você precisa salvar preferências, cache ou dados offline no dispositivo.", "IndexedDB|Dexie.js|localForage|idb|LocalStorage|SessionStorage|OPFS"),
  c(168, "Web3 e blockchain", "Criar aplicações baseadas em blockchain, tokens e contratos inteligentes.", "O projeto envolve criptomoedas, NFTs, Web3 ou aplicações descentralizadas.", "Ethereum|Solana|Polygon|Base|Arbitrum|Optimism|Hardhat|Foundry|thirdweb|Alchemy|Infura|QuickNode|wagmi|viem|ethers.js"),
  c(169, "Machine learning", "Criar e treinar modelos capazes de aprender com dados.", "Você precisa de previsão, classificação, reconhecimento ou inteligência baseada em dados.", "PyTorch|TensorFlow|JAX|scikit-learn|Keras|XGBoost|LightGBM|CatBoost|Hugging Face Transformers|ONNX Runtime"),
  c(170, "MLOps", "Gerenciar treinamento, versões e implantação de modelos de machine learning.", "Uma empresa possui modelos de ML em produção e precisa manter todo o ciclo de vida.", "MLflow|Weights & Biases|Kubeflow|Vertex AI|SageMaker|Azure Machine Learning|Databricks|DVC|ClearML|Neptune.ai"),
  c(171, "Notebooks e data science", "Explorar dados e executar código de forma interativa.", "Cientistas de dados precisam experimentar análises e modelos.", "Jupyter|Google Colab|Kaggle Notebooks|Databricks Notebooks|Deepnote|Hex|Marimo|Observable"),
  c(172, "OCR e document AI", "Extrair texto e informações estruturadas de documentos e imagens.", "O sistema recebe notas fiscais, documentos, PDFs, contratos ou fotos.", "Google Document AI|Azure AI Document Intelligence|Amazon Textract|Tesseract|Mindee|Nanonets|Veryfi|Rossum|Unstructured"),
  c(173, "Speech-to-text", "Converter áudio e fala em texto.", "Você precisa transcrever reuniões, chamadas, vídeos ou comandos de voz.", "OpenAI Whisper|Deepgram|AssemblyAI|Google Speech-to-Text|Azure Speech|Amazon Transcribe|Speechmatics|Gladia"),
  c(174, "Text-to-speech", "Converter texto em fala artificial.", "Seu produto possui narração, acessibilidade ou assistentes de voz.", "ElevenLabs|Cartesia|PlayHT|OpenAI TTS|Google Cloud Text-to-Speech|Azure Speech|Amazon Polly|Deepgram Aura"),
  c(175, "Imagem com IA", "Gerar ou editar imagens usando inteligência artificial.", "O produto precisa criar artes, ilustrações, mockups ou conteúdo visual automaticamente.", "OpenAI Images|Midjourney|Stable Diffusion|Flux|Adobe Firefly|Ideogram|Leonardo AI|Replicate|Fal.ai"),
  c(176, "Vídeo com IA", "Gerar vídeos a partir de texto, imagens ou outros vídeos.", "Você quer criar publicidade, conteúdo, animações ou vídeos automáticos.", "Sora|Runway|Google Veo|Kling|Luma Dream Machine|Pika|HeyGen|Synthesia"),
  c(177, "Busca e pesquisa para agentes de IA", "Permitir que agentes de IA pesquisem informações atuais na internet.", "A IA precisa acessar conteúdos externos e atualizados.", "Exa|Tavily|Perplexity API|Brave Search API|SerpAPI|Serper|Google Custom Search JSON API|Bing Search API"),
  c(178, "Sandboxes para execução de código e IA", "Executar código de forma isolada e segura.", "Uma IA ou usuário pode gerar código que precisa ser executado sem colocar seu servidor em risco.", "E2B|Daytona|Modal|CodeSandbox SDK|Docker|Firecracker|Fly Machines|Cloudflare Workers"),
  c(179, "Licenças e open-source compliance", "Verificar licenças de bibliotecas utilizadas no projeto.", "Empresas precisam garantir que dependências open-source podem ser usadas legalmente.", "FOSSA|Mend|Snyk|Black Duck|ScanCode|ORT|Licensee|ClearlyDefined"),
  c(180, "Backup e disaster recovery", "Criar cópias de segurança e restaurar sistemas após falhas.", "Dados não podem ser perdidos em caso de erro, ataque ou falha de infraestrutura.", "Veeam|Restic|BorgBackup|Duplicati|Velero|AWS Backup|Google Cloud Backup and DR|Azure Backup|pgBackRest|WAL-G|Litestream"),
  c(181, "Gestão de configuração e remote config", "Alterar comportamentos da aplicação remotamente sem novo deploy.", "Você precisa modificar configurações ou recursos rapidamente.", "LaunchDarkly|ConfigCat|Firebase Remote Config|AWS AppConfig|Azure App Configuration|Unleash|Flagsmith|Doppler"),
  c(182, "Service mesh", "Controlar comunicação entre microsserviços.", "A infraestrutura possui muitos serviços distribuídos e precisa de segurança, observabilidade e roteamento.", "Istio|Linkerd|Consul Service Mesh|Cilium Service Mesh|Kuma|Open Service Mesh"),
  c(183, "Service discovery", "Permitir que serviços encontrem outros serviços automaticamente.", "Instâncias de microsserviços mudam constantemente dentro da infraestrutura.", "Consul|etcd|ZooKeeper|Eureka|CoreDNS|Kubernetes Services"),
  c(184, "Event streaming", "Processar grandes fluxos contínuos de eventos.", "Milhares ou milhões de eventos precisam circular entre sistemas em tempo real.", "Apache Kafka|Redpanda|Apache Pulsar|NATS JetStream|Amazon Kinesis|Google Pub/Sub|Azure Event Hubs|Confluent Cloud"),
  c(185, "Email template e componentes", "Criar layouts reutilizáveis para e-mails.", "Você precisa produzir e-mails bonitos e compatíveis com diferentes clientes.", "React Email|MJML|Maizzle|Foundation for Emails|Cerberus|Postcards"),
  c(186, "Calendários e agendamento", "Criar sistemas de agenda, horários e reservas.", "O produto possui reuniões, consultas, reservas ou disponibilidade.", "Cal.com|Calendly|Nylas|Cronofy|Google Calendar API|Microsoft Graph Calendar|FullCalendar|React Big Calendar"),
  c(187, "Integração com e-mail e calendário", "Conectar Gmail, Outlook e calendários à aplicação.", "Seu produto precisa ler, enviar ou sincronizar e-mails e eventos dos usuários.", "Nylas|Merge|Paragon|Apideck|Unified.to|Microsoft Graph|Google Workspace APIs"),
  c(188, "Unified APIs e integrações B2B", "Conectar vários softwares empresariais utilizando uma única API padronizada.", "Seu SaaS precisa integrar CRMs, ERPs, RH ou outras ferramentas dos clientes.", "Merge|Paragon|Apideck|Unified.to|Nango|Pipedream Connect|Tray Embedded|Workato Embedded"),
  c(189, "File conversion", "Converter arquivos entre diferentes formatos.", "Usuários enviam DOCX, PDF, imagem, áudio ou vídeo e o sistema precisa transformar o arquivo.", "CloudConvert|ConvertAPI|PDF.co|Zamzar API|Aspose|LibreOffice Headless|Pandoc|FFmpeg|ImageMagick"),
  c(190, "Processamento de imagem", "Redimensionar, cortar, converter e manipular imagens.", "Imagens precisam ser processadas automaticamente pelo backend.", "Sharp|ImageMagick|GraphicsMagick|libvips|OpenCV|Jimp|Pillow"),
  c(191, "Processamento de vídeo e áudio", "Converter, cortar, comprimir ou transformar arquivos multimídia.", "Usuários enviam vídeos ou áudios que precisam ser preparados para reprodução.", "FFmpeg|GStreamer|HandBrake|Mux|AWS MediaConvert|Cloudinary|Bunny Stream"),
  c(192, "Geradores de dados e mock data", "Gerar dados fictícios para desenvolvimento.", "Você precisa testar a aplicação sem utilizar dados reais de clientes.", "Faker|Mockaroo|Chance.js|Fishery|Factory Bot|Factory Boy|Bogus"),
  c(193, "Data validation e schemas", "Definir formato esperado dos dados e verificar se estão corretos.", "APIs e formulários recebem dados externos e precisam impedir formatos inválidos.", "Zod|Valibot|Joi|Yup|Ajv|JSON Schema|Protocol Buffers|Pydantic|Marshmallow"),
  c(194, "OpenAPI code generation", "Gerar clientes, SDKs e tipos automaticamente a partir de uma API.", "Você possui especificação OpenAPI e quer reduzir código manual de integração.", "OpenAPI Generator|Swagger Codegen|Orval|Hey API|NSwag|Kiota|Speakeasy|Fern"),
  c(195, "Atualização automática de dependências", "Atualizar dependências automaticamente.", "Você quer manter bibliotecas atualizadas e reduzir vulnerabilidades.", "Renovate|Dependabot|Snyk"),
  c(196, "Git clients", "Utilizar Git através de interface gráfica.", "Desenvolvedores preferem visualizar commits, branches e conflitos sem usar apenas terminal.", "GitHub Desktop|GitKraken|Sourcetree|Tower|Fork|SmartGit|LazyGit|Sublime Merge"),
  c(197, "Diagramas e arquitetura", "Representar visualmente sistemas, serviços e fluxos.", "Você precisa explicar arquitetura, banco, APIs ou comunicação entre componentes.", "Mermaid|PlantUML|Structurizr|Lucidchart|Draw.io|Excalidraw|Miro|Whimsical|Eraser|D2|Graphviz"),
  c(198, "Architecture decision records", "Registrar decisões técnicas importantes e seus motivos.", "Uma equipe precisa lembrar por que determinadas escolhas arquiteturais foram feitas.", "Log4brains|ADR Tools|MADR|Structurizr|Backstage TechDocs|Notion|Confluence"),
  c(199, "Developer portals e service catalogs", "Centralizar informações sobre serviços, APIs, equipes e infraestrutura.", "A empresa possui muitos microsserviços e equipes de engenharia.", "Backstage|Port|Cortex|OpsLevel|Atlassian Compass|Roadie|Configure8"),
  c(200, "DevEx e engineering analytics", "Medir produtividade e eficiência das equipes de desenvolvimento.", "Líderes de engenharia querem identificar gargalos em entregas e processos.", "LinearB|Swarmia|Jellyfish|DX|Athenian|Haystack|Faros AI|Sleuth"),
  c(201, "Release management", "Organizar e automatizar versões publicadas do software.", "O produto possui releases frequentes e precisa de processo confiável.", "Changesets|semantic-release|Release Please|GoReleaser|GitVersion|GitHub Releases|GitLab Releases|Octopus Deploy"),
  c(202, "Versionamento semântico e changelog", "Padronizar números de versão e registrar alterações.", "Você publica bibliotecas, APIs ou aplicações versionadas.", "Semantic Versioning|Conventional Commits|Commitizen|Commitlint|Changesets|semantic-release|Standard Version|Conventional Changelog"),
  c(203, "Feature requests e roadmap", "Organizar funcionalidades solicitadas e planejamento futuro do produto.", "Clientes enviam sugestões e a equipe precisa priorizar o roadmap.", "Canny|Productboard|Featurebase|Aha!|Roadmunk|Frill|Nolt|UserVoice"),
  c(204, "CRM e customer data para produtos", "Organizar clientes, leads, vendas e relacionamento comercial.", "A empresa possui processo comercial e acompanhamento de clientes.", "HubSpot|Salesforce|Attio|Pipedrive|Close|Segment|RudderStack|Customer.io"),
  c(205, "Customer data platform (CDP)", "Centralizar eventos e informações de clientes vindos de várias fontes.", "Marketing, produto e analytics precisam trabalhar com os mesmos dados.", "Segment|RudderStack|mParticle|Tealium|Snowplow|Jitsu|Hightouch"),
  c(206, "Reverse ETL", "Enviar dados do data warehouse de volta para ferramentas comerciais.", "Informações de BigQuery ou Snowflake precisam aparecer em CRM, marketing ou suporte.", "Hightouch|Census|Polytomic|RudderStack|Grouparoo"),
  c(207, "Event tracking", "Registrar ações realizadas pelos usuários.", "Você quer saber quem clicou, comprou, cadastrou ou utilizou determinada funcionalidade.", "Segment|RudderStack|Snowplow|PostHog|Amplitude|Mixpanel|Jitsu"),
  c(208, "Email verification", "Verificar se um endereço de e-mail realmente existe ou é válido.", "Você quer evitar cadastros falsos e reduzir e-mails devolvidos.", "ZeroBounce|NeverBounce|Hunter|Kickbox|Abstract API|Mailboxlayer|Emailable"),
  c(209, "Phone verification e OTP", "Confirmar números de telefone utilizando códigos temporários.", "Cadastro ou login precisa de confirmação por SMS ou telefone.", "Twilio Verify|Firebase Phone Auth|Vonage Verify|Sinch Verification|Infobip|Auth0|Clerk|Stytch"),
  c(210, "Identity verification e KYC", "Confirmar identidade real de uma pessoa através de documentos e biometria.", "Fintechs, marketplaces ou serviços regulados precisam verificar usuários.", "Stripe Identity|Persona|Sumsub|Veriff|Onfido|Trulioo|Jumio"),
  c(211, "Fraud detection", "Identificar transações e comportamentos suspeitos.", "Seu produto possui pagamentos, contas ou ações com risco de fraude.", "Stripe Radar|Sift|Fingerprint|SEON|Riskified|Forter|Arkose Labs|DataDome"),
  c(212, "Bot protection", "Bloquear bots avançados e automações maliciosas.", "Seu sistema sofre scraping abusivo, ataques de bots ou criação automatizada de contas.", "Cloudflare Bot Management|DataDome|Kasada|HUMAN Security|Imperva Advanced Bot Protection|Arkose Labs"),
  c(213, "Passwordless e passkeys", "Permitir login sem senha tradicional.", "Você quer melhorar segurança e experiência usando passkeys, links mágicos ou biometria.", "Clerk|Auth0|Stytch|Descope|WorkOS|Corbado|Hanko|Passage|WebAuthn"),
  c(214, "Notification infrastructure", "Centralizar regras e entrega de notificações da aplicação.", "O sistema envia muitos tipos de notificações para diferentes canais.", "Novu|Knock|Courier|SuprSend|MagicBell|Engagespot|NotificationAPI"),
  c(215, "Search analytics", "Medir o que usuários pesquisam e quais resultados recebem.", "Você quer melhorar a qualidade da busca interna do produto.", "Algolia Analytics|Searchkit|Elastic Analytics|Meilisearch Analytics|Typesense Analytics"),
  c(216, "Static site generators", "Gerar páginas HTML prontas antes do usuário acessá-las.", "Você cria blogs, documentação, landing pages ou sites de conteúdo.", "Astro|Next.js|Nuxt|Hugo|Jekyll|Eleventy|Gatsby|Docusaurus|VitePress|MkDocs"),
  c(217, "Jamstack", "Construir aplicações usando frontend estático combinado com APIs e serviços.", "Você quer sites rápidos, seguros e fáceis de distribuir globalmente.", "Vercel|Netlify|Cloudflare Pages|GitHub Pages|Render Static Sites|Firebase Hosting|AWS Amplify Hosting"),
  c(218, "Static hosting", "Hospedar arquivos HTML, CSS e JavaScript sem servidor tradicional.", "O projeto é site estático, documentação ou landing page.", "GitHub Pages|Cloudflare Pages|Netlify|Vercel|Firebase Hosting|Surge|Neocities|Render"),
  c(219, "Object storage self-hosted", "Criar armazenamento de arquivos parecido com Amazon S3 em infraestrutura própria.", "Você quer controlar totalmente onde arquivos são armazenados.", "MinIO|Ceph|SeaweedFS|Garage|OpenStack Swift"),
  c(220, "Search self-hosted", "Executar seu próprio mecanismo de busca interna.", "Privacidade, custo ou controle exigem que busca rode na sua infraestrutura.", "Meilisearch|Typesense|Elasticsearch|OpenSearch|Solr|Manticore Search|Sonic|Quickwit|Vespa"),
  c(221, "Auth self-hosted", "Executar sua própria infraestrutura de login e identidade.", "Você não quer depender de um serviço externo de autenticação.", "Keycloak|Zitadel|Authentik|FusionAuth|SuperTokens|Logto|Ory|Authelia|Hanko"),
  c(222, "Analytics self-hosted", "Executar analytics dentro da própria infraestrutura.", "Você quer maior controle de privacidade e dados dos usuários.", "PostHog|Plausible|Matomo|Umami|Countly|OpenPanel|Swetrix"),
  c(223, "Error tracking self-hosted", "Hospedar seu próprio sistema de monitoramento de erros.", "Você quer evitar enviar dados de erro para terceiros.", "GlitchTip|Sentry|Highlight.io|SigNoz"),
  c(224, "Automation self-hosted", "Hospedar sua própria plataforma de automação.", "Você quer fluxos tipo Zapier com controle total da infraestrutura.", "n8n|Activepieces|Node-RED|Windmill|Automatisch"),
  c(225, "Internal tools self-hosted", "Criar e hospedar ferramentas administrativas internas.", "Dados sensíveis ou políticas impedem uso de plataformas externas.", "Appsmith|ToolJet|Budibase|NocoBase|Directus|Refine"),
  c(226, "Status page self-hosted", "Hospedar sua própria página pública de status.", "Você quer comunicar incidentes sem depender de plataformas externas.", "Cachet|OpenStatus|Statping-ng|Uptime Kuma"),
  c(227, "Uptime self-hosted", "Monitorar disponibilidade usando infraestrutura própria.", "Você quer acompanhar serviços sem pagar ferramenta externa.", "Uptime Kuma|Gatus|Healthchecks.io|Cabot|Statping-ng"),
  c(228, "Password managers para equipes", "Guardar e compartilhar senhas de forma segura.", "Uma equipe precisa compartilhar acessos sem enviar senhas por mensagens.", "1Password|Bitwarden|Dashlane|Keeper|Proton Pass"),
  c(229, "Dependency proxies e caches", "Criar repositórios internos e cache de dependências.", "Empresas precisam controlar quais pacotes podem ser utilizados.", "Verdaccio|Artifactory|Nexus Repository|Cloudsmith|GitHub Packages"),
  c(230, "Ambiente de desenvolvimento local", "Padronizar ambientes de desenvolvimento dos programadores.", "Você quer evitar o problema de funciona na minha máquina.", "Docker Compose|Dev Containers|Tilt|Skaffold|Garden|Telepresence|DevSpace|Okteto|Nix|Devbox|Mise|asdf"),
  c(231, "Gerenciadores de versão de runtime", "Alternar versões de linguagens e runtimes no computador.", "Diferentes projetos precisam de versões diferentes de Node, Python, Ruby ou Java.", "Mise|asdf|nvm|Volta|fnm|pyenv|rbenv|SDKMAN|rustup|Homebrew"),
  c(232, "HTTP servers", "Receber requisições HTTP e entregar páginas ou encaminhar tráfego.", "Você hospeda aplicações web ou precisa de proxy reverso.", "NGINX|Caddy|Apache HTTP Server|LiteSpeed|OpenLiteSpeed|Traefik|HAProxy"),
  c(233, "Email servers self-hosted", "Operar seu próprio servidor de e-mail.", "Uma organização precisa controlar completamente envio e recebimento de mensagens.", "Postal|Mailcow|Mailu|Postfix|Exim|Haraka"),
  c(234, "Push e realtime self-hosted", "Executar infraestrutura própria de mensagens e notificações instantâneas.", "Você precisa de realtime sem depender de Pusher, Ably ou serviços semelhantes.", "Centrifugo|ntfy|Gotify|Novu|Mercure|NATS"),
  c(235, "Colaboração de equipes", "Comunicação diária entre membros de uma equipe.", "Desenvolvedores, designers e gestores precisam conversar e compartilhar informações.", "Slack|Microsoft Teams|Discord|Mattermost|Zulip|Rocket.Chat|Twist"),
  c(236, "Whiteboard e brainstorming", "Organizar ideias visualmente de forma colaborativa.", "Uma equipe está planejando produto, fluxos ou arquitetura.", "Miro|FigJam|Excalidraw|tldraw|Whimsical|Lucidspark|Microsoft Whiteboard"),
  c(237, "Time tracking e produtividade", "Registrar tempo gasto em projetos e tarefas.", "Equipes cobram por hora ou querem medir distribuição de esforço.", "Toggl Track|Clockify|Harvest|Tempo|RescueTime|Everhour|Timely"),
  c(238, "API rate limiting", "Limitar quantidade de requisições feitas por usuário ou cliente.", "Você precisa impedir abuso ou proteger infraestrutura contra excesso de chamadas.", "Upstash Ratelimit|Arcjet|Cloudflare Rate Limiting|Kong|Envoy|NGINX|Redis|Bucket4j"),
  c(239, "Caching e edge cache", "Guardar respostas temporariamente para evitar processamento repetido.", "Você quer acelerar a aplicação e reduzir carga no servidor.", "Cloudflare Cache|Fastly|CloudFront|Varnish|Redis|KeyDB|Dragonfly|Momento"),
  c(240, "URL shorteners e link management", "Criar links curtos e acompanhar acessos.", "Marketing, compartilhamento e analytics precisam de URLs controladas.", "Dub|Bitly|Short.io|Rebrandly|Kutt|Shlink"),
  c(241, "QR code", "Gerar QR Codes programaticamente.", "Usuários precisam acessar links, pagamentos ou informações utilizando câmera.", "QRCode.js|node-qrcode|Segno|QR Code Generator API|QuickChart QR Codes"),
  c(242, "Barcode", "Criar e ler códigos de barras.", "O produto trabalha com estoque, logística, varejo ou identificação física.", "ZXing|JsBarcode|bwip-js|Dynamsoft Barcode Reader|Scandit"),
  c(243, "Notificações web push", "Enviar notificações para navegadores mesmo quando o site não está aberto.", "Aplicações web precisam reengajar usuários.", "OneSignal|Firebase Cloud Messaging|Web Push API|VAPID|Pusher Beams|WonderPush"),
  c(244, "GeoIP e IP intelligence", "Descobrir localização e informações aproximadas a partir do endereço IP.", "Você precisa personalizar conteúdo, detectar fraude ou identificar país do usuário.", "MaxMind|IPinfo|ipapi|Abstract IP Geolocation|IP2Location|DB-IP|Cloudflare Geolocation"),
  c(245, "Currency e financial APIs", "Consultar moedas, câmbio e dados financeiros.", "Aplicações trabalham com preços internacionais ou conversão de moeda.", "Open Exchange Rates|Fixer|Currencylayer|ExchangeRate-API|Frankfurter|Stripe|Plaid"),
  c(246, "Open banking e fintech APIs", "Conectar aplicações a bancos e informações financeiras.", "Fintechs precisam ler contas, transações ou iniciar serviços financeiros.", "Plaid|Belvo|Pluggy|Open Finance Brasil|Salt Edge|TrueLayer|Tink"),
  c(247, "Weather APIs", "Consultar previsão e condições meteorológicas.", "A aplicação depende de clima, agricultura, viagens, logística ou eventos.", "OpenWeather|WeatherAPI|Tomorrow.io|Meteomatics|Visual Crossing|AccuWeather API"),
  c(248, "Date e time libraries", "Manipular datas, horários, períodos e fusos.", "O sistema trabalha com agendas, prazos, relatórios ou diferentes regiões.", "date-fns|Day.js|Luxon|Moment.js|Temporal|Pendulum|Arrow|Carbon"),
  c(249, "Charts e data visualization", "Transformar dados em gráficos e visualizações.", "Dashboards precisam mostrar evolução, comparação, distribuição ou métricas.", "D3.js|Chart.js|Apache ECharts|Recharts|Nivo|Victory|Highcharts|ApexCharts|Plotly|Vega|Vega-Lite|Observable Plot"),
  c(250, "Map visualization", "Renderizar mapas interativos e grandes volumes de dados geográficos.", "Você precisa mostrar rotas, regiões, pontos ou dados espaciais.", "Mapbox GL JS|MapLibre GL JS|Leaflet|OpenLayers|Deck.gl|Kepler.gl|CesiumJS"),
  c(251, "3D e WebGL", "Criar gráficos e experiências tridimensionais no navegador.", "O produto possui visualização 3D, modelos, jogos ou experiências imersivas.", "Three.js|Babylon.js|React Three Fiber|PlayCanvas|A-Frame|CesiumJS"),
  c(252, "Game development", "Criar jogos 2D e 3D.", "O produto é um jogo ou possui experiências interativas semelhantes.", "Unity|Unreal Engine|Godot|GameMaker|Defold|Cocos Creator|Phaser|Bevy|MonoGame"),
  c(253, "Desktop packaging e distribuição", "Empacotar aplicativos desktop para instalação.", "Seu software precisa ser distribuído para Windows, macOS ou Linux.", "Electron Builder|Electron Forge|Tauri Bundler|MSIX|AppImage|Flatpak|Snap|Homebrew Cask|Mac App Store|Microsoft Store"),
  c(254, "Mobile distribution e release", "Publicar e distribuir aplicativos mobile.", "Um aplicativo está pronto para chegar à App Store ou Google Play.", "App Store Connect|Google Play Console|TestFlight|Firebase App Distribution|Expo EAS|Fastlane|Codemagic|Bitrise"),
  c(255, "Mobile CI/CD", "Automatizar build, teste e publicação de aplicativos mobile.", "A equipe publica novas versões de Android e iOS frequentemente.", "Bitrise|Codemagic|Expo EAS|Fastlane|GitHub Actions|CircleCI|Xcode Cloud"),
  c(256, "Mobile crash reporting", "Identificar travamentos e erros em aplicativos móveis.", "Você precisa descobrir por que o aplicativo fechou ou apresentou falha no dispositivo do usuário.", "Firebase Crashlytics|Sentry|Bugsnag|Embrace|Instabug|Datadog Mobile RUM"),
  c(257, "Mobile analytics", "Medir comportamento de usuários dentro do aplicativo.", "Você quer acompanhar instalações, sessões, eventos e conversões no mobile.", "Firebase Analytics|Amplitude|Mixpanel|PostHog|AppsFlyer|Adjust|Branch"),
  c(258, "Deep links", "Abrir partes específicas de um aplicativo através de links.", "Um link de e-mail ou anúncio precisa abrir diretamente uma tela específica do app.", "Branch|Firebase Dynamic Links|AppsFlyer OneLink|Adjust|URLgenius"),
  c(259, "WebAssembly", "Executar código compilado de alto desempenho dentro do navegador.", "Aplicações web precisam rodar processamento pesado ou bibliotecas escritas em outras linguagens.", "WebAssembly|WasmEdge|Wasmtime|Wasmer|Emscripten|WASI|AssemblyScript"),
  c(260, "Connection pooling serverless", "Gerenciar muitas conexões simultâneas entre aplicações serverless e bancos.", "Funções serverless criam conexões demais e podem sobrecarregar o banco.", "PgBouncer|Supabase Supavisor|Prisma Accelerate|Neon Connection Pooling|AWS RDS Proxy|Cloud SQL Auth Proxy"),
  c(261, "Database backup e replication", "Copiar e replicar dados de bancos para recuperação e redundância.", "Dados críticos precisam sobreviver a falhas ou serem duplicados em outros servidores.", "pgBackRest|WAL-G|Barman|Litestream|MyDumper|Percona XtraBackup|Debezium"),
  c(262, "Database observability", "Monitorar desempenho e problemas do banco de dados.", "Queries estão lentas ou banco está consumindo muitos recursos.", "pganalyze|Datadog Database Monitoring|Percona Monitoring and Management|SolarWinds Database Performance Analyzer|New Relic Database Monitoring"),
  c(263, "Database security e access", "Controlar quem consegue acessar bancos de dados internos.", "Desenvolvedores e equipes precisam acessar produção com segurança.", "Teleport|Apono|StrongDM|Tailscale|Cloudflare Access|HashiCorp Boundary"),
  c(264, "Cloud cost management", "Monitorar e reduzir gastos com infraestrutura em nuvem.", "Custos de AWS, Azure, Google Cloud ou Kubernetes estão crescendo.", "AWS Cost Explorer|Google Cloud Cost Management|Azure Cost Management|Finout|CloudZero|Kubecost|Vantage|Infracost"),
  c(265, "Estimativa de custo de infraestrutura", "Prever custos antes de criar infraestrutura.", "Você quer saber quanto uma alteração de Terraform poderá custar.", "Infracost|Terraform Cloud|Spacelift|env0|Scalr|Atlantis"),
  c(266, "Infrastructure automation platforms", "Gerenciar execução colaborativa de infraestrutura como código.", "Equipes precisam revisar e aplicar Terraform ou Pulumi de forma controlada.", "Terraform Cloud|Spacelift|env0|Scalr|Atlantis|Pulumi Cloud|Harness"),
  c(267, "GitOps", "Fazer infraestrutura e deploy seguirem automaticamente o estado definido no Git.", "Kubernetes e ambientes precisam ser controlados por repositórios versionados.", "Argo CD|Flux|Fleet|Jenkins X|Weave GitOps"),
  c(268, "Chaos engineering", "Provocar falhas controladas para testar resistência do sistema.", "Você quer garantir que infraestrutura sobreviva a problemas reais.", "Chaos Monkey|Gremlin|LitmusChaos|Chaos Mesh|AWS Fault Injection Service|Azure Chaos Studio"),
  c(269, "Load balancing e traffic management", "Distribuir tráfego entre servidores ou regiões.", "Uma única instância não é suficiente ou você precisa de alta disponibilidade.", "HAProxy|NGINX|Envoy|Traefik|AWS ELB|Cloudflare Load Balancing|Google Cloud Load Balancing"),
  c(270, "Infra monitoring", "Acompanhar servidores, CPU, memória, disco e rede.", "Você administra infraestrutura e precisa saber se recursos estão saudáveis.", "Prometheus|Grafana|Datadog|New Relic|Zabbix|Nagios|Icinga|Netdata|VictoriaMetrics"),
  c(271, "Network monitoring", "Observar tráfego e comportamento da rede.", "Existem problemas de conexão, latência ou segurança de rede.", "Wireshark|tcpdump|Grafana|Datadog Network Monitoring|SolarWinds|ntopng|Zabbix"),
  c(272, "Profiling", "Identificar quais partes do código consomem mais CPU ou memória.", "A aplicação está lenta e você precisa descobrir exatamente o motivo.", "Pyroscope|Parca|Datadog Continuous Profiler|Google Cloud Profiler|AWS CodeGuru Profiler|Java Flight Recorder|pprof"),
  c(273, "Error reporting para backend", "Capturar erros que acontecem no servidor.", "Você precisa diagnosticar falhas em APIs, workers e jobs.", "Sentry|Bugsnag|Rollbar|Honeybadger|AppSignal|Airbrake|Raygun"),
  c(274, "Open source observability", "Criar stack de monitoramento utilizando ferramentas open-source.", "Você quer reduzir dependência de Datadog ou New Relic.", "Grafana|Prometheus|Loki|Tempo|OpenTelemetry|SigNoz|Jaeger|Zipkin|VictoriaMetrics"),
  c(275, "Distributed tracing", "Acompanhar uma requisição passando por vários serviços.", "Microsserviços tornam difícil descobrir onde uma operação ficou lenta ou falhou.", "OpenTelemetry|Jaeger|Zipkin|Grafana Tempo|Honeycomb|Datadog APM|New Relic|Elastic APM"),
  c(276, "Metrics", "Registrar números sobre saúde e desempenho do sistema.", "Você precisa acompanhar CPU, latência, quantidade de requisições ou erros.", "Prometheus|Grafana|VictoriaMetrics|InfluxDB|Datadog|New Relic|OpenTelemetry"),
  c(277, "Error budget e SLO management", "Definir metas de disponibilidade e confiabilidade.", "Equipes precisam medir se um serviço está cumprindo o nível prometido.", "Nobl9|Sloth|Pyrra|Datadog SLO|Grafana SLO|New Relic SLO"),
  c(278, "Health checks", "Verificar automaticamente se tarefas e serviços continuam funcionando.", "Você precisa monitorar cron jobs, workers ou endpoints críticos.", "Healthchecks.io|Cronitor|Better Uptime|Uptime Kuma|Gatus|Checkly"),
  c(279, "Code coverage", "Medir quanto do código é executado pelos testes.", "Você quer encontrar áreas importantes da aplicação sem testes.", "Codecov|Coveralls|SonarQube|Istanbul|c8|JaCoCo|Coverage.py"),
  c(280, "Mutation testing", "Alterar propositalmente o código para verificar se os testes detectam o erro.", "Você quer avaliar qualidade real da suíte de testes.", "Stryker|PIT|Mutmut|Cosmic Ray|Infection"),
  c(281, "Contract testing", "Garantir que serviços diferentes continuam respeitando contratos de comunicação.", "Backend, frontend ou microsserviços são desenvolvidos independentemente.", "Pact|Spring Cloud Contract|Dredd|Schemathesis|Karate"),
  c(282, "Security testing", "Testar vulnerabilidades e falhas de segurança.", "Você precisa avaliar se aplicação, APIs e infraestrutura resistem a ataques.", "OWASP ZAP|Burp Suite|Nuclei|Nikto|Metasploit|Nmap|Trivy|Semgrep"),
  c(283, "Fuzz testing", "Enviar entradas inesperadas para descobrir falhas.", "Sistemas críticos precisam ser testados contra dados imprevisíveis ou malformados.", "AFL++|libFuzzer|OSS-Fuzz|Honggfuzz|Jazzer|Schemathesis"),
  c(284, "API performance testing", "Medir capacidade e velocidade de APIs sob carga.", "Você quer saber quantas requisições por segundo uma API consegue processar.", "k6|Artillery|JMeter|Gatling|Vegeta|Locust"),
  c(285, "Mobile testing", "Automatizar testes de aplicativos Android e iOS.", "Você precisa verificar fluxos do app em vários dispositivos.", "Appium|Detox|Maestro|Espresso|XCUITest|Firebase Test Lab|BrowserStack App Automate|Sauce Labs"),
  c(286, "Email delivery monitoring", "Verificar se e-mails estão chegando à caixa de entrada.", "Mensagens importantes estão caindo em spam ou não chegando aos usuários.", "GlockApps|Mailtrap|MailReach|Postmaster Tools|Microsoft SNDS|DMARC Digests"),
  c(287, "DMARC, SPF e DKIM", "Configurar e monitorar autenticação de domínio para e-mail.", "Você quer evitar falsificação do domínio e melhorar entregabilidade.", "DMARCly|EasyDMARC|PowerDMARC|Valimail|DMARC Digests|MXToolbox"),
  c(288, "Domain e SSL monitoring", "Monitorar validade e configuração de certificados e domínios.", "Você quer evitar que um site fique indisponível porque o SSL expirou.", "SSL Labs|Certbot|Let's Encrypt|Cloudflare|Better Uptime|UptimeRobot|Oh Dear"),
  c(289, "SSL e certificados", "Criar e gerenciar certificados HTTPS.", "Sites e APIs precisam utilizar conexões criptografadas.", "Let's Encrypt|Certbot|Cloudflare SSL|AWS Certificate Manager|Google Certificate Manager|Azure Key Vault Certificates|ZeroSSL"),
  c(290, "Secret scanning", "Detectar senhas e chaves de API inseridas acidentalmente no código.", "Você quer impedir vazamento de credenciais em Git.", "GitGuardian|Gitleaks|TruffleHog|GitHub Secret Scanning|SpectralOps|detect-secrets"),
  c(291, "Infrastructure security scanning", "Encontrar configurações inseguras em infraestrutura como código e nuvem.", "Terraform, Kubernetes ou contas de nuvem precisam ser auditadas.", "Checkov|Trivy|Terrascan|tfsec|Prowler|ScoutSuite|CloudSploit"),
  c(292, "SBOM", "Criar inventário de todas as bibliotecas presentes no software.", "Segurança ou compliance exige saber exatamente do que a aplicação é composta.", "Syft|CycloneDX|SPDX|Trivy|Anchore|FOSSA"),
  c(293, "Vulnerability management", "Centralizar descoberta e correção de vulnerabilidades.", "Empresas precisam acompanhar riscos de segurança continuamente.", "Snyk|Wiz|Tenable|Qualys|Rapid7|Orca Security|Mend"),
  c(294, "Password hashing e crypto", "Proteger senhas e informações criptográficas.", "Seu backend armazena senhas ou precisa criptografar informações.", "Argon2|bcrypt|scrypt|libsodium|OpenSSL|Web Crypto API|Google Tink"),
  c(295, "ID generation", "Gerar identificadores únicos para registros.", "Usuários, pedidos, eventos ou objetos precisam de IDs confiáveis.", "UUID|ULID|Nano ID|CUID2|KSUID|Snowflake IDs"),
  c(296, "Feature flag self-hosted", "Hospedar seu próprio sistema de feature flags.", "Você quer controle completo da infraestrutura de lançamento gradual.", "Unleash|Flagsmith|Flipt|GrowthBook|PostHog|FeatBit"),
  c(297, "Product analytics self-hosted", "Hospedar analytics de produto internamente.", "Privacidade ou compliance impede envio de dados para terceiros.", "PostHog|Countly|Matomo|Plausible|Umami|OpenPanel"),
  c(298, "Session replay self-hosted", "Hospedar sistema próprio de gravação de sessões.", "Você precisa de session replay mantendo dados sob seu controle.", "OpenReplay|PostHog|Highlight.io"),
  c(299, "Headless commerce", "Fornecer backend de comércio eletrônico independente do frontend.", "Você quer criar experiência de loja totalmente personalizada.", "Medusa|Saleor|Vendure|Commerce Layer|Swell|Shopify Storefront API|BigCommerce"),
  c(300, "Authorization as a service", "Terceirizar regras complexas de permissões.", "Seu SaaS possui equipes, organizações, cargos e regras sofisticadas de acesso.", "Permit.io|Cerbos Hub|Auth0 FGA|WorkOS FGA|Aserto"),
  c(301, "Email API", "Enviar e-mails programaticamente através de API.", "Seu backend precisa disparar mensagens automaticamente.", "Resend|Postmark|SendGrid|Mailgun|Amazon SES|Brevo|Mailjet|MailerSend"),
  c(302, "Screenshot e browser rendering APIs", "Gerar screenshots ou páginas renderizadas automaticamente.", "Você precisa criar previews, PDFs ou capturas de sites.", "Browserless|Urlbox|ScreenshotOne|ScreenshotAPI|Microlink|CloudConvert|Browserbase"),
  c(303, "Link preview e metadata", "Extrair título, descrição e imagem de um link.", "O produto exibe previews ao compartilhar URLs.", "Microlink|Open Graph|Iframely|LinkPreview|Metascraper|Unfurl.js"),
  c(304, "Social login", "Permitir cadastro utilizando contas de outros serviços.", "Você quer login com Google, Apple, GitHub, Microsoft ou redes sociais.", "Google Identity|Sign in with Apple|GitHub OAuth|Microsoft Identity|Facebook Login|LinkedIn OAuth|Discord OAuth"),
  c(305, "OAuth e OIDC", "Padrões para autenticação e autorização entre sistemas.", "Aplicações precisam permitir login externo ou compartilhar acesso de forma segura.", "OAuth 2.0|OpenID Connect|Auth0|Keycloak|Zitadel|Ory Hydra|FusionAuth|Okta"),
  c(306, "API authentication", "Proteger APIs e identificar quem está realizando cada chamada.", "APIs privadas ou comerciais não podem ser acessadas anonimamente.", "OAuth 2.0|JWT|API Keys|HMAC|mTLS|OpenID Connect|WorkOS|Auth0"),
  c(307, "JWT e token libraries", "Criar e validar tokens de autenticação.", "Seu sistema usa JWT para sessões ou autorização de APIs.", "jose|jsonwebtoken|PyJWT|Nimbus JOSE + JWT|golang-jwt"),
  c(308, "Policy e access control", "Definir regras formais sobre quem pode acessar recursos.", "Permissões simples de administrador e usuário não são suficientes.", "OPA|Cedar|Casbin|Cerbos|OpenFGA|SpiceDB|Oso"),
  c(309, "Multi-tenancy", "Separar dados e usuários entre diferentes empresas dentro do mesmo SaaS.", "Cada cliente possui sua própria organização, equipe ou workspace.", "Clerk Organizations|Auth0 Organizations|WorkOS Organizations|Supabase RLS|PostgreSQL RLS|Permit.io|Cerbos|OpenFGA"),
  c(310, "Row level security", "Controlar acesso a registros diretamente no banco.", "Usuários só podem visualizar linhas que pertencem a eles ou à sua organização.", "PostgreSQL RLS|Supabase RLS|Hasura Permissions|CockroachDB RLS|SQL Server Row-Level Security"),
  c(311, "Admin dashboards", "Criar painéis para administrar o sistema.", "Funcionários precisam gerenciar usuários, pagamentos, conteúdo ou registros.", "React Admin|Refine|Forest Admin|Retool|Appsmith|ToolJet|AdminJS|Laravel Nova|Django Admin|ActiveAdmin"),
  c(312, "Scheduling e booking", "Permitir que pessoas escolham horários disponíveis.", "O produto trabalha com consultas, reuniões, reservas ou serviços agendados.", "Cal.com|Calendly|SavvyCal|Nylas Scheduler|Cronofy|Acuity Scheduling"),
  c(313, "Timezone e calendar infrastructure", "Sincronizar calendários e lidar corretamente com fusos horários.", "Usuários estão em diferentes países ou utilizam Google ou Outlook Calendar.", "Nylas|Cronofy|Google Calendar API|Microsoft Graph Calendar|CalDAV|FullCalendar"),
  c(314, "Reporting e embedded analytics", "Colocar relatórios e dashboards diretamente dentro do produto.", "Clientes precisam visualizar seus próprios dados sem sair da aplicação.", "Metabase Embedded|Looker Embedded|Power BI Embedded|Tableau Embedded|Superset Embedded|GoodData|Sisense"),
  c(315, "Exportação de CSV e Excel", "Criar ou ler arquivos CSV e planilhas.", "Usuários precisam exportar relatórios ou importar grandes conjuntos de dados.", "SheetJS|ExcelJS|Papa Parse|Polars|Pandas|Apache POI|ClosedXML"),
  c(316, "Spreadsheet components", "Criar interfaces semelhantes ao Excel dentro do produto.", "Usuários precisam editar dados em formato de planilha.", "Handsontable|AG Grid|Jspreadsheet|Luckysheet|Univer|Syncfusion Spreadsheet"),
  c(317, "Document editors embedded", "Inserir editores completos de documentos dentro da aplicação.", "Usuários precisam escrever e formatar documentos sem sair do sistema.", "OnlyOffice|Collabora Online|CKEditor|TinyMCE|TipTap|Lexical|BlockNote"),
  c(318, "Collaborative editing", "Permitir edição simultânea do mesmo documento por várias pessoas.", "Você quer experiência semelhante ao Google Docs ou Notion.", "Yjs|Automerge|Liveblocks|TipTap Collaboration|CKEditor Collaboration|Lexical Collaboration"),
  c(319, "Notifications in-app", "Criar central de notificações dentro da interface.", "Usuários precisam receber alertas sobre eventos que aconteceram no produto.", "Knock|Novu|MagicBell|Courier|SuprSend|Engagespot|NotificationAPI"),
  c(320, "Customer messaging", "Enviar mensagens segmentadas a clientes.", "Marketing ou produto quer conversar com usuários com base no comportamento deles.", "Intercom|Customer.io|Braze|OneSignal|CleverTap|MoEngage|Iterable"),
  c(321, "Product tours", "Criar tutoriais guiados dentro da aplicação.", "Novos usuários precisam aprender recursos passo a passo.", "Appcues|Userflow|Userpilot|Chameleon|Pendo|Intro.js|Shepherd.js|Driver.js"),
  c(322, "Surveys", "Criar questionários e pesquisas.", "Você quer coletar opinião, satisfação ou informações dos usuários.", "Typeform|Tally|SurveyMonkey|Jotform|Fillout|Survicate|Qualtrics|Formbricks"),
  c(323, "Surveys self-hosted", "Hospedar sua própria plataforma de pesquisas.", "Dados das respostas precisam permanecer na sua infraestrutura.", "Formbricks|LimeSurvey|OhMyForm|Form.io"),
  c(324, "CAPTCHA self-hosted e privacy-first", "Bloquear bots com maior foco em privacidade.", "Você não quer depender de reCAPTCHA ou rastreamento externo.", "ALTCHA|mCaptcha|Friendly Captcha|Anubis"),
  c(325, "Consentimento self-hosted", "Controlar consentimento de cookies usando ferramentas hospedadas por você.", "Você quer maior controle de privacidade e compliance.", "Klaro|CookieConsent|Consent-O-Matic"),
  c(326, "Web analytics privacy-first", "Medir tráfego reduzindo rastreamento individual.", "Privacidade é prioridade ou você quer uma alternativa simples ao Google Analytics.", "Plausible|Umami|Fathom|Simple Analytics|Pirsch|Matomo|Swetrix"),
  c(327, "Server analytics", "Analisar acessos diretamente a partir dos logs do servidor.", "Você quer estatísticas sem inserir scripts de tracking no navegador.", "GoAccess|AWStats|Matomo Log Analytics|GoatCounter"),
  c(328, "Log management self-hosted", "Centralizar logs utilizando infraestrutura própria.", "Segurança ou custo torna serviços externos de log inadequados.", "Grafana Loki|Graylog|OpenSearch|Elastic Stack|SigNoz|VictoriaLogs"),
  c(329, "Notification self-hosted", "Operar sistema próprio de notificações.", "Você quer controle total sobre push, alertas ou comunicação interna.", "Novu|ntfy|Gotify|Apprise"),
  c(330, "API management", "Gerenciar ciclo de vida, segurança, consumo e publicação de APIs.", "Uma empresa possui muitas APIs internas ou públicas.", "Kong|Tyk|Gravitee|WSO2|Apigee|Azure API Management|AWS API Gateway|MuleSoft"),
  c(331, "Enterprise integration", "Conectar sistemas corporativos complexos.", "Grandes empresas precisam integrar ERP, CRM, bancos e sistemas legados.", "MuleSoft|Boomi|Workato|SnapLogic|Informatica|Tray.ai"),
  c(332, "Message transformation e event routing", "Transformar e redirecionar dados entre diferentes sistemas.", "Eventos chegam em um formato e precisam ser enviados para múltiplos destinos.", "Apache Camel|Kafka Streams|Redpanda Connect|Apache NiFi|Node-RED"),
  c(333, "Event-driven development", "Criar sistemas onde ações são disparadas por eventos.", "Uma compra, cadastro ou upload precisa iniciar vários processos independentes.", "Kafka|NATS|RabbitMQ|Redpanda|Temporal|Inngest|Trigger.dev|EventBridge"),
  c(334, "Development portals", "Criar um portal central para equipes de desenvolvimento.", "Desenvolvedores precisam encontrar serviços, documentação, owners e infraestrutura.", "Backstage|Port|Cortex|OpsLevel|Roadie|Atlassian Compass"),
  c(335, "API marketplaces", "Publicar, encontrar e comercializar APIs.", "Você quer disponibilizar uma API para desenvolvedores externos.", "RapidAPI|APILayer|AWS Marketplace APIs|Google Cloud Marketplace"),
  c(336, "Mock servers", "Simular um servidor real durante desenvolvimento.", "APIs verdadeiras ainda não existem ou não devem ser chamadas em testes.", "WireMock|Mockoon|MockServer|Prism|Beeceptor|MSW|JSON Server"),
  c(337, "HTTP debugging e proxy", "Inspecionar requisições entre aplicação e servidor.", "Você precisa descobrir exatamente quais dados estão sendo enviados e recebidos.", "Charles Proxy|Proxyman|Fiddler|mitmproxy|HTTP Toolkit|Requestly|Wireshark"),
  c(338, "Browser devtools", "Inspecionar HTML, CSS, JavaScript, rede e desempenho do navegador.", "Você está corrigindo bugs ou desenvolvendo frontend.", "Chrome DevTools|Firefox Developer Tools|Safari Web Inspector|Microsoft Edge DevTools|React Developer Tools|Vue Devtools|Redux DevTools"),
  c(339, "API inspection e network debug", "Analisar tráfego entre aplicações e APIs.", "Uma integração está apresentando respostas incorretas ou falhas de conexão.", "Postman|HTTPie|Bruno|mitmproxy|Proxyman|Charles|Fiddler|Wireshark"),
  c(340, "Web performance profiling", "Descobrir quais partes de uma página estão deixando o site lento.", "Você precisa melhorar tempo de carregamento e experiência.", "Chrome DevTools|Lighthouse|WebPageTest|SpeedCurve|DebugBear|Calibre"),
  c(341, "Memory profiling", "Analisar consumo e vazamentos de memória.", "Uma aplicação fica cada vez mais pesada ou consome RAM excessivamente.", "Chrome DevTools Memory|Valgrind|VisualVM|YourKit|dotMemory|Memray|Heaptrack"),
  c(342, "CPU profiling", "Descobrir quais operações estão consumindo mais processamento.", "Aplicações ou serviços estão lentos ou usando CPU excessivamente.", "perf|pprof|Pyroscope|Java Flight Recorder|VisualVM|dotTrace|Instruments"),
  c(343, "Mobile performance", "Medir velocidade, travamentos e consumo de recursos no mobile.", "Um aplicativo está lento ou apresenta problemas em determinados dispositivos.", "Firebase Performance Monitoring|Sentry Performance|Datadog Mobile RUM|Embrace|Instabug|Xcode Instruments|Android Profiler"),
  c(344, "Desktop debugging", "Investigar erros em aplicativos desktop e programas nativos.", "Você desenvolve software para Windows, Linux ou macOS.", "Visual Studio Debugger|LLDB|GDB|WinDbg|Xcode Debugger|JetBrains Debugger"),
  c(345, "API monitoring", "Verificar continuamente se APIs estão funcionando corretamente.", "APIs são críticas para o negócio e precisam ser monitoradas 24 horas.", "Checkly|Postman Monitors|Assertible|Runscope|Better Uptime|Datadog Synthetics"),
  c(346, "Webhook monitoring", "Registrar e inspecionar webhooks recebidos ou enviados.", "Integrações externas falham e você precisa descobrir quais eventos foram enviados.", "Hookdeck|Svix|Convoy|Webhook.site|Pipedream"),
  c(347, "Certificate management", "Emitir e renovar certificados digitais automaticamente.", "Infraestrutura possui vários domínios e serviços HTTPS.", "Let's Encrypt|Certbot|AWS Certificate Manager|Google Certificate Manager|Azure Key Vault|cert-manager|ZeroSSL"),
  c(348, "Kubernetes certificate management", "Automatizar certificados TLS dentro de Kubernetes.", "Aplicações em clusters precisam de HTTPS e renovação automática.", "cert-manager|Let's Encrypt|Venafi|HashiCorp Vault"),
  c(349, "Policy as code", "Definir regras de segurança e infraestrutura através de código.", "Você quer impedir automaticamente configurações fora dos padrões da empresa.", "OPA|Conftest|Kyverno|HashiCorp Sentinel|Cedar|Checkov"),
  c(350, "Kubernetes security", "Proteger clusters Kubernetes e detectar configurações perigosas.", "Seu ambiente de produção utiliza Kubernetes.", "Falco|Kubescape|Kube-bench|Kyverno|OPA Gatekeeper|Trivy|Cilium"),
  c(351, "Container security", "Detectar vulnerabilidades dentro de imagens de containers.", "Docker e containers são utilizados em produção.", "Trivy|Grype|Clair|Docker Scout|Snyk Container|Anchore"),
  c(352, "Cloud security posture management", "Verificar continuamente se recursos de nuvem estão configurados com segurança.", "Empresas possuem infraestrutura relevante em AWS, Azure ou Google Cloud.", "Wiz|Orca Security|Prisma Cloud|Prowler|ScoutSuite|Cloudsplaining"),
  c(353, "Database proxy e pooling", "Intermediar e otimizar conexões com banco.", "Muitas aplicações ou funções criam conexões simultaneamente.", "PgBouncer|Supavisor|ProxySQL|MaxScale|RDS Proxy|Prisma Accelerate"),
  c(354, "Edge databases", "Manter dados próximos geograficamente dos usuários.", "Latência global precisa ser muito baixa.", "Cloudflare D1|Turso|Neon|PlanetScale|Upstash|Momento|Fauna"),
  c(355, "Edge state e coordination", "Manter estado compartilhado próximo dos usuários.", "Jogos, colaboração ou realtime global precisam coordenar dados rapidamente.", "Cloudflare Durable Objects|PartyKit|Fly.io Machines|Redis|Upstash|Ably"),
  c(356, "Background compute", "Executar processamento pesado fora da requisição principal.", "Jobs podem levar segundos ou minutos e não devem bloquear o usuário.", "Modal|Inngest|Trigger.dev|Temporal|Cloud Run Jobs|AWS Batch|Azure Container Apps Jobs|Railway"),
  c(357, "GPU cloud e AI compute", "Alugar GPUs para IA e computação pesada.", "Você precisa treinar ou executar modelos que exigem placas gráficas potentes.", "RunPod|Lambda|CoreWeave|Modal|Vast.ai|Paperspace|AWS GPU Instances|Google Cloud GPU|Azure GPU"),
  c(358, "AI model training e fine-tuning", "Treinar ou adaptar modelos de IA para necessidades específicas.", "Um modelo genérico não atende suficientemente ao seu domínio.", "Hugging Face|Weights & Biases|Axolotl|Unsloth|LLaMA-Factory|TRL|OpenAI Fine-tuning|Vertex AI|AWS SageMaker"),
  c(359, "Embeddings", "Transformar texto e outros conteúdos em vetores numéricos.", "Você precisa de busca semântica, RAG, classificação ou recomendação.", "OpenAI Embeddings|Voyage AI|Cohere Embed|Jina Embeddings|Google Embeddings|Sentence Transformers|Hugging Face"),
  c(360, "Reranking", "Reordenar resultados de busca pela relevância real.", "Busca semântica encontra documentos corretos, mas a ordem ainda precisa melhorar.", "Cohere Rerank|Jina Reranker|Voyage Rerank|Pinecone Rerank|Mixedbread AI"),
  c(361, "AI memory", "Dar memória persistente a agentes e assistentes de IA.", "A IA precisa lembrar preferências, fatos ou interações anteriores.", "Mem0|Zep|Letta|LangMem|Supermemory|Graphiti|Cognee"),
  c(362, "AI browser agents", "Permitir que agentes de IA naveguem e interajam com sites.", "A IA precisa clicar, pesquisar, preencher formulários ou executar tarefas na web.", "Browser Use|Stagehand|Browserbase|Skyvern|Hyperbrowser|Playwright|Puppeteer"),
  c(363, "AI code review", "Utilizar IA para revisar mudanças de código automaticamente.", "Você quer detectar bugs e sugerir melhorias antes do merge.", "CodeRabbit|Greptile|Qodo|Graphite|Bito|Sourcery|SonarQube AI"),
  c(364, "AI document processing", "Utilizar IA para entender e estruturar documentos.", "Você precisa extrair tabelas, cláusulas, campos ou informações de PDFs.", "Unstructured|LlamaParse|Azure Document Intelligence|Google Document AI|Amazon Textract|Nanonets|Mindee"),
  c(365, "AI voice agents", "Criar agentes que conversam por telefone ou voz em tempo real.", "Você quer atendimento, vendas ou suporte automatizado por voz.", "Vapi|Retell AI|Bland AI|LiveKit Agents|Daily Bots|Twilio Voice|ElevenLabs Conversational AI"),
  c(366, "AI speech infrastructure", "Construir pipelines de áudio para agentes conversacionais.", "Sua aplicação precisa ouvir, processar e responder por voz com baixa latência.", "Deepgram|AssemblyAI|ElevenLabs|Cartesia|LiveKit|Daily|Pipecat"),
  c(367, "AI safety e guardrails", "Controlar comportamentos perigosos ou inadequados de modelos.", "IA interage com usuários ou dados sensíveis e precisa de limites adicionais.", "Guardrails AI|NVIDIA NeMo Guardrails|Lakera Guard|Protect AI|Prompt Security|Rebuff|Llama Guard"),
  c(368, "AI prompt testing", "Testar automaticamente prompts e respostas de modelos.", "Você quer saber se uma alteração de prompt melhorou ou piorou a qualidade.", "Promptfoo|DeepEval|Braintrust|LangSmith|Humanloop|Ragas|OpenAI Evals"),
  c(369, "AI cost monitoring", "Monitorar gasto com modelos de inteligência artificial.", "Muitos usuários ou agentes estão gerando custos elevados de tokens.", "Helicone|Langfuse|Portkey|OpenLLMetry|Datadog LLM Observability|LangSmith|Braintrust"),
  c(370, "Developer search e code search", "Pesquisar código em grandes repositórios.", "Você precisa encontrar funções, referências ou padrões em milhões de linhas.", "Sourcegraph|GitHub Code Search|GitLab Code Search|grep.app|OpenGrok|Zoekt|Livegrep"),
  c(371, "Knowledge base e enterprise search", "Pesquisar informações espalhadas por documentos e sistemas internos.", "Funcionários precisam encontrar rapidamente conhecimento da empresa.", "Glean|Elastic Workplace Search|Algolia|Coveo|Typesense|Meilisearch"),
  c(372, "Open source project management", "Gerenciar projetos utilizando plataformas open-source.", "Você quer controlar onde dados de tarefas e projetos ficam armazenados.", "Plane|OpenProject|Taiga|Redmine|Leantime|GitLab|GitHub Projects"),
  c(373, "Open source documentação e wiki", "Criar documentação e base de conhecimento em infraestrutura própria.", "Você quer uma alternativa open-source a Notion, Confluence ou GitBook.", "Outline|Wiki.js|BookStack|Docusaurus|MkDocs|VitePress|Hugo"),
  c(374, "Open source customer support", "Operar atendimento ao cliente com software open-source.", "Você quer uma alternativa própria a Zendesk ou Intercom.", "Chatwoot|Zammad|FreeScout|Helpy|UVdesk"),
  c(375, "Open source CRM", "Gerenciar clientes e vendas com solução open-source.", "Você quer controlar dados comerciais internamente.", "Twenty|EspoCRM|SuiteCRM|Odoo|ERPNext"),
  c(376, "Open source ERP", "Gerenciar áreas empresariais como estoque, financeiro e operações.", "A empresa precisa de sistema empresarial integrado sem plataforma proprietária.", "ERPNext|Odoo|Dolibarr|Tryton"),
  c(377, "Open source e-commerce", "Criar lojas utilizando plataformas abertas.", "Você quer maior controle do código e infraestrutura do e-commerce.", "Medusa|Saleor|Vendure|WooCommerce|Sylius|Magento Open Source|Shopware Community"),
  c(378, "Open source password managers", "Guardar senhas utilizando sistemas open-source.", "Sua equipe quer controlar internamente o armazenamento de credenciais.", "Bitwarden|Vaultwarden|KeePassXC|Passbolt"),
  c(379, "Open source identity", "Gerenciar login e identidade utilizando software open-source.", "Você quer autenticação sem depender totalmente de SaaS externo.", "Keycloak|Zitadel|Authentik|SuperTokens|Logto|Ory|Authelia"),
  c(380, "Open source feature flags", "Controlar lançamento de funcionalidades usando software aberto.", "Você quer rollout gradual sem depender de LaunchDarkly.", "Unleash|Flagsmith|Flipt|GrowthBook|FeatBit"),
  c(381, "Open source analytics", "Medir uso do produto com ferramentas abertas.", "Você quer analytics com maior controle e privacidade.", "PostHog|Plausible|Umami|Matomo|OpenPanel|Countly"),
  c(382, "Open source monitoring", "Monitorar infraestrutura com ferramentas abertas.", "Você quer construir observabilidade sem depender apenas de SaaS pago.", "Grafana|Prometheus|SigNoz|Zabbix|Netdata|Uptime Kuma|Gatus"),
  c(383, "Open source automation", "Automatizar integrações utilizando software open-source.", "Você quer substituir Zapier ou Make por uma solução própria.", "n8n|Activepieces|Node-RED|Windmill|Automatisch"),
  c(384, "Open source BaaS", "Ter backend pronto utilizando tecnologias open-source.", "Você quer rapidez de BaaS mantendo possibilidade de self-hosting.", "Supabase|Appwrite|PocketBase|Nhost|Parse Platform"),
  c(385, "Open source CMS", "Gerenciar conteúdo utilizando plataformas abertas.", "Você quer controle sobre código e banco do seu CMS.", "Strapi|Directus|Payload CMS|Ghost|WordPress|Drupal|KeystoneJS"),
  c(386, "Open source search", "Criar mecanismo de busca utilizando software aberto.", "Você quer alternativa self-hosted a Algolia.", "Meilisearch|Typesense|OpenSearch|Elasticsearch|Solr|Manticore Search|Vespa"),
  c(387, "Open source vector database", "Armazenar embeddings utilizando soluções open-source.", "RAG ou busca semântica precisa rodar em infraestrutura própria.", "Qdrant|Weaviate|Milvus|Chroma|LanceDB|pgvector"),
  c(388, "Open source AI observability", "Monitorar aplicações de IA usando ferramentas abertas.", "Você quer avaliar prompts e agentes mantendo dados internamente.", "Langfuse|Arize Phoenix|OpenLLMetry|DeepEval|Promptfoo"),
  c(389, "Open source AI coding", "Utilizar agentes de programação open-source.", "Você quer IA para desenvolvimento com maior controle e possibilidade de usar modelos próprios.", "Aider|Cline|OpenCode|Continue|Tabby|OpenHands"),
  c(390, "Open source low-code", "Criar aplicações rapidamente usando plataformas low-code abertas.", "Você quer interfaces administrativas ou sistemas internos com self-hosting.", "Appsmith|ToolJet|Budibase|NocoBase|Baserow|NocoDB"),
  c(391, "Open source deployment", "Criar plataforma própria de deploy.", "Você quer alternativa self-hosted a Heroku, Railway ou Vercel.", "Coolify|Dokploy|CapRover|Dokku|Portainer"),
  c(392, "Open source status page", "Publicar status dos serviços usando software aberto.", "Você quer página de incidentes hospedada internamente.", "Cachet|OpenStatus|Statping-ng"),
  c(393, "Open source uptime monitoring", "Monitorar disponibilidade com software aberto.", "Você quer receber alertas sem depender de serviço proprietário.", "Uptime Kuma|Gatus|Healthchecks|Cabot"),
  c(394, "Open source logging", "Centralizar logs utilizando soluções abertas.", "Você precisa analisar logs em infraestrutura própria.", "Grafana Loki|Graylog|OpenSearch|SigNoz|VictoriaLogs"),
  c(395, "Open source API clients", "Testar APIs usando ferramentas abertas.", "Você quer alternativa open-source ao Postman.", "Bruno|Hoppscotch|HTTPie|Yaak"),
  c(396, "Open source API gateways", "Controlar e proteger APIs usando software aberto.", "Você possui vários serviços e quer gateway self-hosted.", "Kong Gateway|Apache APISIX|Tyk OSS|KrakenD|Traefik"),
  c(397, "Open source webhooks", "Construir e gerenciar infraestrutura de webhooks com ferramentas abertas.", "Seu produto envia muitos eventos para integrações externas.", "Convoy|Hook0|Standard Webhooks"),
  c(398, "Open source document generation", "Gerar e converter documentos com tecnologias abertas.", "Seu sistema precisa produzir PDF, DOCX, HTML ou outros formatos sem SaaS externo.", "Gotenberg|PDFKit|PDF-lib|Pandoc|LibreOffice"),
  c(399, "Open source collaborative editors", "Criar editores colaborativos utilizando componentes abertos.", "Você está construindo documentos, notas ou conteúdo com edição simultânea.", "Yjs|Automerge|TipTap|Lexical|BlockNote"),
  c(400, "Open source realtime", "Criar infraestrutura de comunicação em tempo real utilizando soluções abertas.", "Você precisa de chat, presença online, colaboração ou eventos instantâneos sem depender de SaaS proprietário.", "Centrifugo|Socket.IO|Mercure|NATS|LiveKit|Jitsi|Matrix"),
];

/** Total de menções a ferramentas na biblioteca (com repetição entre categorias). */
export const LIBRARY_TOOL_MENTIONS = LIBRARY.reduce((n, cat) => n + cat.tools.length, 0);

/** Ferramentas distintas em toda a biblioteca. */
export const LIBRARY_UNIQUE_TOOLS = new Set(LIBRARY.flatMap((cat) => cat.tools)).size;

/* ------------------------------------------------------------------ */
/* Correspondência entre a descrição de um projeto e as categorias      */
/* ------------------------------------------------------------------ */

const normalize = (t: string) =>
  t
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

/**
 * Palavras que aparecem em quase toda descrição de projeto e por isso não
 * distinguem nada. Sem essa lista, "sistema" e "usuário" casariam com dezenas
 * de categorias e o ranking viraria ruído.
 */
const STOPWORDS = new Set(
  normalize(
    // 3 letras: precisam estar aqui porque o corte mínimo é 3, para não perder
    // "app", "web", "erp", "crm", "api", "sql".
    "com que dos das uma por sem nao sao tem ter foi seu sua ele ela nos mas " +
      "ate ser tao esse essa isso este esta " +
      "para como mais pelo pela sobre entre quando onde " +
      "sistema sistemas projeto projetos aplicacao aplicacoes usuario usuarios " +
      "precisa precisamos preciso quero queremos fazer criar seja sendo " +
      "hoje agora depois antes cada todos toda todo outro outra mesmo dados dado " +
      "informacao informacoes forma parte partes coisa coisas eles elas " +
      "seus suas esses essas aquele aquela algum alguma",
  ).split(/\s+/),
);

const terms = (text: string): string[] => {
  const seen = new Set<string>();
  for (const raw of normalize(text).split(/[^a-z0-9.+#]+/)) {
    // Mínimo 3: descartar tokens de 3 letras eliminava justamente "app", "web"
    // e "erp" — as palavras mais informativas de uma descrição de projeto.
    // ".", "+" e "#" ficam no token para preservar "node.js", "c++" e "c#".
    if (raw.length < 3 || STOPWORDS.has(raw)) continue;
    seen.add(raw);
  }
  return [...seen];
};

/* Índice pré-computado, com os campos separados porque cada um vale um peso
   diferente. Não dá para juntar tudo num texto só: o nome da categoria e os
   nomes de ferramenta são sinais muito mais fortes que a prosa do "use quando",
   já que a pessoa escreve "app mobile" e "Stripe", não "reduzindo duplicação
   de desenvolvimento". */
const HAYSTACKS = LIBRARY.map((cat) => ({
  cat,
  name: normalize(cat.name),
  when: normalize(cat.when),
  does: normalize(cat.does),
  // Delimitado por | para permitir casar nome inteiro de ferramenta.
  tools: `|${normalize(cat.tools.join("|"))}|`,
}));

const W_NAME = 4;
const W_TOOL = 4;
const W_WHEN = 3;
const W_DOES = 2;

export type LibraryMatch = {
  category: LibCategory;
  score: number;
  /** Termos da descrição que dispararam esta categoria. */
  hits: string[];
};

/**
 * Ordena as categorias pela aderência à descrição do projeto.
 *
 * Substitui as ~12 regras de regex que existiam antes: em vez de procurar
 * palavras fixas, compara a descrição com os 400 textos de "use quando".
 */
export function matchLibrary(description: string, limit = 12): LibraryMatch[] {
  const wanted = terms(description);
  if (wanted.length === 0) return [];

  const scored: LibraryMatch[] = [];

  for (const { cat, name, when, does, tools } of HAYSTACKS) {
    let score = 0;
    const hits: string[] = [];

    for (const term of wanted) {
      let best = 0;
      // Ferramenta citada pelo nome exato ("Stripe", "Neon") é o sinal mais
      // confiável que existe: a pessoa já sabe o que quer.
      if (tools.includes(`|${term}|`)) best = W_TOOL;
      else if (name.includes(term)) best = W_NAME;
      else if (when.includes(term)) best = W_WHEN;
      else if (does.includes(term) || tools.includes(term)) best = W_DOES;

      if (best > 0) {
        score += best;
        hits.push(term);
      }
    }

    // Piso de 4: exige um sinal forte (nome de categoria ou de ferramenta) ou
    // dois sinais fracos. Contar hits em vez de score descartava categorias
    // corretamente apontadas por um único termo preciso.
    if (score < 4) continue;

    /* Desempate por posição na biblioteca. Ela vai do fundamental (design,
       frontend, banco) ao especializado (VPN, reranking, variantes
       self-hosted), então um projeto descrito em termos gerais deve puxar as
       primeiras. É desempate, não filtro: vale no máximo 2 pontos e nunca
       supera um acerto forte. */
    const prior = Math.max(0, 2 - cat.n / 150);
    scored.push({ category: cat, score: score + prior, hits });
  }

  return scored.sort((a, b) => b.score - a.score || a.category.n - b.category.n).slice(0, limit);
}
