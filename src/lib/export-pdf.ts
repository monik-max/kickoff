import type { ProjectDetail } from "@/db/queries";
import type { Task } from "@/db/schema";

/**
 * Gera um arquivo PDF do plano do projeto.
 * Usa a API de impressão do navegador (print-to-PDF).
 */
export function generatePlanPDF(detail: ProjectDetail, filename: string) {
  // Constrói o HTML do plano
  const html = generatePlanHTML(detail);

  // Cria um iframe oculto pra imprimir
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!doc) return;

  doc.open();
  doc.write(html);
  doc.close();

  // O "salvar como PDF" do navegador sugere o título do documento como nome do
  // arquivo. Antes o `filename` recebido era ignorado e valia o <title> do HTML
  // (o nome do projeto); agora o parâmetro passa a valer de fato.
  doc.title = filename.replace(/\.pdf$/i, "");

  // Espera o conteúdo carregar e imprime
  setTimeout(() => {
    iframe.contentWindow?.print();
    // Remove o iframe após imprimir
    setTimeout(() => document.body.removeChild(iframe), 500);
  }, 250);
}

function generatePlanHTML(detail: ProjectDetail): string {
  const { project, epics, risks, milestones, questions } = detail;

  const premissas = questions.filter((q) => q.kind === "premissa");
  const perguntas = questions.filter((q) => q.kind === "pergunta");

  const pertExpected = (task: Task) =>
    (task.optimisticHours + 4 * task.likelyHours + task.pessimisticHours) / 6;

  const allTasks = epics.flatMap((e) => e.tasks);
  const totalPERT = allTasks.reduce((sum, t) => sum + pertExpected(t), 0);
  const totalWeeks = (totalPERT / (project.teamSize * project.weeklyHours)).toFixed(1);

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${project.name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: Calibri, sans-serif;
      font-size: 10.5pt;
      line-height: 1.5;
      color: #000;
      background: white;
    }
    @page {
      size: A4;
      margin: 2cm 1.5cm 1.5cm 2cm;
    }
    @media print {
      body { padding: 0; }
      .page-break { page-break-after: always; }
    }

    h1 { font-size: 16pt; margin: 6pt 0 3pt 0; color: #000; font-weight: bold; text-align: center; }
    h2 { font-size: 12pt; margin: 8pt 0 4pt 0; color: #000; font-weight: bold; }
    h3 { font-size: 11pt; margin: 6pt 0 3pt 0; color: #000; font-weight: bold; }

    .header-table { width: 100%; border-collapse: collapse; margin-bottom: 8pt; }
    .header-table td { border: 1px solid #000; padding: 3pt 4pt; font-size: 8.5pt; }
    .header-table .logo-cell { width: 18%; vertical-align: middle; text-align: center; }
    .header-table .logo { font-weight: bold; font-size: 12pt; }
    .header-table .tagline { font-size: 7pt; color: #000; margin-top: 1pt; line-height: 1.2; }
    .header-table .info-cell { width: 82%; text-align: left; }
    .header-table .info-row { display: flex; justify-content: space-between; margin-bottom: 4pt; }
    .header-table .label { font-weight: bold; font-size: 8pt; width: 40%; }
    .header-table .value { font-size: 8pt; width: 60%; }
    .qr-placeholder { border: 1px dashed #000; width: 60px; height: 60px; margin: 0 auto; display: flex; align-items: center; justify-content: center; font-size: 8pt; }

    .stats { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 8pt; margin: 12pt 0; }
    .stat { border: 1px solid #000; padding: 8pt; }
    .stat-label { font-size: 9pt; font-weight: bold; margin-bottom: 4pt; }
    .stat-value { font-size: 14pt; font-weight: bold; color: #000; }

    table { width: 100%; border-collapse: collapse; margin: 6pt 0 4pt 0; font-size: 9pt; }
    thead { background: #fff; }
    th { text-align: center; padding: 3pt 4pt; border: 1px solid #000; font-weight: bold; color: #000; font-size: 8.5pt; }
    td { padding: 3pt 4pt; border: 1px solid #000; color: #000; text-align: center; }
    td.left { text-align: left; }

    .epic { margin-bottom: 6pt; page-break-inside: avoid; }
    .epic-title { font-weight: bold; font-size: 11pt; margin-bottom: 2pt; color: #000; }
    .epic-summary { font-size: 9pt; color: #000; margin-bottom: 3pt; line-height: 1.3; text-align: justify; }

    ul { margin: 4pt 0 4pt 18pt; padding: 0; }
    li { margin-bottom: 2pt; font-size: 9pt; }

    .section-title { font-weight: bold; font-size: 11pt; margin-top: 8pt; margin-bottom: 4pt; }

    .footer { margin-top: 2pt; padding-top: 2pt; border-top: 1px solid #000; font-size: 8pt; color: #000; text-align: center; }
  </style>
</head>
<body>
  <!-- CABEÇALHO EM TABELA -->
  <table class="header-table">
    <tr>
      <td class="logo-cell" rowspan="4">
        <div class="logo">K</div>
        <div class="tagline">KICKOFF<br>PLANEJE MELHOR</div>
      </td>
      <td class="info-cell" style="font-weight: bold; font-size: 8pt;">ID do projeto <span style="font-weight: normal;">${project.id.substring(0, 25)}</span></td>
    </tr>
    <tr>
      <td class="info-cell" style="font-weight: bold; font-size: 8pt;">Nome do projeto <span style="font-weight: normal;">${project.name}</span></td>
    </tr>
    <tr>
      <td class="info-cell" style="font-weight: bold; font-size: 8pt;">Gerente do projeto <span style="font-weight: normal;">${project.projectManager || "Não informado"}</span></td>
    </tr>
    <tr>
      <td class="info-cell" style="font-weight: bold; font-size: 8pt;">Data da impressão <span style="font-weight: normal;">${new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })} ${new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</span></td>
    </tr>
  </table>

  <!-- TÍTULO DO PROJETO -->
  <h1 style="margin-bottom: 6pt;">${project.name}</h1>

  <!-- 1. CAPACIDADE E PRAZO -->
  <h2>1. Capacidade e Prazo</h2>
  <table>
    <thead>
      <tr>
        <th>Esforço esperado</th>
        <th>Duração</th>
        <th>Time</th>
        <th>Horas/semana</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>${Math.round(totalPERT)}h</td>
        <td>${totalWeeks} sem</td>
        <td>${project.teamSize}</td>
        <td>${project.weeklyHours}h</td>
      </tr>
    </tbody>
  </table>

  <!-- 2. PLANO DE EXECUÇÃO -->
  <h2>2. Plano de Execução</h2>
  ${epics
    .map(
      (epic, epicIdx) => `
    <div class="epic">
      <h3>${epicIdx + 1}. ${epic.title}</h3>
      <p class="epic-summary">${epic.summary}</p>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Tarefa</th>
            <th>Papel</th>
            <th>Prior.</th>
            <th>O</th>
            <th>M</th>
            <th>P</th>
            <th>PERT</th>
          </tr>
        </thead>
        <tbody>
          ${epic.tasks
            .map(
              (task, taskIdx) => `
          <tr>
            <td>${taskIdx + 1}</td>
            <td class="left">${task.title}</td>
            <td>${task.role}</td>
            <td>${task.priority.substring(0, 1).toUpperCase()}</td>
            <td>${task.optimisticHours}</td>
            <td>${task.likelyHours}</td>
            <td>${task.pessimisticHours}</td>
            <td>${pertExpected(task).toFixed(1)}</td>
          </tr>
        `
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `
    )
    .join("")}

  ${
    milestones.length > 0
      ? `
  <div>
    <h2>3. Marcos</h2>
    ${milestones
      .map(
        (m) => `
      <p><strong>Semana ${m.week} - ${m.title}</strong></p>
      <p>${m.description}</p>
    `
      )
      .join("")}
  </div>
  `
      : ""
  }

  ${
    risks.length > 0
      ? `
  <div>
    <h2>4. Riscos</h2>
    <table>
      <thead>
        <tr>
          <th>Risco</th>
          <th>Impacto</th>
          <th>Probabilidade</th>
          <th>Mitigação</th>
        </tr>
      </thead>
      <tbody>
        ${risks
          .map(
            (r) => `
        <tr>
          <td>${r.title}</td>
          <td>${r.impact}</td>
          <td>${r.probability}</td>
          <td>${r.mitigation}</td>
        </tr>
      `
          )
          .join("")}
      </tbody>
    </table>
  </div>
  `
      : ""
  }

  ${
    questions.length > 0
      ? `
  <div>
    <h2>5. Premissas e Perguntas</h2>
    ${
      premissas.length > 0
        ? `
      <h3>Premissas Assumidas</h3>
      <ul>
        ${premissas.map((p) => `<li>${p.text}</li>`).join("")}
      </ul>
    `
        : ""
    }
    ${
      perguntas.length > 0
        ? `
      <h3>Perguntas em Aberto</h3>
      <ul>
        ${perguntas.map((p) => `<li>${p.text}</li>`).join("")}
      </ul>
    `
        : ""
    }
  </div>
  `
      : ""
  }

  <!-- 6. MVP DETALHADO -->
  <div class="page-break">
    <h2>6. MVP Detalhado</h2>
    <h3>Fluxo Principal de Negócio</h3>
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Ator</th>
          <th>O Que Pode Fazer</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>Usuário Cliente</td>
          <td>Cadastrar conta, fazer login, postar projetos, receber propostas, aprovar entrega, fazer pagamento</td>
        </tr>
        <tr>
          <td>2</td>
          <td>Usuário Freelancer</td>
          <td>Cadastrar conta, fazer login, buscar projetos, enviar propostas, receber contratação, entregar trabalho</td>
        </tr>
        <tr>
          <td>3</td>
          <td>Administrador</td>
          <td>Moderar conteúdo, resolver disputas, gerar relatórios, gerenciar pagamentos</td>
        </tr>
      </tbody>
    </table>
    <h3 style="margin-top: 8pt;">O Que Entra no MVP</h3>
    <ul>
      <li>Autenticação com email e senha</li>
      <li>Publicação de projetos com descrição e orçamento</li>
      <li>Envio de propostas por freelancers</li>
      <li>Aceitação de proposta e contratação</li>
      <li>Pagamento via gateway (Stripe/Pagar.me)</li>
      <li>Entrega de arquivo e aprovação</li>
      <li>Notificações por email em eventos críticos</li>
      <li>Histórico de projetos e transações</li>
    </ul>
    <h3 style="margin-top: 8pt;">O Que NÃO Entra no MVP (v1.1+)</h3>
    <ul>
      <li>Chat em tempo real entre cliente e freelancer</li>
      <li>Sistema de avaliações (stars, reviews)</li>
      <li>Verificação de identidade (KYC)</li>
      <li>Contratos eletrônicos com assinatura</li>
      <li>Mediação automática de disputas</li>
      <li>App mobile (iOS/Android)</li>
      <li>Assinatura premium para freelancers</li>
      <li>Suporte a múltiplos idiomas</li>
    </ul>
  </div>

  <!-- 7. DEPENDÊNCIAS E CAMINHO CRÍTICO -->
  <div>
    <h2>7. Dependências e Caminho Crítico</h2>
    <h3>Tarefas Críticas (Não podem atrasar)</h3>
    <table>
      <thead>
        <tr>
          <th>Ordem</th>
          <th>Tarefa</th>
          <th>Bloqueada por</th>
          <th>Semana</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td class="left">Escopo e Wireframes</td>
          <td>—</td>
          <td>1</td>
        </tr>
        <tr>
          <td>2</td>
          <td class="left">Fundação Técnica (Repo, BD, CI/CD)</td>
          <td>Escopo</td>
          <td>1-2</td>
        </tr>
        <tr>
          <td>3</td>
          <td class="left">Autenticação (Login, Contas)</td>
          <td>Fundação</td>
          <td>2-3</td>
        </tr>
        <tr>
          <td>4</td>
          <td class="left">Core do Negócio (Projetos, Propostas)</td>
          <td>Autenticação</td>
          <td>3-4</td>
        </tr>
        <tr>
          <td>5</td>
          <td class="left">Pagamentos e Escrow</td>
          <td>Core</td>
          <td>4-5</td>
        </tr>
        <tr>
          <td>6</td>
          <td class="left">Testes, QA e Correções</td>
          <td>Pagamentos</td>
          <td>6-7</td>
        </tr>
        <tr>
          <td>7</td>
          <td class="left">Lançamento em Produção</td>
          <td>QA</td>
          <td>8</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- 8. ALOCAÇÃO POR PESSOA -->
  <div class="page-break">
    <h2>8. Alocação por Pessoa</h2>
    <table>
      <thead>
        <tr>
          <th>Papel</th>
          <th>Responsável</th>
          <th>Horas/Semana</th>
          <th>Principais Tarefas</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Backend</strong></td>
          <td>[Nome]</td>
          <td>30h</td>
          <td class="left">API, BD, Pagamentos, Webhooks, Deployments</td>
        </tr>
        <tr>
          <td><strong>Frontend</strong></td>
          <td>[Nome]</td>
          <td>30h</td>
          <td class="left">Telas, UX, Responsividade, Testes</td>
        </tr>
        <tr>
          <td><strong>Produto/Design/DevOps</strong></td>
          <td>[Nome]</td>
          <td>30h</td>
          <td class="left">40% Produto, 25% Design, 20% DevOps, 15% QA</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- 9. REQUISITOS NÃO-FUNCIONAIS -->
  <div>
    <h2>9. Requisitos Não-Funcionais</h2>
    <table>
      <thead>
        <tr>
          <th>Aspecto</th>
          <th>Meta</th>
          <th>Como Validar</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Performance</strong></td>
          <td>Tempo resposta &lt; 500ms (p95)</td>
          <td>Teste de carga, APM</td>
        </tr>
        <tr>
          <td><strong>Disponibilidade</strong></td>
          <td>Uptime &gt; 99.5%</td>
          <td>Monitoramento contínuo</td>
        </tr>
        <tr>
          <td><strong>Segurança</strong></td>
          <td>OWASP Top 10 coberto</td>
          <td>Revisão de código + pentest</td>
        </tr>
        <tr>
          <td><strong>Escala</strong></td>
          <td>Mínimo 100 usuários simultâneos</td>
          <td>Teste de carga com 200 usuários</td>
        </tr>
        <tr>
          <td><strong>Acessibilidade</strong></td>
          <td>WCAG AA</td>
          <td>Auditoria automática + manual</td>
        </tr>
        <tr>
          <td><strong>Observabilidade</strong></td>
          <td>Logs centralizados, alertas de erro 500</td>
          <td>Sentry + ELK Stack</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- 10. RACI (Responsabilidades) -->
  <div>
    <h2>10. RACI — Responsabilidades</h2>
    <table>
      <thead>
        <tr>
          <th>Decisão/Atividade</th>
          <th>Responsável</th>
          <th>Aprovador</th>
          <th>Consultado</th>
          <th>Informado</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Escopo e MVP</td>
          <td>Product Owner</td>
          <td>Patrocinador</td>
          <td>Tech Lead</td>
          <td>Time</td>
        </tr>
        <tr>
          <td>Arquitetura Técnica</td>
          <td>Tech Lead</td>
          <td>CTO</td>
          <td>Time Dev</td>
          <td>PO</td>
        </tr>
        <tr>
          <td>Mudança de Escopo</td>
          <td>PO</td>
          <td>Patrocinador</td>
          <td>Tech Lead</td>
          <td>Time</td>
        </tr>
        <tr>
          <td>Qualidade e Aceite</td>
          <td>QA Lead</td>
          <td>PO</td>
          <td>Dev</td>
          <td>Stakeholders</td>
        </tr>
        <tr>
          <td>Lançamento em Produção</td>
          <td>Tech Lead</td>
          <td>CTO</td>
          <td>DevOps/PO</td>
          <td>Time</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- 11. CENÁRIOS DE PRAZO -->
  <div class="page-break">
    <h2>11. Cenários de Prazo (PERT)</h2>
    <table>
      <thead>
        <tr>
          <th>Cenário</th>
          <th>Duração</th>
          <th>Assumições</th>
          <th>Risco</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Otimista</strong></td>
          <td>~8 semanas</td>
          <td>0% overhead, 100% paralelismo, zero retrabalho</td>
          <td>CRÍTICO — improvável</td>
        </tr>
        <tr>
          <td><strong>Realista</strong></td>
          <td>~10-12 semanas</td>
          <td>20% overhead, paralelismo real, 10% retrabalho esperado</td>
          <td>MÉDIO — mais provável</td>
        </tr>
        <tr>
          <td><strong>Pessimista</strong></td>
          <td>~14-16 semanas</td>
          <td>30% overhead, descobertas tardias, retrabalho significativo</td>
          <td>BAIXO — preserva margem</td>
        </tr>
      </tbody>
    </table>
    <p style="margin-top: 8pt;"><strong>Recomendação:</strong> Comunicar prazo realista (10-12 semanas) externamente. Usar margem pessimista como buffer.</p>
  </div>

  <!-- 12. CHECKLIST DE BASELINE -->
  <div>
    <h2>12. Checklist de Baseline — Antes de Iniciar</h2>
    <p style="font-size: 9pt; margin-bottom: 6pt;"><strong>Bloqueadores (P0) — Resolver ANTES de qualquer linha de código:</strong></p>
    <ul>
      <li>☐ MVP descrito por fluxo, atores e estados</li>
      <li>☐ Critérios de aceite aprovados por PO</li>
      <li>☐ Escopo e não-escopo formalizados</li>
      <li>☐ Capacidade: 30h/semana por pessoa confirmada</li>
      <li>☐ Responsáveis nomeados para cada tarefa</li>
      <li>☐ Dependências e caminho crítico mapeados</li>
      <li>☐ Prazo recalculado: 10-12 semanas realista</li>
      <li>☐ Autoridade de escopo definida (quem aprova mudanças)</li>
      <li>☐ Estratégia de pagamentos aprovada</li>
      <li>☐ Perguntas abertas transformadas em decisões formais</li>
    </ul>
    <p style="font-size: 9pt; margin-top: 8pt; margin-bottom: 6pt;"><strong>Antes da Execução (P1) — Reduzem Retrabalho:</strong></p>
    <ul>
      <li>☐ Épicos quebrados em tarefas de 1-3 dias</li>
      <li>☐ Critério de "pronto" definido (code review, testes, docs)</li>
      <li>☐ Requisitos não-funcionais mensuráveis</li>
      <li>☐ Registro de riscos com proprietários e gatilhos</li>
      <li>☐ Processo de mudança de escopo documentado</li>
      <li>☐ Plano de testes e homologação aprovado</li>
      <li>☐ Plano de lançamento, rollback e hypercare definido</li>
    </ul>
  </div>

  <!-- FOOTER -->
  <div class="footer">
    <p>Documento gerado automaticamente pelo Kickoff - Planejador de Projetos</p>
    <p style="font-size: 8pt; margin-top: 4pt; color: #666;">Versão 2.0 — Com suporte P0/P1, MVP detalhado, RACI, cenários de prazo e checklist de baseline</p>
  </div>
</body>
</html>
  `;
}
