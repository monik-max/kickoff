import "server-only";

import { asc, desc, eq } from "drizzle-orm";
import { getDb } from "./index";
import {
  epics,
  milestones,
  openQuestions,
  projects,
  risks,
  tasks,
  type Epic,
  type Milestone,
  type OpenQuestion,
  type Project,
  type Risk,
  type Task,
} from "./schema";

export type ProjectDetail = {
  project: Project;
  epics: (Epic & { tasks: Task[] })[];
  risks: Risk[];
  milestones: Milestone[];
  questions: OpenQuestion[];
};

export async function listProjects(): Promise<
  (Project & { taskCount: number })[]
> {
  const db = await getDb();
  const rows = await db
    .select()
    .from(projects)
    .orderBy(desc(projects.createdAt));
  const allTasks = await db.select().from(tasks);

  return rows.map((project) => ({
    ...project,
    taskCount: allTasks.filter((t) => t.projectId === project.id).length,
  }));
}

export async function getProject(id: string): Promise<ProjectDetail | null> {
  const db = await getDb();

  const [project] = await db.select().from(projects).where(eq(projects.id, id));
  if (!project) return null;

  const [epicRows, taskRows, riskRows, milestoneRows, questionRows] =
    await Promise.all([
      db
        .select()
        .from(epics)
        .where(eq(epics.projectId, id))
        .orderBy(asc(epics.orderIndex)),
      db
        .select()
        .from(tasks)
        .where(eq(tasks.projectId, id))
        .orderBy(asc(tasks.orderIndex)),
      db.select().from(risks).where(eq(risks.projectId, id)),
      db
        .select()
        .from(milestones)
        .where(eq(milestones.projectId, id))
        .orderBy(asc(milestones.week)),
      db.select().from(openQuestions).where(eq(openQuestions.projectId, id)),
    ]);

  return {
    project,
    epics: epicRows.map((epic) => ({
      ...epic,
      tasks: taskRows.filter((t) => t.epicId === epic.id),
    })),
    risks: riskRows,
    milestones: milestoneRows,
    questions: questionRows,
  };
}
