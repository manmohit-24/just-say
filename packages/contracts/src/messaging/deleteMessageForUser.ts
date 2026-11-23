import { z } from "zod";
export const deleteMessageForUserSchema = z.object({ messageId: z.string().min(1, "Message ID is required.") });
export type DeleteMessageForUserDto = z.infer<typeof deleteMessageForUserSchema>;