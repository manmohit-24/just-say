import type { LoginDto, LoginResponse } from "@repo/contracts";

import { apiFetch } from "@/shared/api";

const login = (dto: LoginDto) =>
  apiFetch<LoginResponse>("/auth/login", { method: "POST", body: dto });

export { login };
