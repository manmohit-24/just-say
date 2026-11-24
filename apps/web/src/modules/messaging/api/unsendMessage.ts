import { apiFetch } from "@/shared/api";

// removes a message the logged in user sent, for both sides
const unsendMessage = (messageId: string) =>
  apiFetch<null>(`/messages/${encodeURIComponent(messageId)}`, { method: "DELETE" });

export { unsendMessage };
