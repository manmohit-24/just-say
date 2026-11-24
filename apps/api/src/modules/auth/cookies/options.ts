import type { CookieOptions } from "express";
import ms from "ms";

import { env } from "@/config/env.js";

const COOKIE_NAMES = {
  ACCESS: "accessToken",
  REFRESH: "refreshToken",
} as const;

const isProduction = env.NODE_ENV === "production";

const refreshCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/auth/refresh-access-token",
  maxAge: ms(env.SESSION_TTL),
} satisfies CookieOptions;

const accessCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: ms(env.ACCESS_TOKEN_EXPIRES_IN),
} satisfies CookieOptions;

export { COOKIE_NAMES, refreshCookieOptions, accessCookieOptions };
