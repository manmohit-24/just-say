import type { ForgotPasswordDto } from "@repo/contracts";

import { apiFetch } from "@/shared/api";

const forgotPassword = (dto: ForgotPasswordDto) =>
  apiFetch<null>("/auth/forgot-password", { method: "POST", body: dto });

export { forgotPassword };
