import ms from "ms";
import { nanoid } from "nanoid";

import type { RegisterDto } from "@repo/contracts";
import { emailTemplates } from "@repo/jobs/email";

import { UserStatus } from "@/generated/prisma/enums.js";
import type { User } from "@/generated/prisma/client.js";

import { prisma } from "@/shared/prisma.js";
import { logger } from "@/shared/logger.js";
import { ConflictError } from "@/shared/errors/ConflictError.js";
import { createEmailJob } from "@/shared/queues/email.js";

import { hashPassword } from "../crypto/password.js";
import { generateSecureToken, hashToken } from "../crypto/token.js";

import { env } from "@/config/env.js";

const register = async (dto: RegisterDto) => {
  const now = new Date();

  const { name, username, email, password } = dto;

  // check if a verified user with this email already exists
  const existingUsers = await prisma.user.findMany({
    where: {
      OR: [{ email }, { username }],
    },
  });

  const deleteUserIds: User["id"][] = [];

  for (const user of existingUsers) {
    if (isUnverifiedExpiredUser(user, now)) {
      deleteUserIds.push(user.id);
      continue;
    }

    if (user.email === email) throw new ConflictError("Email is already registered.");

    throw new ConflictError("Username is already taken.");
  }

  const passwordHash = await hashPassword(password);
  const activationCode = generateSecureToken();
  const activationDeadline = new Date(now.getTime() + ms("1d"));

  const publicId = `usr_${nanoid(16)}`;

  const user = await prisma.$transaction(async (tx) => {
    await Promise.all(
      deleteUserIds.map((id) =>
        tx.user.delete({
          where: { id },
        })
      )
    );

    return await tx.user.create({
      data: {
        name,
        username,
        email,
        passwordHash,
        publicId,
        isAcceptingMessages: false,
        status: UserStatus.UNVERIFIED,
        activationTokenHash: hashToken(activationCode),
        activationTokenExpiresAt: activationDeadline,
      },
      select: {
        name: true,
        username: true,
        email: true,
        publicId: true,
      },
    });
  });

  if (env.NODE_ENV === "development")
    logger.warn(`Only printing in dev env, for testing , ${activationCode}`);

  await createEmailJob({
    to: user.email,
    template: emailTemplates.emailVerification,
    data: {
      name: user.name,
      verificationUrl: `${env.CLIENT_URL}/auth/verify-email?token=${activationCode}`,
      date: activationDeadline,
    },
  });
  return user;
};

function isUnverifiedExpiredUser(user: User, now: Date) {
  return (
    user.status === UserStatus.UNVERIFIED &&
    user.activationTokenExpiresAt &&
    user.activationTokenExpiresAt < now
  );
}

export { register };
