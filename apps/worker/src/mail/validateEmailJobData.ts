import { mapZodError } from "@/shared/errors/mappers/zod.js";
import { parseEmailJobData } from "@repo/jobs/email";
import { ZodError } from "zod";

const validateEmailJobData = (data: unknown) => {
  try {
    return parseEmailJobData(data);
  } catch (error) {
    if (error instanceof ZodError) throw mapZodError(error);
    throw error;
  }
};

export { validateEmailJobData };
