import { apiFetch } from "@/shared/api";

// hides the message from the logged in user only
const deleteMessageForUser = (messageId: string) =>
  apiFetch<null>(`/messages/${encodeURIComponent(messageId)}`, { method: "PATCH" });

export { deleteMessageForUser };
