import type { NextFunction, Request, Response } from "express";

import { ErrorCode, type ErrorResponse } from "@repo/contracts";

import { AppError } from "@/shared/errors/index.js";
import { logger } from "@/shared/logger.js";
import { mapPrismaError, mapZodError } from "@/shared/errors/mappers/index.js";

const errorHandler = (err: unknown, _req: Request, res: Response, next: NextFunction) => {
  // Errors that occur after sending response headers (e.g: mid-streaming errors)
  if (res.headersSent) return next(err);

  // handling Prisma Error
  const error = mapPrismaError(err) ?? mapZodError(err) ?? err;

  if (error instanceof AppError) {
    if (error.statusCode >= 500) logger.error(err);

    return res.status(error.statusCode).json({
      success: false,
      code: error.code,
      message: error.message,
      ...(error.errors && { errors: error.errors }),
    } satisfies ErrorResponse);
  }

  logger.error(error);
  return res.status(500).json({
    success: false,
    code: ErrorCode.INTERNAL_SERVER_ERROR,
    message: "Internal server error",
  } satisfies ErrorResponse);
};

export { errorHandler };
