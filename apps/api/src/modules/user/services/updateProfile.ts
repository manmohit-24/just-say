import { prisma } from "@repo/db";
import type { UpdateProfileDto } from "@repo/contracts";

const updateProfile = async (dto: UpdateProfileDto, id: string) => {
  const { name, username, isAcceptingMessages } = dto;

  await prisma.user.update({
    where: { id },
    data: {
      ...(name && { name }),
      ...(username && { username }),
      ...(typeof isAcceptingMessages === "boolean" && { isAcceptingMessages }),
    },
  });
};

export { updateProfile };
