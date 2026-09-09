import { UnrecoverableError } from "bullmq";

import { NonRetryableError, RetryableError } from "@/shared/errors/errors.js";

const mapBullMqError = (error: unknown): Error => {
  if (error instanceof RetryableError) return error;

  const unrecoverable = new UnrecoverableError(
    error instanceof Error ? error.message : "Unexpected error while processing job."
  );

  if (error instanceof NonRetryableError) {
    Object.assign(unrecoverable, {
      errors: error.errors,
      cause: error.cause,
    });
  }

  // Unknown/unexpected error:
  // fail permanently instead of retrying.
  return unrecoverable;
};

export { mapBullMqError };
