import { z } from "zod";

const getUserSchema = z.object({
  id: z.cuid2(),
});

type GetUserDto = z.infer<typeof getUserSchema>;

type GetUserResponse = {
  name: string;
  username: string;
  email?: string;
};

export { getUserSchema };
export type { GetUserDto, GetUserResponse };
