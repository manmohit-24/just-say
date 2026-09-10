import { prisma } from "@repo/db";
import type { UpdateProfileDto } from "@repo/contracts";

const updateProfile = async (dto: UpdateProfileDto, id: string) => {
  const { name, username } = dto;

  await prisma.user.update({
    where: { id },
    data: {
      ...(name && { name }),
      ...(username && { username }),
    },
  });
};

export { updateProfile };
