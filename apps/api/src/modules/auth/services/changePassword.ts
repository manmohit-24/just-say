import { PrismaClientKnownRequestError } from "@/generated/prisma/internal/prismaNamespace.js";
import { UserStatus } from "@/generated/prisma/enums.js";

import type { ChangePasswordDto } from "@repo/contracts";
import { emailTemplates } from "@repo/jobs/email";

import { prisma } from "@/shared/prisma.js";
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from "@/shared/errors/index.js";
import { createEmailJob } from "@/shared/queues/email.js";

import { hashPassword, verifyPassword } from "../crypto/password.js";

const changePassword = async (
  dto: ChangePasswordDto,
  auth: { userId: string; sessionId: string }
) => {
  const { oldPassword, newPassword } = dto;

  if (oldPassword === newPassword)
    throw new BadRequestError("New Password should not be same as old password");

  const { userId, sessionId } = auth;

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) throw new NotFoundError("User not found");

  if (user.status !== UserStatus.ACTIVE) throw new ForbiddenError("Account is not active");

  // keeping expesive hashing operations outside transaction
  const isMatch = await verifyPassword(oldPassword, user.passwordHash);

  if (!isMatch) throw new BadRequestError("Invalid Old Password");

  const passwordHash = await hashPassword(newPassword);

  const updatedUser = await prisma.$transaction(async (tx) => {
    let updatedUser;

    try {
      updatedUser = await tx.user.update({
        where: {
          id: user.id,
          passwordHash: user.passwordHash,
          // matching password hash too as there might be another request,
          // that could have changed password, before this transaction starts.
        },
        data: { passwordHash },
        select: { name: true, email: true, updatedAt: true },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === "P2025")
        throw new ConflictError("Password was changed by another request. Please try again.");

      throw error;
    }

    // delete all sessions except current
    await tx.session.deleteMany({
      where: {
        userId: user.id,
        id: { not: sessionId },
      },
    });

    return updatedUser;
  });

  await createEmailJob({
    to: updatedUser.email,
    template: emailTemplates.passwordChangedAlert,
    data: {
      name: updatedUser.name,
      time: updatedUser.updatedAt,
    },
  });
};

export { changePassword };
