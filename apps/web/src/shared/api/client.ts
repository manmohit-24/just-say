import { ApiError } from "./errors";
import { buildUrl, parseResponse, safeFetch, type Query } from "./request";

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  query?: Query;
  body?: unknown;
  signal?: AbortSignal | undefined;
};

const REFRESH_PATH = "/auth/refresh-access-token";

const send = (path: string, { method = "GET", query, body, signal }: RequestOptions) =>
  safeFetch(buildUrl(path, query), {
    method,
    // the auth cookies are set by the API, so they have to be sent along
    credentials: "include",
    ...(body !== undefined && {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
    ...(signal && { signal }),
  });

let pendingRefresh: Promise<boolean> | null = null;

// Asks the API for a new access token (the refresh token cookie is sent automatically).
// Refresh tokens can only be used once, so parallel callers share a single request.
const refreshSession = () => {
  pendingRefresh ??= send(REFRESH_PATH, { method: "POST" })
    .then((res) => res.ok)
    .catch(() => false)
    .finally(() => {
      pendingRefresh = null;
    });

  return pendingRefresh;
};

// If the access token has expired, the session is refreshed and the request is sent once more.
const sendWithRefresh = async (path: string, options: RequestOptions) => {
  const res = await send(path, options);

  if (res.status === 401 && path !== REFRESH_PATH && (await refreshSession())) {
    return send(path, options);
  }

  return res;
};

// Calls the Express API from the browser and unwraps the { success, data } response.
const apiFetch = async <T>(path: string, options: RequestOptions = {}): Promise<T> =>
  parseResponse<T>(await sendWithRefresh(path, options));

// Same call, but returns the raw body for endpoints that stream text.
const apiStream = async (path: string, options: RequestOptions = {}) => {
  const res = await sendWithRefresh(path, options);

  if (!res.ok) await parseResponse<never>(res);
  if (!res.body) throw new ApiError(res.status, "NETWORK_ERROR", "The server sent an empty reply.");

  return res.body;
};

export { apiFetch, apiStream, refreshSession };
