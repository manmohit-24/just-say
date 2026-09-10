import "dotenv/config";
import { z } from "zod";
import ms, { type StringValue } from "ms";

// using ms inbuilt parse function indirectly to validate durations
const isMSDuration = (value: string): value is StringValue =>
  ms(value as StringValue) !== undefined;

const envSchema = z
  .object({
    NODE_ENV: z.enum(
      ["development", "production"],
      "NODE_ENV must be either 'development' or 'production'."
    ),

    PORT: z
      .string()
      .trim()
      .min(1, "PORT is required.")
      .transform(Number)
      .pipe(
        z
          .number()
          .int("PORT must be an integer.")
          .min(1, "PORT must be between 1 and 65535.")
          .max(65535, "PORT must be between 1 and 65535.")
      ),

    DATABASE_URL: z.string().trim().min(1, "DATABASE_URL is required."),

    CLIENT_URL: z
      .string()
      .trim()
      .pipe(
        z.url({
          error: "CLIENT_URL must be a valid URL.",
        })
      ),

    ACCESS_TOKEN_SECRET: z
      .string()
      .trim()
      .min(32, "ACCESS_TOKEN_SECRET should be at least 32 characters"),

    ACCESS_TOKEN_EXPIRES_IN: z
      .string()
      .trim()
      .refine(isMSDuration, "ACCESS_TOKEN_EXPIRES_IN is an invalid duration format"),

    SESSION_TTL: z
      .string()
      .trim()
      .refine(isMSDuration, "SESSION_TTL is an invalid duration format"),

    REDIS_URL: z.string().trim().min(1, "REDIS_URL is required."),
  })
  .superRefine((env, ctx) => {
    // Access Token must expires before Refresh Token
    if (ms(env.ACCESS_TOKEN_EXPIRES_IN) >= ms(env.SESSION_TTL)) {
      ctx.addIssue({
        code: "custom",
        path: ["ACCESS_TOKEN_EXPIRES_IN", "SESSION_TTL"],
        message: "Access token lifetime must be shorter than refresh session lifetime.",
      });
    }
  });

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(`
\x1b[31m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
\x1b[1mERROR: ENVIRONMENT VARIABLES VALIDATION FAILED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m

${z.prettifyError(parsed.error)}

\x1b[90m Application startup aborted. \x1b[0m
`);

  process.exit(1);
}

const env = parsed.data;

export { env };
