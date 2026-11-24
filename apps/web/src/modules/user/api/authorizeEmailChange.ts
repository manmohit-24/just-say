import type { AuthorizeEmailChangeDto, AuthorizeEmailChangeResponse } from "@repo/contracts";

import { apiFetch } from "@/shared/api";

const authorizeEmailChange = (dto: AuthorizeEmailChangeDto) =>
  apiFetch<AuthorizeEmailChangeResponse>("/user/me/email/authorize", {
    method: "POST",
    body: dto,
  });

export { authorizeEmailChange };
