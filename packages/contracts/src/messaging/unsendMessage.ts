import { z } from "zod";
export const unsendMessageSchema = z.object({ messageId: z.string().min(1, "Message ID is required.") });
export type UnsendMessageDto = z.infer<typeof unsendMessageSchema>;