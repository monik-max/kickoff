/**
 * Script pra popular banco com projeto de exemplo
 * Roda com: node seed-example.js
 */

import { initializeApp } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { randomUUID } from "node:crypto";
import {
  projects,
  epics,
  tasks,
  risks,
  milestones,
  openQuestions,
  projectVersions,
} from "./src/db/schema.js";

const client = initializeApp({
  url: "file:local.db",
});

const db = drizzle(client);

async function seed() {
  console.log("🌱 Populando banco com projeto de exemplo...\n");

  const projectId = randomUUID();

  // Projeto
  const project = {
    id: projectId,
    name: "Portal de Entregas",
    description:
      "App mobile pra motoristas acompanharem entregas em tempo real. Inclui autenticação, mapa com rotas, notificações push e integração com sistema legado de logística.",
    stack: "React Native + Node.js + PostgreSQL + Google Maps",
    teamSize: 5,
    weeklyHours: 30,
    targetDate: "2026-10-15",
    summary:
      "Portal interno para a equipe de logística acompanhar as entregas. Hoje isso e controlado em planilha e cada motorista manda foto do comprovante no WhatsApp. Precisamos de: cadastro de entregas, login por perfil (supervisor e motorista), app mob...",
    status: "pronto",
    source: "heuristico",
    error: null,
    createdAt: new Date(),
  };

  await db.insert(projects).values(project);
  console.log("✅ Projeto criado:", project.name);

  // Épicos
  const epicData = [
    {
      id: randomUUID(),
      projectId,
      title: "Descoberta e alinhamento",
      summary: "Fechar escopo, critérios de aceite e o que fica de fora.",
      orderIndex: 0,
    },
    {
      id: randomUUID(),
      projectId,
      title: "Fundação técnica",
      summary:
        "Repositório, ambientes e o caminho até produção — antes da primeira feature.",
      orderIndex: 1,
    },
    {
      id: randomUUID(),
      projectId,
      title: "Autenticação e perfis",
      summary:
        "Login, sessão, permissões. Supervisor vê tudo, motorista só sua rota.",
      orderIndex: 2,
    },
    {
      id: randomUUID(),
      projectId,
      title: "Mapa e rotas",
      summary:
        "Integração com Google Maps, traçado de rota, posição em tempo real.",
      orderIndex: 3,
    },
  ];

  await db.insert(epics).values(epicData);
  console.log("✅ Épicos criados:", epicData.length);

  // Tarefas
  const tasksData = [
    // Épico 1: Descoberta
    {
      id: randomUUID(),
      projectId,
      epicId: epicData[0].id,
      title: "Entrevistar quem vai usar o sistema",
      description: "Conversar com supervisor e motoristas pra validar requisitos",
      role: "produto",
      priority: "alta",
      status: "feito",
      optimisticHours: 6,
      likelyHours: 12,
      pessimisticHours: 20,
      orderIndex: 0,
    },
    {
      id: randomUUID(),
      projectId,
      epicId: epicData[0].id,
      title: "Escrever os critérios de aceite do MVP",
      description: "Definir exatamente o que precisa funcionar no launch",
      role: "produto",
      priority: "alta",
      status: "feito",
      optimisticHours: 4,
      likelyHours: 8,
      pessimisticHours: 40,
      orderIndex: 1,
    },
    {
      id: randomUUID(),
      projectId,
      epicId: epicData[0].id,
      title: "Definir explicitamente o que fica de fora",
      description:
        "Documenta que app não faz chat, notificação de delay, etc — escopo claro",
      role: "produto",
      priority: "alta",
      status: "pendente",
      optimisticHours: 2,
      likelyHours: 4,
      pessimisticHours: 8,
      orderIndex: 2,
    },
    {
      id: randomUUID(),
      projectId,
      epicId: epicData[0].id,
      title: "Desenhar os fluxos principais",
      description:
        "Wireframes de: login, lista de entregas, detalhe de entrega, mapa",
      role: "design",
      priority: "media",
      status: "fazendo",
      optimisticHours: 8,
      likelyHours: 16,
      pessimisticHours: 32,
      orderIndex: 3,
    },

    // Épico 2: Fundação técnica
    {
      id: randomUUID(),
      projectId,
      epicId: epicData[1].id,
      title: "Configurar repositório e padrões de código",
      description: "Git flow, commitizen, prettier, eslint",
      role: "devops",
      priority: "alta",
      status: "pendente",
      optimisticHours: 3,
      likelyHours: 6,
      pessimisticHours: 12,
      orderIndex: 4,
    },
    {
      id: randomUUID(),
      projectId,
      epicId: epicData[1].id,
      title: "Modelar o banco de dados",
      description: "Schema de users, entregas, eventos de localização",
      role: "backend",
      priority: "alta",
      status: "pendente",
      optimisticHours: 6,
      likelyHours: 12,
      pessimisticHours: 24,
      orderIndex: 5,
    },
    {
      id: randomUUID(),
      projectId,
      epicId: epicData[1].id,
      title: "Esqueleto da aplicação rodando",
      description:
        "App mobile renderiza tela de login, backend responde a health check",
      role: "backend",
      priority: "alta",
      status: "pendente",
      optimisticHours: 6,
      likelyHours: 12,
      pessimisticHours: 24,
      orderIndex: 6,
    },
    {
      id: randomUUID(),
      projectId,
      epicId: epicData[1].id,
      title: "Pipeline de CI/CD",
      description: "Testes rodam em cada PR, deploy automático pra staging",
      role: "devops",
      priority: "alta",
      status: "pendente",
      optimisticHours: 8,
      likelyHours: 16,
      pessimisticHours: 32,
      orderIndex: 7,
    },
    {
      id: randomUUID(),
      projectId,
      epicId: epicData[1].id,
      title: "Observabilidade mínima",
      description: "Logs centralizados, erro 500 vai pro Slack",
      role: "devops",
      priority: "media",
      status: "pendente",
      optimisticHours: 4,
      likelyHours: 8,
      pessimisticHours: 16,
      orderIndex: 8,
    },

    // Épico 3: Autenticação
    {
      id: randomUUID(),
      projectId,
      epicId: epicData[2].id,
      title: "Autenticação com login e senha",
      description:
        "POST /login, JWT, refresh token, logout — supervisor + motorista",
      role: "backend",
      priority: "alta",
      status: "pendente",
      optimisticHours: 8,
      likelyHours: 16,
      pessimisticHours: 24,
      orderIndex: 9,
    },
    {
      id: randomUUID(),
      projectId,
      epicId: epicData[2].id,
      title: "Tela de login no app",
      description: "Form de email/senha, validação, tratamento de erro",
      role: "frontend",
      priority: "alta",
      status: "pendente",
      optimisticHours: 6,
      likelyHours: 12,
      pessimisticHours: 20,
      orderIndex: 10,
    },
    {
      id: randomUUID(),
      projectId,
      epicId: epicData[2].id,
      title: "Controle de permissões por perfil",
      description: "Motorista só vê suas entregas, supervisor vê tudo",
      role: "backend",
      priority: "alta",
      status: "pendente",
      optimisticHours: 6,
      likelyHours: 12,
      pessimisticHours: 20,
      orderIndex: 11,
    },

    // Épico 4: Mapa
    {
      id: randomUUID(),
      projectId,
      epicId: epicData[3].id,
      title: "Integração com Google Maps API",
      description:
        "Chave, setup SDK React Native, teste básico de mapa renderizando",
      role: "frontend",
      priority: "alta",
      status: "pendente",
      optimisticHours: 4,
      likelyHours: 8,
      pessimisticHours: 16,
      orderIndex: 12,
    },
    {
      id: randomUUID(),
      projectId,
      epicId: epicData[3].id,
      title: "Traçar rota entre entregas",
      description:
        "GET /rotas/:id retorna waypoints, frontend desenha polilinha",
      role: "frontend",
      priority: "alta",
      status: "pendente",
      optimisticHours: 8,
      likelyHours: 16,
      pessimisticHours: 32,
      orderIndex: 13,
    },
    {
      id: randomUUID(),
      projectId,
      epicId: epicData[3].id,
      title: "Posição em tempo real do motorista",
      description:
        "WebSocket, motorista envia GPS cada 10s, supervisor vê bolinha se movendo",
      role: "backend",
      priority: "alta",
      status: "pendente",
      optimisticHours: 10,
      likelyHours: 20,
      pessimisticHours: 40,
      orderIndex: 14,
    },
  ];

  await db.insert(tasks).values(tasksData);
  console.log("✅ Tarefas criadas:", tasksData.length);

  // Riscos
  const risksData = [
    {
      id: randomUUID(),
      projectId,
      title: "Google Maps pode ficar caro se houver muitas requisições",
      mitigation:
        "Implementar cache agressivo de rotas, quota limit no backend",
      impact: 4,
      probability: 3,
    },
    {
      id: randomUUID(),
      projectId,
      title: "Sistema legado de logística pode ter API lenta ou instável",
      mitigation:
        "Desacoplar com fila (Bull/RabbitMQ), retry automático, fallback pra dados em cache",
      impact: 5,
      probability: 4,
    },
    {
      id: randomUUID(),
      projectId,
      title: "Time pequeno (5 pessoas) pode ficar sobrecarregado",
      mitigation:
        "Priorizar features, considerar contractor frontend no meio do projeto",
      impact: 4,
      probability: 3,
    },
    {
      id: randomUUID(),
      projectId,
      title: "WebSocket pode ter problemas de conexão em áreas rurais",
      mitigation:
        "Fallback pra polling, heartbeat, reconexão automática com backoff",
      impact: 3,
      probability: 4,
    },
  ];

  await db.insert(risks).values(risksData);
  console.log("✅ Riscos criados:", risksData.length);

  // Marcos
  const milestonesData = [
    {
      id: randomUUID(),
      projectId,
      title: "Descoberta fechada + design validado",
      description: "Todos alinhados no escopo, wireframes aprovados",
      week: 2,
      orderIndex: 0,
    },
    {
      id: randomUUID(),
      projectId,
      title: "Ambientes e CI/CD prontos, app roda localmente",
      description: "Dev consegue fazer PR, ver testes rodarem, mergear",
      week: 4,
      orderIndex: 1,
    },
    {
      id: randomUUID(),
      projectId,
      title: "Login + permissões funcionando",
      description: "Supervisor e motorista conseguem fazer login",
      week: 7,
      orderIndex: 2,
    },
    {
      id: randomUUID(),
      projectId,
      title: "MVP em staging pra supervisor testar",
      description:
        "Mapa, rotas, localização em tempo real — sem relatórios ainda",
      week: 13,
      orderIndex: 3,
    },
    {
      id: randomUUID(),
      projectId,
      title: "Produção! 🚀",
      description: "Motoristas começam a usar, supervisores acompanham",
      week: 16,
      orderIndex: 4,
    },
  ];

  await db.insert(milestones).values(milestonesData);
  console.log("✅ Marcos criados:", milestonesData.length);

  // Perguntas em aberto
  const questionsData = [
    {
      id: randomUUID(),
      projectId,
      text: "Qual o volume esperado de usuários e dados no primeiro ano? Isso muda a decisão de stack.",
      kind: "pergunta",
    },
    {
      id: randomUUID(),
      projectId,
      text: "Existe sistema legado que precisa integração? Se sim, os dois vão rodar lado a lado?",
      kind: "pergunta",
    },
    {
      id: randomUUID(),
      projectId,
      text: "Quem é a pessoa com autoridade para decidir escopo quando houver conflito?",
      kind: "pergunta",
    },
    {
      id: randomUUID(),
      projectId,
      text: "Assumimos 3 pessoa(s) com 30h semanais efetivas — sem contar reuniões, suporte e férias.",
      kind: "premissa",
    },
    {
      id: randomUUID(),
      projectId,
      text: "Assumimos que não há requisito regulatório específico (LGPD além do básico, auditoria, certificação).",
      kind: "premissa",
    },
  ];

  await db.insert(openQuestions).values(questionsData);
  console.log("✅ Perguntas criadas:", questionsData.length);

  // Versão inicial (snapshot de criação)
  const initialSnapshot = {
    project: {
      id: project.id,
      name: project.name,
      description: project.description,
      stack: project.stack,
      teamSize: project.teamSize,
      weeklyHours: project.weeklyHours,
      targetDate: project.targetDate,
      summary: project.summary,
    },
    epics: epicData.map((e) => ({
      id: e.id,
      title: e.title,
      summary: e.summary,
      orderIndex: e.orderIndex,
      tasks: tasksData.filter((t) => t.epicId === e.id),
    })),
    risks: risksData,
    milestones: milestonesData,
    questions: questionsData,
  };

  await db.insert(projectVersions).values({
    id: randomUUID(),
    projectId,
    changeType: "criação",
    snapshot: JSON.stringify(initialSnapshot),
    description: "Projeto criado com plano completo",
  });

  console.log("✅ Versão inicial registrada\n");
  console.log("🎉 Banco populado com sucesso!");
  console.log(
    `\n📱 Acesse http://localhost:3111/projetos/${projectId} pra ver o exemplo`
  );
}

seed().catch(console.error);
