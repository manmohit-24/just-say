import type { ErrorCode, ErrorFields } from "@repo/contracts";

// NETWORK_ERROR means the API could not be reached at all
type ApiErrorCode = ErrorCode | "NETWORK_ERROR";

class ApiError extends Error {
  public readonly status: number;
  public readonly code: ApiErrorCode;
  public readonly fields: ErrorFields | undefined;

  constructor(status: number, code: ApiErrorCode, message: string, fields?: ErrorFields) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.fields = fields;
  }
}

const getErrorMessage = (error: unknown, fallback = "Something went wrong") =>
  error instanceof ApiError ? error.message : fallback;

export { ApiError, getErrorMessage };
export type { ApiErrorCode };
