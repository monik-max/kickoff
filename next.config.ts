import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PGlite carrega um binário WASM — precisa ficar fora do bundle do servidor.
  serverExternalPackages: ["@electric-sql/pglite"],
};

export default nextConfig;
