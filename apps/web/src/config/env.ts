import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z
    .url("NEXT_PUBLIC_API_URL must be a valid URL.")
    .default("http://localhost:3001"),
  NEXT_PUBLIC_APP_URL: z
    .url("NEXT_PUBLIC_APP_URL must be a valid URL.")
    .default("http://localhost:3000"),
  API_INTERNAL_URL: z
    .url("API_INTERNAL_URL must be a valid URL.")
    .optional(),
});

// NEXT_PUBLIC_* values are inlined at build time, so each one has to be read by its full name.
// API_INTERNAL_URL is only used by server-side requests inside the Compose network.
const env = envSchema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  API_INTERNAL_URL: process.env.API_INTERNAL_URL,
});

const apiUrl = (isServer: boolean) =>
  isServer && env.API_INTERNAL_URL ? env.API_INTERNAL_URL : env.NEXT_PUBLIC_API_URL;

export { env, apiUrl };
