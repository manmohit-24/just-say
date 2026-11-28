import { ErrorCode, type ApiResponse } from "@repo/contracts";

import { env } from "@/config/env";

import { ApiError } from "./errors";

type Query = Record<string, string | undefined>;

const buildUrl = (path: string, query?: Query, baseUrl = env.NEXT_PUBLIC_API_URL) => {
  const url = new URL(path, baseUrl);

  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined) url.searchParams.set(key, value);
  }

  return url;
};

// fetch that turns "could not reach the API" into an ApiError
const safeFetch = async (url: URL, init: RequestInit) => {
  try {
    return await fetch(url, init);
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    throw new ApiError(0, "NETWORK_ERROR", "Unable to reach the server. Please try again.");
  }
};

// Unwraps the { success, data } response. Failures are thrown as ApiError.
const parseResponse = async <T>(res: Response): Promise<T> => {
  const json = (await res.json().catch(() => null)) as ApiResponse<T> | null;

  if (res.ok && json?.success) return json.data;
  if (json && !json.success) throw new ApiError(res.status, json.code, json.message, json.errors);

  throw new ApiError(
    res.status,
    ErrorCode.INTERNAL_SERVER_ERROR,
    "Unexpected response from the server."
  );
};

export { buildUrl, safeFetch, parseResponse };
export type { Query };
