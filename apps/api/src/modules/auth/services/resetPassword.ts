import type { ResetPasswordDto } from "@repo/contracts";
import { emailTemplates } from "@repo/jobs/email";

import { prisma } from "@/shared/prisma.js";
import { NotFoundError } from "@/shared/errors/index.js";
import { createEmailJob } from "@/shared/queues/email.js";

import { hashToken } from "../crypto/token.js";
import { hashPassword } from "../crypto/password.js";
import { consumePasswordResetToken } from "../redis/passwordReset.js";

const resetPassword = async ({ token, newPassword }: ResetPasswordDto) => {
  const tokenHash = hashToken(token);

  const userId = await consumePasswordResetToken(tokenHash);

  if (!userId) throw new NotFoundError("Invalid or expired reset token");

  const passwordHash = await hashPassword(newPassword);

  const updateUser = await prisma.$transaction(async (tx) => {
    const user = await tx.user.update({
      where: {
        id: userId,
      },
      data: {
        passwordHash,
      },
      select: {
        email: true,
        name: true,
        id: true,
      },
    });

    await tx.session.deleteMany({ where: { userId: user.id } });

    return {
      email: user.email,
      name: user.name,
    };
  });

  await createEmailJob({
    to: updateUser.email,
    template: emailTemplates.passwordChangedAlert,
    data: {
      name: updateUser.name,
      time: new Date(),
    },
  });
};

export { resetPassword };
