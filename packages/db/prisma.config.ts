import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig, env } from "prisma/config";

const currentDir = path.dirname(fileURLToPath(import.meta.url));

if (process.env.NODE_ENV !== "production") {
  dotenv.config({
    path: path.resolve(currentDir, "../../../.env"),
  });
}

export default defineConfig({
  schema: "prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
