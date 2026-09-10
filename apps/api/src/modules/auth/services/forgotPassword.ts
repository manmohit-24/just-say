import type { ForgotPasswordDto } from "@repo/contracts";
import { emailTemplates } from "@repo/jobs/email";

import { env } from "@/config/env.js";

import { prisma } from "@/shared/prisma.js";
import { createEmailJob } from "@/shared/queues/email.js";

import { generateSecureToken, hashToken } from "../crypto/token.js";
import { storePasswordResetToken } from "../redis/passwordReset.js";

const forgotPassword = async ({ email }: ForgotPasswordDto) => {
  const token = generateSecureToken();
  const tokenHash = hashToken(token);

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return;

  await storePasswordResetToken(tokenHash, user.id);

  await createEmailJob({
    to: user.email,
    template: emailTemplates.passwordReset,
    data: {
      name: user.name,
      resetUrl: `${env.CLIENT_URL}/auth/reset-password?token=${token}`,
    },
  });
};

export { forgotPassword };
