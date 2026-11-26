import { z } from "zod";
import { usernameSchema } from "../validation/fields.js";

export const anonymitySchema = z.enum(["NONE", "ANONYMOUS", "TRULY_ANONYMOUS"]);

export type Anonimity = z.infer<typeof anonymitySchema>;

const sendMessageSchema = z.object({
  content: z.string().trim().min(1, "Message is required."),
  receiver: usernameSchema,
  anonymity: anonymitySchema,
});

type SendMessageDto = z.infer<typeof sendMessageSchema>;

export { sendMessageSchema };
export type { SendMessageDto };
