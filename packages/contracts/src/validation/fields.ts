import { z } from "zod";

const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, "Username must be at least 3 characters long.")
  .max(15, "Username must be at most 15 characters long.")
  .regex(/^[a-z0-9_]+$/, "Username may only contain lowercase letters, numbers and underscores.");

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email("Please enter a valid email address."));

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long.")
  .max(72, "Password must be at most 72 characters long.");

const nameSchema = z
  .string()
  .trim()
  .min(3, "Name must be at least 3 characters long.")
  .max(50, "Name must be at most 50 characters long.");

const identifierSchema = z
  .string()
  .trim()
  .superRefine((value, ctx) => {
    const isEmail = emailSchema.safeParse(value).success;
    const isUsername = usernameSchema.safeParse(value).success;

    if (!isEmail && !isUsername) {
      ctx.addIssue({
        code: "custom",
        message: "Enter a valid email address or username.",
      });
    }
  });

export { usernameSchema, emailSchema, passwordSchema, nameSchema, identifierSchema };
