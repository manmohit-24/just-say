import type { VerifyEmailChangeDto } from "@repo/contracts";
import { emailTemplates } from "@repo/jobs/email";

import { prisma } from "@/shared/prisma.js";
import { createEmailJob } from "@/shared/queues/email.js";

import { hashToken } from "@/modules/auth/crypto/token.js";

import { consumeEmailChangeVerifyChallenge } from "../redis/emailChangeVerify.js";

const verifyEmailChange = async (dto: VerifyEmailChangeDto) => {
  const now = new Date();

  const { otp, challengeId } = dto;

  const otpHash = hashToken(otp);

  const { userId, newEmail } = await consumeEmailChangeVerifyChallenge(challengeId, otpHash);

  const oldUser = await prisma.$transaction(async (tx) => {
    const oldUser = await tx.user.findUniqueOrThrow({
      where: { id: userId },
      select: { email: true, name: true },
    });

    await tx.user.update({
      where: { id: userId },
      data: { email: newEmail },
    });

    return oldUser;
  });

  await Promise.all([
    createEmailJob({
      to: newEmail,
      template: emailTemplates.emailChangedConfirmation,
      data: {
        name: oldUser.name,
        newEmail,
        time: now,
      },
    }),
    createEmailJob({
      to: oldUser.email,
      template: emailTemplates.emailChangedAlert,
      data: {
        name: oldUser.name,
        newEmail,
        oldEmail: oldUser.email,
        time: now,
      },
    }),
  ]);
};

export { verifyEmailChange };
