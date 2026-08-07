import "server-only";

import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { PlanSchema, type Plan, type PlanInput } from "./plan-schema";
import { buildHeuristicPlan } from "./heuristic-planner";
import { generatePlanWithOllama } from "./ollama-planner";

export type { PlanInput };

export type PlanResult = {
  plan: Plan;
  source: "claude" | "ollama" | "heuristico";
  /** Preenchido quando caímos em fallback por causa de um erro. */
  note?: string;
};

const SYSTEM_PROMPT = `Você é um arquiteto de software sênior e gerente de projetos experiente.
Recebe a descrição de um projeto de software e produz um plano de execução realista,
em português do Brasil.

Regras do plano:
- Quebre o trabalho em épicos que cobrem o projeto inteiro, incluindo o que costuma
  ser esquecido: autenticação, migração de dados, observabilidade, testes, deploy,
  documentação e handover.
- Cada tarefa deve ser executável por uma pessoa em menos de uma semana. Se for maior
  que isso, quebre em tarefas menores.
- As três estimativas (otimista, provável, pessimista) são em horas de trabalho efetivo
  de uma pessoa, não em dias de calendário. A pessimista deve ser genuinamente pessimista:
  para trabalho com incerteza real, costuma ser 2 a 3 vezes a provável.
- Cada épico tem um "rationale": por que aquela frente existe e o que dá errado
  quando ela é deixada para depois. Quem lê este plano está aprendendo a profissão,
  então diga o custo concreto de pular a frente — não a importância genérica dela.
  Não repita o resumo com outras palavras.
- Os marcos são entregas verificáveis, não fases abstratas. Diga o que estará funcionando.
- Os riscos devem ser específicos deste projeto. Nada de "prazo apertado" genérico.
- Em premissas, registre o que você assumiu por falta de informação. Em perguntas,
  o que só um humano pode responder e que mudaria o plano.

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
  );
  return lines.join("\n");
}

export function hasApiKey(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY?.trim());
}

export async function generatePlan(input: PlanInput): Promise<PlanResult> {
  // Tenta Claude primeiro se tiver chave.
  if (hasApiKey()) {
    try {
      const client = new Anthropic();

      const stream = client.messages.stream({
        model: "claude-opus-5",
        max_tokens: 32000,
        system: SYSTEM_PROMPT,
        thinking: { type: "adaptive" },
        output_config: {
          effort: "high",
          format: zodOutputFormat(PlanSchema),
        },
        messages: [{ role: "user", content: buildUserPrompt(input) }],
      });

      const message = await stream.finalMessage();

      if (message.stop_reason === "refusal") {
        throw new Error("O modelo recusou a requisição.");
      }
      if (message.stop_reason === "max_tokens") {
        throw new Error("A resposta do modelo foi truncada (max_tokens).");
      }

      const text = message.content
        .filter((block) => block.type === "text")
        .map((block) => block.text)
        .join("");

      if (!text.trim()) {
        throw new Error("O modelo respondeu sem conteúdo de texto.");
      }

      return { plan: PlanSchema.parse(JSON.parse(text)), source: "claude" };
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      console.warn(`[Planner] Claude falhou, tentando Ollama: ${reason}`);
      // Continua pro Ollama.
    }
  }

  // Tenta Ollama se Claude não tiver chave ou falhou.
  try {
    const { plan } = await generatePlanWithOllama(input);
    return { plan, source: "ollama" };
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    return {
      plan: buildHeuristicPlan(input),
      source: "heuristico",
      note: `Falha ao gerar com Claude e Ollama (${reason}). Plano heurístico local usado no lugar.`,
    };
  }
}
