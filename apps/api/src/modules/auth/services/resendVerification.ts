import ms from "ms";

import type { ResendVerificationlDto } from "@repo/contracts";
import { emailTemplates } from "@repo/jobs/email";

import { UserStatus } from "@/generated/prisma/enums.js";

import { env } from "@/config/env.js";

import { prisma } from "@/shared/prisma.js";
import { logger } from "@/shared/logger.js";
import { createEmailJob } from "@/shared/queues/email.js";

import { generateSecureToken, hashToken } from "../crypto/token.js";

const resendVerification = async ({ email }: ResendVerificationlDto) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || user.status !== UserStatus.UNVERIFIED) return;

  const activationCode = generateSecureToken();
  const activationTokenHash = hashToken(activationCode);
  const activationTokenExpiresAt = new Date(Date.now() + ms("1d"));

  await prisma.user.update({
    where: { id: user.id },
    data: {
      activationTokenHash,
      activationTokenExpiresAt,
    },
  });

  if (env.NODE_ENV === "development")
    logger.warn(`Only printing in dev env, for testing , ${activationCode}`);

  // TODO (EMAIL) : send activation code via email here
  await createEmailJob({
    to: user.email,
    template: emailTemplates.emailVerification,
    data: {
      name: user.name,
      verificationUrl: `${env.CLIENT_URL}/auth/verify-email?token=${activationCode}`,
      date: activationTokenExpiresAt,
    },
  });
};

export { resendVerification };
