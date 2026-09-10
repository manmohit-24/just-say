import type { VerifyEmailDto } from "@repo/contracts";
import { emailTemplates } from "@repo/jobs/email";

import { UserStatus } from "@/generated/prisma/enums.js";

import { env } from "@/config/env.js";

import { prisma } from "@/shared/prisma.js";
import { NotFoundError } from "@/shared/errors/index.js";
import { createEmailJob } from "@/shared/queues/email.js";

import { hashToken } from "../crypto/token.js";

const verifyEmail = async ({ token }: VerifyEmailDto) => {
  const hash = hashToken(token);

  const result = await prisma.user.updateManyAndReturn({
    where: {
      status: UserStatus.UNVERIFIED,
      activationTokenHash: hash,
      activationTokenExpiresAt: {
        gt: new Date(),
      },
    },
    data: {
      activationTokenHash: null,
      activationTokenExpiresAt: null,
      status: UserStatus.ACTIVE,
      isAcceptingMessages: true,
    },
    select: {
      email: true,
      username: true,
      name: true,
    },
  });

  if (!result || result.length === 0 || !result[0])
    throw new NotFoundError("Invalid or expired verification token");

  const user = result[0];
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
