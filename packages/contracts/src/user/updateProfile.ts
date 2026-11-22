import { z } from "zod";
import { nameSchema, usernameSchema } from "../validation/fields.js";

const updateProfileSchema = z
  .object({
    name: nameSchema.optional(),
    username: usernameSchema.optional(),
    isAcceptingMessages: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, "At least one field must be provided");

type UpdateProfileDto = z.infer<typeof updateProfileSchema>;

export { updateProfileSchema };
export type { UpdateProfileDto };
