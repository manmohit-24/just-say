import ms from "ms";

import type { RegisterDto } from "@repo/contracts";
import { prisma, UserStatus } from "@repo/db";
import { emailTemplates } from "@repo/jobs/email";

import { logger } from "@/shared/logger.js";
import { ConflictError } from "@/shared/errors/ConflictError.js";
import { createEmailJob } from "@/shared/queues/email.js";

import { hashPassword } from "../crypto/password.js";
import { generateSecureToken, hashToken } from "../crypto/token.js";

import { env } from "@/config/env.js";
import { storeEmailVerificationToken } from "../redis/emailVerification.js";

const register = async (dto: RegisterDto) => {
  const now = new Date();

  const { name, username, email, password } = dto;

  const existingUsers = await prisma.user.findMany({
    where: {
      OR: [{ email }, { username }],
    },
  });

  const emailTaken = existingUsers.some((user) => user.email === email);
  if (emailTaken) throw new ConflictError("Email is already registered.");

  const usernameTaken = existingUsers.some((user) => user.username === username);
  if (usernameTaken) throw new ConflictError("Username is already taken.");

  const passwordHash = await hashPassword(password);
  const deletionScheduledAt = new Date(now.getTime() + ms("1d"));

  const user = await prisma.user.create({
    data: {
      name,
      username,
      email,
      passwordHash,
      isAcceptingMessages: false,
      status: UserStatus.UNVERIFIED,
      deletionScheduledAt,
    },
    select: { id: true },
  });

  const verificationToken = generateSecureToken();
  await storeEmailVerificationToken(hashToken(verificationToken), user.id);

  if (env.NODE_ENV === "development")
    logger.warn(`Only printing in dev env, for testing , ${verificationToken}`);

  await createEmailJob({
    to: email,
    template: emailTemplates.emailVerification,
    data: {
      name: name,
      verificationUrl: `${env.CLIENT_URL}/auth/verify-email?token=${verificationToken}`,
      deletionScheduledAt: deletionScheduledAt,
      tokenExpiresAt: new Date(now.getTime() + ms("30min")),
    },
  });

  return { name, username, email };
};

export { register };
