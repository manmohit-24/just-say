import type { IsUsernameAvailableDto } from "@repo/contracts";

import { prisma } from "@repo/db";

const isUsernameAvailable = async (dto: IsUsernameAvailableDto) => {
  const user = await prisma.user.findUnique({
    where: { username: dto.username },
  });

  return !user;
};

export { isUsernameAvailable };
