import "server-only";

import { PlanSchema, type Plan, type PlanInput } from "./plan-schema";

/**
 * Planeja via Ollama local — nenhuma chave de API, nenhum custo.
 * Suporta qualquer modelo que responda em JSON estruturado.
 */

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3.1:latest";
const OLLAMA_TIMEOUT_MS = 300000; // 5 minutos

const SYSTEM_PROMPT = `Você é um arquiteto de software sênior e gerente de projetos experiente.
Recebe a descrição de um projeto de software e produz um plano de execução realista,
em português do Brasil.

Regras do plano:
- Quebre o trabalho em épicos que cobrem o projeto inteiro, incluindo o que costuma
  ser esquecido: autenticação, migração de dados, observabilidade, testes, deploy,
  documentação e handover.
- Cada tarefa deve ser executável por uma pessoa em menos de uma semana.
- As três estimativas (otimista, provável, pessimista) são em horas de trabalho efetivo.
  A pessimista deve ser genuinamente pessimista: para trabalho com incerteza real,
  costuma ser 2 a 3 vezes a provável.
- Os marcos são entregas verificáveis, não fases abstratas.
- Os riscos devem ser específicos deste projeto.
- Em premissas, registre o que você assumiu. Em perguntas, o que só um humano pode responder.

Seja concreto e honesto. Um plano otimista demais é pior que nenhum plano.`;

function buildUserPrompt(input: PlanInput): string {
  const lines = [
    `Projeto: ${input.name}`,
    "",
    "Descrição:",
    input.description,
    "",
    `Time: ${input.teamSize} pessoa(s), ${input.weeklyHours}h por semana cada.`,
  ];
  if (input.stack) lines.push(`Stack / restrições técnicas: ${input.stack}`);
  if (input.targetDate) lines.push(`Prazo desejado: ${input.targetDate}`);
  lines.push(
    "",
    "Monte o plano de execução completo para este projeto.",
    "",
    "Responda com um JSON válido que corresponda a esta estrutura:",
    JSON.stringify(
      {
        summary: "string",
        epics: [
          {
            title: "string",
            summary: "string",
            tasks: [
              {
                title: "string",
                description: "string",
                role: "produto|design|frontend|backend|dados|devops|qa",
                priority: "alta|media|baixa",
                optimisticHours: "number",
                likelyHours: "number",
                pessimisticHours: "number",
              },
            ],
          },
        ],
        risks: [
          {
            title: "string",
            mitigation: "string",
            impact: "1-5",
            probability: "1-5",
          },
        ],
        milestones: [
          {
            title: "string",
            description: "string",
            week: "number",
          },
        ],
        openQuestions: [
          { text: "string", kind: "premissa|pergunta" },
        ],
      },
      null,
      2,
    ),
  );
  return lines.join("\n");
}

export async function generatePlanWithOllama(
  input: PlanInput,
): Promise<{ plan: Plan; model: string }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), OLLAMA_TIMEOUT_MS);

  try {
    console.log(
      `[Ollama] Gerando plano com modelo ${OLLAMA_MODEL} em ${OLLAMA_BASE_URL} (timeout: ${OLLAMA_TIMEOUT_MS}ms)`,
    );

    const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: `${SYSTEM_PROMPT}\n\n${buildUserPrompt(input)}`,
        stream: false,
        temperature: 0.3, // Determinístico pra planejamento
        top_p: 0.9,
        top_k: 40,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Ollama retornou ${response.status}: ${error}`);
    }

    const data = (await response.json()) as {
      response: string;
      model?: string;
    };
    const text = data.response || "";

    // Ollama geralmente embute o JSON no meio da resposta.
    // Tenta extrair um bloco JSON válido.
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Nenhum JSON encontrado na resposta do Ollama");
    }

    const parsed = JSON.parse(jsonMatch[0]);
    const plan = PlanSchema.parse(parsed);

    return { plan, model: OLLAMA_MODEL };
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`Falha ao gerar plano com Ollama: ${reason}`);
  } finally {
    clearTimeout(timeoutId);
  }
}
