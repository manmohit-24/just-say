import { env } from "@/config/env.js";
import { createClient } from "redis";
import { logger } from "./logger.js";

const redis = createClient({
  url: env.REDIS_URL,
});

redis.on("error", (error) => {
  logger.error(error, "Redis client error");
});

export { redis };
