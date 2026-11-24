import type { DeleteProfileDto } from "@repo/contracts";

import { apiFetch } from "@/shared/api";

const deleteProfile = (dto: DeleteProfileDto) =>
  apiFetch<null>("/user/me", { method: "DELETE", body: dto });

export { deleteProfile };
