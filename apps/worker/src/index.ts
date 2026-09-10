import { env } from "./config/env.js";
import { emailWorker } from "./emailWorker.js";
import { logger } from "./shared/logger.js";

logger.info({ env: env.NODE_ENV }, "Wokers started");

const shutdown = async () => {
  console.log("Shutting down worker...");

  await emailWorker.close();

  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
