import { z } from "zod";
import { emailSchema, passwordSchema } from "../validation/fields.js";

const authorizeEmailChangeSchema = z.object({
  password: passwordSchema,
  newEmail: emailSchema,
  token: z.string().min(1),
});

type AuthorizeEmailChangeDto = z.infer<typeof authorizeEmailChangeSchema>;

type AuthorizeEmailChangeResponse = {
  challengeId: string;
};

export { authorizeEmailChangeSchema };
export type { AuthorizeEmailChangeDto, AuthorizeEmailChangeResponse };
