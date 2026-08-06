import "server-only";

import { sql } from "drizzle-orm";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import * as schema from "./schema";

type Database = PgDatabase<PgQueryResultHKT, typeof schema>;

/**
 * Dev/local: PGlite — um Postgres real rodando em WASM, sem servidor e sem Docker.
 * Produção: basta definir DATABASE_URL (Neon, Supabase, RDS…) — o schema é o mesmo,
 * porque os dois caminhos usam o dialeto Postgres do Drizzle.
 */
async function createDatabase(): Promise<Database> {
  const url = process.env.DATABASE_URL;

  if (url) {
    const { drizzle } = await import("drizzle-orm/postgres-js");
    const postgres = (await import("postgres")).default;
    const client = postgres(url, { max: 5 });
    return drizzle(client, { schema }) as unknown as Database;
  }

  const { drizzle } = await import("drizzle-orm/pglite");
  const { PGlite } = await import("@electric-sql/pglite");
  // Use in-memory for Vercel (read-only filesystem), file-based for local dev
  const isProduction = process.env.VERCEL === "1";
  const dbPath = isProduction ? undefined : (process.env.PGLITE_DIR ?? ".pglite");
  const client = new PGlite(dbPath);
  return drizzle(client, { schema }) as unknown as Database;
}

// Uma instrução por item: o driver do PGlite usa prepared statements, que não
// aceitam múltiplos comandos numa mesma chamada.
const BOOTSTRAP = [
  sql`
  CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    stack TEXT,
    project_manager TEXT,
    team_size INTEGER NOT NULL DEFAULT 3,
    weekly_hours INTEGER NOT NULL DEFAULT 30,
    target_date TEXT,
    summary TEXT,
    status TEXT NOT NULL DEFAULT 'gerando',
    source TEXT,
    error TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT now()
  )`,
  sql`
  CREATE TABLE IF NOT EXISTS epics (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    title TEXT NOT NULL,
    summary TEXT,
    order_index INTEGER NOT NULL DEFAULT 0
  )`,
  sql`
  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    epic_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    role TEXT NOT NULL DEFAULT 'dev',
    priority TEXT NOT NULL DEFAULT 'media',
    status TEXT NOT NULL DEFAULT 'pendente',
    optimistic_hours REAL NOT NULL DEFAULT 4,
    likely_hours REAL NOT NULL DEFAULT 8,
    pessimistic_hours REAL NOT NULL DEFAULT 16,
    order_index INTEGER NOT NULL DEFAULT 0
  )`,
  sql`
  CREATE TABLE IF NOT EXISTS risks (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    title TEXT NOT NULL,
    mitigation TEXT,
    impact INTEGER NOT NULL DEFAULT 3,
    probability INTEGER NOT NULL DEFAULT 3
  )`,
  sql`
  CREATE TABLE IF NOT EXISTS milestones (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    week INTEGER NOT NULL DEFAULT 1,
    order_index INTEGER NOT NULL DEFAULT 0
  )`,
  sql`
  CREATE TABLE IF NOT EXISTS open_questions (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    text TEXT NOT NULL,
    kind TEXT NOT NULL DEFAULT 'pergunta'
  )`,
  sql`
  CREATE TABLE IF NOT EXISTS project_versions (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    snapshot TEXT NOT NULL,
    change_type TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT now()
  )`,
  sql`CREATE INDEX IF NOT EXISTS tasks_project_idx ON tasks (project_id)`,
  sql`CREATE INDEX IF NOT EXISTS epics_project_idx ON epics (project_id)`,
  sql`CREATE INDEX IF NOT EXISTS versions_project_idx ON project_versions (project_id)`,
];

// O dev server do Next recarrega módulos a cada edição; sem o singleton global
// cada reload abriria uma nova conexão PGlite no mesmo diretório.
const globalForDb = globalThis as unknown as { __kickoffDb?: Promise<Database> };

async function connect(): Promise<Database> {
  const database = await createDatabase();
  for (const statement of BOOTSTRAP) {
    await database.execute(statement);
  }
  return database;
}

export function getDb(): Promise<Database> {
  globalForDb.__kickoffDb ??= connect().catch((error) => {
    // Não deixar uma promessa rejeitada em cache: a próxima chamada tenta de novo.
    globalForDb.__kickoffDb = undefined;
    throw error;
  });
  return globalForDb.__kickoffDb;
}
