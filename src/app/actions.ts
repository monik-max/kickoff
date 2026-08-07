"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { getDb } from "@/db";
import {
  epics,
  milestones,
  openQuestions,
  projects,
  risks,
  tasks,
} from "@/db/schema";
import { generatePlan } from "@/lib/planner";
import { suggestStack } from "@/lib/stack-suggester";

const NewProjectSchema = z.object({
  name: z.string().trim().min(3, "Dê um nome com pelo menos 3 caracteres."),
  description: z
    .string()
    .trim()
    .min(40, "Descreva o projeto com pelo menos 40 caracteres — quanto mais contexto, melhor o plano."),
  stack: z.string().trim().optional(),
  projectManager: z.string().trim().optional(),
  teamSize: z.coerce.number().int().min(1).max(50),
  weeklyHours: z.coerce.number().int().min(1).max(60),
  targetDate: z.string().trim().optional(),
});

export type FormState = { error?: string };

export async function createProject(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = NewProjectSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    stack: formData.get("stack"),
    projectManager: formData.get("projectManager"),
    teamSize: formData.get("teamSize"),
    weeklyHours: formData.get("weeklyHours"),
    targetDate: formData.get("targetDate"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const input = {
    ...parsed.data,
    stack: parsed.data.stack || null,
    projectManager: parsed.data.projectManager || null,
    targetDate: parsed.data.targetDate || null,
  };

  const { plan, source, note } = await generatePlan(input);

  const db = await getDb();
  const projectId = randomUUID();

  await db.insert(projects).values({
    id: projectId,
    name: input.name,
    description: input.description,
    stack: input.stack,
    projectManager: input.projectManager,
    teamSize: input.teamSize,
    weeklyHours: input.weeklyHours,
    targetDate: input.targetDate,
    summary: plan.summary,
    status: "pronto",
    source,
    error: note ?? null,
  });

  let taskOrder = 0;
  for (const [epicIndex, epic] of plan.epics.entries()) {
    const epicId = randomUUID();
    await db.insert(epics).values({
      id: epicId,
      projectId,
      title: epic.title,
      summary: epic.summary,
      rationale: epic.rationale,
      orderIndex: epicIndex,
    });

    if (epic.tasks.length > 0) {
      await db.insert(tasks).values(
        epic.tasks.map((task) => ({
          id: randomUUID(),
          projectId,
          epicId,
          title: task.title,
          description: task.description,
          role: task.role,
          priority: task.priority,
          status: "pendente",
          optimisticHours: task.optimisticHours,
          likelyHours: task.likelyHours,
          pessimisticHours: task.pessimisticHours,
          orderIndex: taskOrder++,
        })),
      );
    }
  }

  if (plan.risks.length > 0) {
    await db.insert(risks).values(
      plan.risks.map((risk) => ({
        id: randomUUID(),
        projectId,
        title: risk.title,
        mitigation: risk.mitigation,
        impact: risk.impact,
        probability: risk.probability,
      })),
    );
  }

  if (plan.milestones.length > 0) {
    await db.insert(milestones).values(
      plan.milestones.map((milestone, index) => ({
        id: randomUUID(),
        projectId,
        title: milestone.title,
        description: milestone.description,
        week: milestone.week,
        orderIndex: index,
      })),
    );
  }

  if (plan.openQuestions.length > 0) {
    await db.insert(openQuestions).values(
      plan.openQuestions.map((question) => ({
        id: randomUUID(),
        projectId,
        text: question.text,
        kind: question.kind,
      })),
    );
  }

  revalidatePath("/");
  redirect(`/projetos/${projectId}`);
}

const STATUSES = ["pendente", "fazendo", "feito"] as const;

export async function setTaskStatus(
  taskId: string,
  projectId: string,
  status: string,
) {
  if (!STATUSES.includes(status as (typeof STATUSES)[number])) return;
  const db = await getDb();
  await db.update(tasks).set({ status }).where(eq(tasks.id, taskId));
  revalidatePath(`/projetos/${projectId}`);
}

export async function setTaskEstimate(
  taskId: string,
  projectId: string,
  hours: { optimistic: number; likely: number; pessimistic: number },
) {
  const values = z
    .object({
      optimistic: z.number().min(0).max(400),
      likely: z.number().min(0).max(400),
      pessimistic: z.number().min(0).max(400),
    })
    .safeParse(hours);
  if (!values.success) return;

  const db = await getDb();
  await db
    .update(tasks)
    .set({
      optimisticHours: values.data.optimistic,
      likelyHours: values.data.likely,
      pessimisticHours: values.data.pessimistic,
    })
    .where(eq(tasks.id, taskId));
  revalidatePath(`/projetos/${projectId}`);
}

export async function updateTask(
  taskId: string,
  projectId: string,
  data: {
    title?: string;
    description?: string;
    optimisticHours?: number;
    likelyHours?: number;
    pessimisticHours?: number;
    priority?: "alta" | "media" | "baixa";
  },
) {
  const values = z
    .object({
      title: z.string().min(1).max(200).optional(),
      description: z.string().max(2000).optional(),
      optimisticHours: z.number().min(0).max(400).optional(),
      likelyHours: z.number().min(0).max(400).optional(),
      pessimisticHours: z.number().min(0).max(400).optional(),
      priority: z.enum(["alta", "media", "baixa"]).optional(),
    })
    .safeParse(data);

  if (!values.success) return { error: "Dados inválidos" };

  const db = await getDb();
  await db.update(tasks).set(values.data).where(eq(tasks.id, taskId));
  revalidatePath(`/projetos/${projectId}`);
  return { success: true };
}

export async function setCapacity(
  projectId: string,
  teamSize: number,
  weeklyHours: number,
) {
  const values = z
    .object({
      teamSize: z.number().int().min(1).max(50),
      weeklyHours: z.number().int().min(1).max(60),
    })
    .safeParse({ teamSize, weeklyHours });
  if (!values.success) return;

  const db = await getDb();
  await db
    .update(projects)
    .set({
      teamSize: values.data.teamSize,
      weeklyHours: values.data.weeklyHours,
    })
    .where(eq(projects.id, projectId));
  revalidatePath(`/projetos/${projectId}`);
}

export async function suggestStackAction(description: string): Promise<string> {
  const validated = z.string().min(10).safeParse(description);
  if (!validated.success) {
    return "Descreva o projeto com mais detalhes para sugerir um stack.";
  }
  return suggestStack(validated.data);
}

export async function deleteProject(projectId: string) {
  const db = await getDb();
  await Promise.all([
    db.delete(tasks).where(eq(tasks.projectId, projectId)),
    db.delete(epics).where(eq(epics.projectId, projectId)),
    db.delete(risks).where(eq(risks.projectId, projectId)),
    db.delete(milestones).where(eq(milestones.projectId, projectId)),
    db.delete(openQuestions).where(eq(openQuestions.projectId, projectId)),
  ]);
  await db.delete(projects).where(eq(projects.id, projectId));
  revalidatePath("/");
  redirect("/");
}
