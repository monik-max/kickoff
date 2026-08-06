import { defineConfig } from "drizzle-kit";

/**
 * Só é necessário quando você aponta o app para um Postgres de verdade
 * (DATABASE_URL). Em desenvolvimento com PGlite as tabelas são criadas no
 * bootstrap de `src/db/index.ts`.
 *
 *   npx drizzle-kit generate   # gera as migrações a partir do schema
 *   npx drizzle-kit push       # aplica direto no banco de DATABASE_URL
 */
export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
});
