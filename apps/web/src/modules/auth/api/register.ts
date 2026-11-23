import type { RegisterDto, RegisterResponse } from "@repo/contracts";

import { apiFetch } from "@/shared/api";

const register = (dto: RegisterDto) =>
  apiFetch<RegisterResponse>("/auth/register", { method: "POST", body: dto });

export { register };
