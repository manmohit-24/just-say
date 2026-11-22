import { NotFoundError } from "@/shared/errors/NotFoundError.js";
import { Prisma, prisma } from "@repo/db";
import type { GetUserByIdDto, GetUserByUsernameDto } from "@repo/contracts";

const getUserById = async (dto: GetUserByIdDto) => {
  const user = await prisma.user.findUnique({
    where: { id: dto.id },
  });

  if (!user) throw new NotFoundError("user not found");
  return parse(user);
};

const getUserByUsername = async (dto: GetUserByUsernameDto) => {
  const user = await prisma.user.findUnique({
    where: { username: dto.username },
  });

  if (!user) throw new NotFoundError("user not found");
  return parse(user);
};

const parse = (user: Prisma.UserModel) => {
  return {
    name: user.name,
    username: user.username,
    email: user.email,
    isAcceptingMessages: user.isAcceptingMessages,
  };
};

export { getUserById, getUserByUsername };
