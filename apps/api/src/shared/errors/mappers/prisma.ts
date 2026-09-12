import { Prisma } from "@repo/db";

import { ErrorCode } from "@repo/contracts";

import { AppError } from "@/shared/errors/index.js";

const mapPrismaError = (err: unknown): AppError | null => {
  if (!(err instanceof Prisma.PrismaClientKnownRequestError)) return null;

  switch (err.code) {
    case "P2002":
      return new AppError(409, ErrorCode.CONFLICT, "Resource already exists");

    case "P2003":
      return new AppError(
        409,
        ErrorCode.CONFLICT,
        "Operation violates a related resource constraint"
      );

    case "P2025":
      return new AppError(404, ErrorCode.NOT_FOUND, "Resource not found");

    default:
      return null;
  }
};

export { mapPrismaError };
