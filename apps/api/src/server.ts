// Load environment variables before importing the application.
import { env } from "@/config/env.js";

import { logger } from "@/shared/logger.js";
import { app } from "@/app.js";
import { prisma } from "@/shared/prisma.js";
import { redis } from "@/shared/redis.js";

let server: ReturnType<typeof app.listen>;

try {
  await prisma.$connect();
  await redis.connect();

  server = app.listen(env.PORT, () => {
    logger.info({ port: env.PORT, env: env.NODE_ENV }, "Server started");
  });
} catch (error) {
  logger.fatal(error, "Failed to start server.");
  process.exit(1);
}

// Shutting Down Application
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

let isShuttingDown = false;

async function shutdown(signal: "SIGINT" | "SIGTERM") {
  if (isShuttingDown) return;
  isShuttingDown = true;

  logger.info({ signal }, "Shutdown initiated");

  server.close(async (error) => {
    if (error) {
      logger.error(error, "Failed to close HTTP server.");
      process.exit(1);
    }
    logger.info("HTTP server closed.");

    try {
      await prisma.$disconnect();
      logger.info("Database connection closed.");
    } catch (error) {
      logger.error(error, "Failed to close database connection.");
    }

    try {
      await redis.quit();
      logger.info("Redis connection closed.");
    } catch (error) {
      logger.error(error, "Failed to close redis connection.");
    }

    process.exit(0);
  });
}
