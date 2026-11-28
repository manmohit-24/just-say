import "server-only";

import { cookies } from "next/headers";

import { buildUrl, parseResponse, safeFetch, type Query } from "./request";
import { env } from "@/config/env";

// GET request made on the Next server. The visitor's cookies are passed on to the API,
// so it sees the same session as the browser.

const baseUrl = env.API_INTERNAL_URL ?? env.NEXT_PUBLIC_APP_URL;

const serverFetch = async <T>(path: string, query?: Query): Promise<T> => {
  const cookie = (await cookies()).toString();
  const url = buildUrl(path, query, baseUrl);
  console.log(url);

  const res = await safeFetch(url, {
    headers: cookie ? { cookie } : {},
    cache: "no-store",
  });

  return parseResponse<T>(res);
};

export { serverFetch };
