import type { SendMessageDto } from "@repo/contracts";

import { apiFetch } from "@/shared/api";

const sendMessage = (dto: SendMessageDto) =>
  apiFetch<null>("/messages", { method: "POST", body: dto });

export { sendMessage };
