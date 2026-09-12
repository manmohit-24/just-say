import { z } from "zod";
import { identifierSchema, passwordSchema } from "../validation/fields.js";

const loginSchema = z.object({
  identifier: identifierSchema,
  password: passwordSchema,
});

type LoginDto = z.infer<typeof loginSchema>;

type LoginResponse = {
  name: string;
  email: string;
  username: string;
};

export { loginSchema };
export type { LoginDto, LoginResponse };
