import { Job, UnrecoverableError, Worker } from "bullmq";

import { EMAIL_QUEUE_NAME } from "@repo/jobs/email";

import { env } from "@/config/env.js";
import { logger } from "@/shared/logger.js";
import { JobLogger } from "@/shared/jobLogger.js";
import { mapBullMqError } from "@/shared/errors/mappers/bullMQ.js";

import { sendEmail, validateEmailJobData } from "@/mail/index.js";

const emailJob = async (job: Job) => {
  const jobLogger = new JobLogger({
    name: job.name,
    id: job.id ?? "NULL",
    info: {},
  });

  job.jobLogger = jobLogger;

  try {
    const data = validateEmailJobData(job.data);

    jobLogger.options.info = {
      to: data.to,
      template: data.template,
    };

    await sendEmail(data);
  } catch (error) {
    throw mapBullMqError(error);
  }
};

const emailWorker = new Worker(EMAIL_QUEUE_NAME, emailJob, {
  connection: {
    url: env.REDIS_URL,
  },
  concurrency: 10,
});

emailWorker.on("completed", (job) => {
  job.jobLogger.complete();
});

emailWorker.on("failed", (job, err) => {
  if (!job) {
    logger.error({ err }, "Job failed but no job instance was available");
    return;
  }

  if (err instanceof UnrecoverableError) {
    job.jobLogger.fail(err); // no need of attempts or retries
    return;
  }

  job.jobLogger.fail(err, {
    attempt: job.attemptsMade,
  });
});

export { emailWorker };
