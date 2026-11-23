import { z } from "zod";
export const getMessagesSchema = z.object({ role: z.enum(["receiver", "sender"]), cursor: z.string().optional() });
export type GetMessagesDto = z.infer<typeof getMessagesSchema>;
export interface MessageListItem { id: string; content: string; createdAt: string; status: string; anonymity: "NONE" | "ANONYMOUS" | "TRULY_ANONYMOUS"; sender?: { id: string | null; username: string; name: string } | null; receiver?: { id: string; username: string; name: string } | null; }
export interface GetMessagesResponse { messages: MessageListItem[]; nextCursor: string | null; }