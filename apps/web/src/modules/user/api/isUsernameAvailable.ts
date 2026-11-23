import type { IsUsernameAvailableRespose } from "@repo/contracts";

import { apiFetch } from "@/shared/api";

const isUsernameAvailable = (username: string, signal?: AbortSignal) =>
  apiFetch<IsUsernameAvailableRespose>("/user/is-username-available", {
    query: { username },
    signal,
  });

export { isUsernameAvailable };
