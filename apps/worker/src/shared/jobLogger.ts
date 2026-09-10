import { env } from "@/config/env.js";
import { logger } from "@/shared/logger.js";

const IS_DEVELOPMENT = env.NODE_ENV === "development";

type JobStatus = "started" | "completed" | "failed";

type JobLoggerOptions = {
  name: string;
  id?: string;
  info?: Record<string, unknown>;
};

class JobLogger {
  private readonly startTime: bigint;
  options: JobLoggerOptions;

  constructor(options: JobLoggerOptions) {
    this.options = options;
    this.startTime = process.hrtime.bigint();
    logJob(options, "started");
  }

  complete() {
    logJob(this.options, "completed", getDuration(this.startTime));
  }

  fail(error: unknown, extra?: Record<string, unknown>) {
    this.options.info = { ...this.options.info, error, ...extra };

    logJob(this.options, "failed", getDuration(this.startTime));
  }
}

function getDuration(startTime: bigint): number {
  const durationNs = process.hrtime.bigint() - startTime;

  return Number(durationNs) / 1_000_000;
}

function logJob(
  options: JobLoggerOptions,
  status: JobStatus,
  durationMs?: number,
  extra?: Record<string, unknown>
) {
  if (IS_DEVELOPMENT) {
    logDevelopment(options, status, durationMs);
    return;
  }

  const log = {
    type: "job",
    jobName: options.name,
    jobId: options.id,
    jobInfo: options.info,
    status,
    ...(durationMs !== undefined && { durationMs }),
    ...extra,
  };

  if (status === "failed") logger.error(log);
  else logger.info(log);
}

function logDevelopment(options: JobLoggerOptions, status: JobStatus, durationMs?: number) {
  const message = `${options.name}${options.id ? ` [${options.id}]` : ""} ${status.toUpperCase()}`;

  if (status === "started") {
    logger.info(message);
    return;
  }

  const duration = `(${durationMs?.toFixed(2)} ms)`;

  if (status === "failed") {
    const error = options.info?.error;
    const attempt = options.info?.attempt ? ` [attempt: ${options.info?.attempt}]` : "";

    logger.error({ err: error ?? "Something Went Wrong" }, `${message}${attempt} ${duration}`);
  } else logger.info(`${message} ${duration}`);
}

export { JobLogger };
export type { JobLoggerOptions, JobStatus };
