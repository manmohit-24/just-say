import type { VerifyEmailDto } from "@repo/contracts";

import { apiFetch } from "@/shared/api";

const verifyEmail = (dto: VerifyEmailDto) =>
  apiFetch<null>("/auth/verify-email", { method: "POST", body: dto });

export { verifyEmail };
