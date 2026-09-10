import { ZodError } from "zod";
import { NonRetryableError, type ErrorFields } from "../errors.js";

const mapZodError = (error: ZodError): NonRetryableError => {
  const fields: ErrorFields = {};

  for (const issue of error.issues) {
    const field = issue.path.join(".") || "root";

    fields[field] ??= issue.message;
  }

  return new NonRetryableError("Validation failed.", { cause: error.cause }, fields);
};

export { mapZodError };
