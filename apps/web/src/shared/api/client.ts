import { ErrorCode, type ApiResponse } from "@repo/contracts";

import { env } from "@/config/env";

import { ApiError } from "./errors";

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  query?: Record<string, string | undefined>;
  body?: unknown;
  signal?: AbortSignal | undefined;
};

// Calls the Express API from the browser and unwraps the { success, data } response.
// Failures are thrown as ApiError, so callers only deal with one error type.
const apiFetch = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const { method = "GET", query, body, signal } = options;

  const url = new URL(path, env.NEXT_PUBLIC_API_URL);
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined) url.searchParams.set(key, value);
  }

  let res: Response;
  try {
    res = await fetch(url, {
      method,
      // the auth cookies are set by the API, so they have to be sent along
      credentials: "include",
      ...(body !== undefined && {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }),
      ...(signal && { signal }),
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    throw new ApiError(0, "NETWORK_ERROR", "Unable to reach the server. Please try again.");
  }

  const json = (await res.json().catch(() => null)) as ApiResponse<T> | null;

  if (res.ok && json?.success) return json.data;
  if (json && !json.success) throw new ApiError(res.status, json.code, json.message, json.errors);

  throw new ApiError(
    res.status,
    ErrorCode.INTERNAL_SERVER_ERROR,
    "Unexpected response from the server."
  );
};

export { apiFetch };
