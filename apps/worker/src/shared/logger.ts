import pino, { type LoggerOptions } from "pino";

import { env } from "@/config/env.js";

const IS_DEVELOPMENT = env.NODE_ENV === "development";

const options: LoggerOptions = {
  level: IS_DEVELOPMENT ? "debug" : "info",
};

if (IS_DEVELOPMENT) {
  options.transport = {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "dd/mm/yyyy - HH:MM:ss",
      ignore: "pid,hostname",
    },
  };
}

const logger = pino(options);

export { logger };
