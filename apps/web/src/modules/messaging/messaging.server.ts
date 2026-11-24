import "server-only";

import type { GetMessagesResponse } from "@repo/contracts";

import { serverFetch } from "@/shared/api/server";

import type { MessageRole } from "./messaging.types";

// First page of a message list, loaded while the page renders on the server.
// If it fails the list simply loads (and reports the error) in the browser instead.
const getInitialMessages = async (role: MessageRole): Promise<GetMessagesResponse | null> => {
  try {
    return await serverFetch<GetMessagesResponse>("/messages", { role });
  } catch {
    return null;
  }
};

export { getInitialMessages };
