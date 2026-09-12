import type { VerifyEmailDto } from "@repo/contracts";
import { emailTemplates } from "@repo/jobs/email";
import { prisma, UserStatus } from "@repo/db";

import { env } from "@/config/env.js";

import { createEmailJob } from "@/shared/queues/email.js";

import { hashToken } from "../crypto/token.js";
import { consumeEmailVerificationToken } from "../redis/emailVerification.js";

const verifyEmail = async ({ token }: VerifyEmailDto) => {
  const userId = await consumeEmailVerificationToken(hashToken(token));

  const user = await prisma.user.update({
    where: {
      id: userId,
      status: UserStatus.UNVERIFIED,
    },
    data: {
      status: UserStatus.ACTIVE,
      isAcceptingMessages: true,
      deletionScheduledAt: null,
    },
    select: {
      email: true,
      username: true,
      name: true,
    },
  });

  await createEmailJob({
    to: user.email,
    template: emailTemplates.welcome,
    data: {
      name: user.name,
      dashboardLink: `${env.CLIENT_URL}/`,
    },
  });
};

export { verifyEmail };
