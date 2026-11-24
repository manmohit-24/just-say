import type { VerifyEmailChangeDto } from "@repo/contracts";

import { apiFetch } from "@/shared/api";

const verifyEmailChange = (dto: VerifyEmailChangeDto) =>
  apiFetch<null>("/user/me/email/verify", { method: "POST", body: dto });

export { verifyEmailChange };
