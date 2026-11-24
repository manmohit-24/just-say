import type { ResetPasswordDto } from "@repo/contracts";

import { apiFetch } from "@/shared/api";

const resetPassword = (dto: ResetPasswordDto) =>
  apiFetch<null>("/auth/reset-password", { method: "POST", body: dto });

export { resetPassword };
