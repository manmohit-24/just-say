import type { UpdateProfileDto } from "@repo/contracts";

import { apiFetch } from "@/shared/api";

const updateProfile = (dto: UpdateProfileDto) =>
  apiFetch<null>("/user/me", { method: "PATCH", body: dto });

export { updateProfile };
