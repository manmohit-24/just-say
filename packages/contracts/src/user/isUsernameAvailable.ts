import { z } from "zod";
import { usernameSchema } from "../validation/fields.js";

const isUsernameAvailableSchema = z.object({
  username: usernameSchema,
});

type IsUsernameAvailableDto = z.infer<typeof isUsernameAvailableSchema>;

type IsUsernameAvailableRespose = {
  available: boolean;
};

export { isUsernameAvailableSchema };
export type { IsUsernameAvailableDto, IsUsernameAvailableRespose };
