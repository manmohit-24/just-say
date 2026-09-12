import { z } from "zod";
import { emailSchema, nameSchema, passwordSchema, usernameSchema } from "../validation/fields.js";

const registerSchema = z.object({
  name: nameSchema,
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
});

type RegisterDto = z.infer<typeof registerSchema>;

type RegisterResponse = {
  name: string;
  email: string;
  username: string;
};

export { registerSchema };
export type { RegisterDto, RegisterResponse };
