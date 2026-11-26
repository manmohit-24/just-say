import { z } from "zod";

export const deleteMessageSchema = z.object({
  messageId: z.cuid2("Message ID is required."),
});

export type DeleteMessageDto = z.infer<typeof deleteMessageSchema>;
