import "server-only";

import { cookies } from "next/headers";

import { buildUrl, parseResponse, safeFetch, type Query } from "./request";

// GET request made on the Next server. The visitor's cookies are passed on to the API,
// so it sees the same session as the browser.
const serverFetch = async <T>(path: string, query?: Query): Promise<T> => {
  const cookie = (await cookies()).toString();

  const res = await safeFetch(buildUrl(path, query), {
    headers: cookie ? { cookie } : {},
    cache: "no-store",
  });

  return parseResponse<T>(res);
};

export { serverFetch };
