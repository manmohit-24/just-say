import { NotFoundError } from "@/shared/errors/NotFoundError.js";
import { prisma } from "@repo/db";
import type { GetUserDto } from "@repo/contracts";

const getUser = async (dto: GetUserDto) => {
  const user = await prisma.user.findUnique({
    where: { id: dto.id },
  });

  if (!user) throw new NotFoundError("user not found");

  return {
    name: user.name,
    username: user.username,
    email: user.email,
  };
};

export { getUser };
