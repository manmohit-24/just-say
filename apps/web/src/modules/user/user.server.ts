import "server-only";

import { cache } from "react";
import type { GetUserResponse } from "@repo/contracts";

import { ApiError } from "@/shared/api";
import { serverFetch } from "@/shared/api/server";

// Public profile of a user, or null if there is no such user. cache() makes the page and its
// metadata share one API call.
const getUserByUsername = cache(async (username: string): Promise<GetUserResponse | null> => {
  try {
    return await serverFetch<GetUserResponse>(`/user/${encodeURIComponent(username)}`);
  } catch (error) {
    // 404: unknown user, 400: not a valid username. Either way there is nobody to show.
    if (error instanceof ApiError && (error.status === 404 || error.status === 400)) return null;
    throw error;
  }
});

export { getUserByUsername };
