import {
  integer,
  pgTable,
  real,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const projects = pgTable("projects", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  stack: text("stack"),
  projectManager: text("project_manager"),
  teamSize: integer("team_size").notNull().default(3),
  weeklyHours: integer("weekly_hours").notNull().default(30),
  targetDate: text("target_date"),
  summary: text("summary"),
  /** 'gerando' | 'pronto' | 'erro' */
  status: text("status").notNull().default("gerando"),
  /** 'claude' | 'heuristico' — de onde veio o plano */
  source: text("source"),
  error: text("error"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const epics = pgTable("epics", {
  id: text("id").primaryKey(),
  projectId: text("project_id").notNull(),
  title: text("title").notNull(),
  summary: text("summary"),
  orderIndex: integer("order_index").notNull().default(0),
});

export const tasks = pgTable("tasks", {
  id: text("id").primaryKey(),
  projectId: text("project_id").notNull(),
  epicId: text("epic_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  /** papel sugerido: backend, frontend, design, dados, devops, qa, produto */
  role: text("role").notNull().default("dev"),
  /** 'alta' | 'media' | 'baixa' */
  priority: text("priority").notNull().default("media"),
  /** 'pendente' | 'fazendo' | 'feito' */
  status: text("status").notNull().default("pendente"),
  optimisticHours: real("optimistic_hours").notNull().default(4),
  likelyHours: real("likely_hours").notNull().default(8),
  pessimisticHours: real("pessimistic_hours").notNull().default(16),
  orderIndex: integer("order_index").notNull().default(0),
});

export const risks = pgTable("risks", {
  id: text("id").primaryKey(),
  projectId: text("project_id").notNull(),
  title: text("title").notNull(),
  mitigation: text("mitigation"),
  /** 1 a 5 */
  impact: integer("impact").notNull().default(3),
  probability: integer("probability").notNull().default(3),
});

export const milestones = pgTable("milestones", {
  id: text("id").primaryKey(),
  projectId: text("project_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  /** semana relativa ao início do projeto */
  week: integer("week").notNull().default(1),
  orderIndex: integer("order_index").notNull().default(0),
});

export const openQuestions = pgTable("open_questions", {
  id: text("id").primaryKey(),
  projectId: text("project_id").notNull(),
  text: text("text").notNull(),
  /** 'premissa' | 'pergunta' */
  kind: text("kind").notNull().default("pergunta"),
});

export const projectVersions = pgTable("project_versions", {
  id: text("id").primaryKey(),
  projectId: text("project_id").notNull(),
  /** snapshot JSON de todo o plano */
  snapshot: text("snapshot").notNull(),
  /** 'criação' | 'edição-tarefa' | 'edição-projeto' | 'edição-risco' | 'edição-marco' */
  changeType: text("change_type").notNull(),
  /** descrição breve da mudança */
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Project = typeof projects.$inferSelect;
export type Epic = typeof epics.$inferSelect;
export type Task = typeof tasks.$inferSelect;
export type Risk = typeof risks.$inferSelect;
export type Milestone = typeof milestones.$inferSelect;
export type OpenQuestion = typeof openQuestions.$inferSelect;
export type ProjectVersion = typeof projectVersions.$inferSelect;
