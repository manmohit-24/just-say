import { env } from "@/config/env.js";
import { Queue } from "bullmq";
import { createClient } from "redis";
import {
  EMAIL_JOB_NAME,
  EMAIL_QUEUE_NAME,
  type EmailJobData,
  type EmailTemplateName,
} from "@repo/jobs/email";

// BullMQ uses its own dedicated Redis client.
// Passing the application's already-connected Redis client can cause
// `Socket already opened`, because BullMQ manages the connection lifecycle
// and may call `connect()` on the client itself.

const redis = createClient({ url: env.REDIS_URL });

const emailQueue = new Queue(EMAIL_QUEUE_NAME, { connection: redis });

const createEmailJob = async <T extends EmailTemplateName>(data: EmailJobData<T>) => {
  await emailQueue.add(EMAIL_JOB_NAME, data, {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
    priority: emailTemplatePriority[data.template] ?? 5,
  });
};

const emailTemplatePriority: Record<EmailTemplateName, number> = {
  emailVerification: 1,
  passwordReset: 1,
  emailChangeVerification: 1,

  emailChangeRequest: 2,
  accountDeletionAlert: 2,

  loginAlert: 3,
  passwordChangedAlert: 3,
  emailChangedAlert: 3,

  accountDeactivationAlert: 4,

  welcome: 5,
  welcomeBack: 5,
  emailChangedConfirmation: 5,
} as const;

export { createEmailJob };
