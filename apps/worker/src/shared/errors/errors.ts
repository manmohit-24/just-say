type ErrorFields = Record<string, string>;

class NonRetryableError extends Error {
  public readonly errors?: ErrorFields;
  constructor(message: string, options?: { cause?: unknown }, errors?: ErrorFields) {
    super(message, options);
    this.name = "NonRetryableError";
    if (errors) this.errors = errors;
  }
}

class RetryableError extends Error {
  public readonly errors?: ErrorFields;
  constructor(message: string, options?: { cause?: unknown }, errors?: ErrorFields) {
    super(message, options);
    this.name = "RetryableError";
    if (errors) this.errors = errors;
  }
}

export { NonRetryableError, RetryableError, type ErrorFields };
