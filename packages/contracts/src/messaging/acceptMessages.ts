import { z } from "zod";
export const acceptMessagesSchema = z.object({ acceptMessages: z.boolean() });
export type AcceptMessagesDto = z.infer<typeof acceptMessagesSchema>;
export type AcceptMessagesResponse = { isAcceptingMessages: boolean };