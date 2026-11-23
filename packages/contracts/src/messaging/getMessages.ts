import { z } from "zod";
import type { Anonimity } from "./sendMessage.js";

export const getMessagesSchema = z.object({
  role: z.enum(["RECIEVER", "SENDER"]),
  cursor: z.string().optional(),
});

export type GetMessagesDto = z.infer<typeof getMessagesSchema>;

export interface MessageListItem {
  id: string;
  content: string;
  createdAt: string;
  status: "SENT" | "READ";
  anonymity: Anonimity;
  sender?: { username: string; name: string } | null;
  receiver?: { username: string; name: string } | null;
}

export interface GetMessagesResponse {
  messages: MessageListItem[];
  nextCursor: string | null;
}
