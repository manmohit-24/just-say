import { z } from "zod";
import { usernameSchema } from "../validation/fields.js";

const getUserByIdSchema = z.object({
  id: z.cuid2(),
});

const getUserByUsernameSchema = z.object({
  username: usernameSchema,
});

type GetUserByIdDto = z.infer<typeof getUserByIdSchema>;
type GetUserByUsernameDto = z.infer<typeof getUserByUsernameSchema>;

type GetUserResponse = {
  name: string;
  username: string;
  email?: string;
  isAcceptingMessages: boolean;
};

export { getUserByIdSchema, getUserByUsernameSchema };
export type { GetUserByIdDto, GetUserByUsernameDto, GetUserResponse };
