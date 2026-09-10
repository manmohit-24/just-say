import ms from "ms";

import type { DeleteProfileDto } from "@repo/contracts";
import { emailTemplates } from "@repo/jobs/email";

import { UserStatus } from "@/generated/prisma/enums.js";

import { prisma } from "@/shared/prisma.js";
import { BadRequestError, NotFoundError } from "@/shared/errors/index.js";

import { verifyPassword } from "@/modules/auth/index.js";
import { createEmailJob } from "@/shared/queues/email.js";

const deleteProfile = async (dto: DeleteProfileDto, id: string) => {
  const { password } = dto;

  // for better ux, we are rounding off the time to 12 am of next day
  const deletionScheduledAt = new Date(Date.now() + ms("8d"));
  deletionScheduledAt.setHours(0, 0, 0, 0);

  const deletedUser = await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { id },
    });

    if (!user) throw new NotFoundError("user not found");

    if (user.status !== UserStatus.ACTIVE) throw new BadRequestError("Invalid Request");

    const isMatch = await verifyPassword(password, user.passwordHash);

    if (!isMatch) throw new BadRequestError("Invalid Password");

    await tx.user.update({
      where: { id: user.id },
      data: {
        status: UserStatus.DELETION_SCHEDULED,
        deletionScheduledAt,
      },
    });

    await tx.session.deleteMany({
      where: { userId: user.id },
    });

    // TODO : add to worker

    return { name: user.name, email: user.email };
  });

  await createEmailJob({
    to: deletedUser.email,
    template: emailTemplates.accountDeletionAlert,
    data: {
      name: deletedUser.name,
      date: deletionScheduledAt,
    },
  });
};

export { deleteProfile };
