import { RetryableError, NonRetryableError } from "../errors.js";

const mapNodeMailerError = (error: unknown): Error => {
  if (isRetryableError(error))
    return new RetryableError("Email sending failed temporarily", {
      cause: error,
    });

  return new NonRetryableError("Email sending failed permanently", {
    cause: error,
  });
};

const isRetryableError = (error: unknown): boolean => {
  if (!error || typeof error !== "object") return false;

  const err = error as {
    code?: string;
    responseCode?: number;
  };

  // SMTP 4xx = temporary failure
  if (typeof err.responseCode === "number" && err.responseCode >= 400 && err.responseCode < 500)
    return true;

  // SMTP 5xx = permanent failure
  if (typeof err.responseCode === "number" && err.responseCode >= 500) return false;

  // Network / connection-level failures
  switch (err.code) {
    case "ECONNECTION":
    case "ETIMEDOUT":
    case "EDNS":
    case "ESOCKET":
      return true;

    default:
      return false;
  }
};

export { mapNodeMailerError };
