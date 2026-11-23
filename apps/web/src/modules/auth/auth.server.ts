import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { GetUserResponse } from "@repo/contracts";

import { serverFetch } from "@/shared/api/server";

// The logged in user, or null. cache() makes the layout and the page of one request
// share a single API call.
const getCurrentUser = cache(async (): Promise<GetUserResponse | null> => {
  // no cookies, nobody is logged in: skip the API call
  if ((await cookies()).size === 0) return null;

  try {
    return await serverFetch<GetUserResponse>("/user/me");
  } catch {
    // expired session or API down: the visitor is treated as logged out
    return null;
  }
});

// for pages that make no sense for a logged in user (login, register, landing page)
const redirectIfAuthenticated = async () => {
  if (await getCurrentUser()) redirect("/dashboard");
};

export { getCurrentUser, redirectIfAuthenticated };
