import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";
import { loadEnvConfig } from "@next/env";

const appDir = path.dirname(fileURLToPath(import.meta.url));

loadEnvConfig(path.resolve(appDir, "../../"));

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
};

export default nextConfig;
