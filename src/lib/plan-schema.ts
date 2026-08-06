import { z } from "zod";

export const RoleEnum = z.enum([
  "produto",
  "design",
  "frontend",
  "backend",
  "dados",
  "devops",
  "qa",
]);

export const PriorityEnum = z.enum(["alta", "media", "baixa"]);

export const TaskSchema = z.object({
  title: z.string().describe("Título curto e acionável da tarefa"),
  description: z
    .string()
    .describe("O que precisa ser feito e qual é o critério de pronto"),
  role: RoleEnum.describe("Papel que executa a tarefa"),
  priority: PriorityEnum,
  optimisticHours: z
    .number()
    .describe("Estimativa otimista em horas (tudo dá certo)"),
  likelyHours: z.number().describe("Estimativa mais provável em horas"),
  pessimisticHours: z
    .number()
    .describe("Estimativa pessimista em horas (imprevistos acontecem)"),
});

export const EpicSchema = z.object({
  title: z.string().describe("Nome do épico / frente de trabalho"),
  summary: z.string().describe("Uma frase explicando o objetivo do épico"),
  tasks: z.array(TaskSchema).describe("Tarefas do épico, em ordem de execução"),
});

export const RiskSchema = z.object({
  title: z.string().describe("O risco, descrito em uma frase concreta"),
  mitigation: z.string().describe("Como reduzir ou detectar cedo esse risco"),
  impact: z.number().int().min(1).max(5).describe("Impacto de 1 a 5"),
  probability: z.number().int().min(1).max(5).describe("Probabilidade de 1 a 5"),
});

export const MilestoneSchema = z.object({
  title: z.string().describe("Nome do marco entregável"),
  description: z.string().describe("O que estará funcionando neste marco"),
  week: z
    .number()
    .int()
    .min(1)
    .describe("Semana do projeto em que o marco é atingido"),
});

export const OpenQuestionSchema = z.object({
  text: z.string().describe("A premissa assumida ou a pergunta em aberto"),
  kind: z.enum(["premissa", "pergunta"]),
});

export const PlanSchema = z.object({
  summary: z
    .string()
    .describe(
      "Resumo executivo do projeto em 3 a 5 frases: o que será construído, para quem e qual a estratégia de execução",
    ),
  epics: z
    .array(EpicSchema)
    .describe("Entre 4 e 8 épicos que cobrem o projeto inteiro"),
  risks: z.array(RiskSchema).describe("Entre 3 e 6 riscos reais do projeto"),
  milestones: z
    .array(MilestoneSchema)
    .describe("Entre 3 e 6 marcos, em ordem cronológica"),
  openQuestions: z
    .array(OpenQuestionSchema)
    .describe(
      "Premissas que você assumiu e perguntas que precisam de resposta humana",
    ),
});

export type Plan = z.infer<typeof PlanSchema>;
export type PlanTask = z.infer<typeof TaskSchema>;

/** Dados de entrada que descrevem o projeto a ser planejado. */
export type PlanInput = {
  name: string;
  description: string;
  stack?: string | null;
  teamSize: number;
  weeklyHours: number;
  targetDate?: string | null;
};
