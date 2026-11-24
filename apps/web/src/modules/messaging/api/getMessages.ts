import type { GetMessagesDto, GetMessagesResponse } from "@repo/contracts";

import { apiFetch } from "@/shared/api";

const getMessages = ({ role, cursor }: GetMessagesDto, signal?: AbortSignal) =>
  apiFetch<GetMessagesResponse>("/messages", { query: { role, cursor }, signal });

export { getMessages };
