import ms from "ms";

import type { LoginDto } from "@repo/contracts";

import { UserStatus } from "@/generated/prisma/enums.js";
import type { User } from "@/generated/prisma/client.js";

import { env } from "@/config/env.js";

import { prisma } from "@/shared/prisma.js";
import { ForbiddenError, BadRequestError } from "@/shared/errors/index.js";

import { verifyPassword } from "../crypto/password.js";
import { generateSecureToken, hashToken } from "../crypto/token.js";

import { emailTemplates } from "@repo/jobs/email";
import { createEmailJob } from "@/shared/queues/email.js";

const login = async (
  dto: LoginDto,
  deviceInfo: { ip: string | undefined; userAgent: string | undefined }
) => {
  const now = new Date();

  const { identifier, password } = dto;
  const { ip, userAgent } = deviceInfo;

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: identifier }, { username: identifier }],
    },
  });

  if (!user) throw new BadRequestError("Invalid credentials.");

  if (user.status === UserStatus.UNVERIFIED)
    throw new ForbiddenError("Please activate account before proceeding");

  const isReactivation = isReactivationLogin(user, now);

  const isPasswordValid = await verifyPassword(password, user.passwordHash);
  if (!isPasswordValid) throw new BadRequestError("Invalid credentials.");

  const refreshToken = generateSecureToken();
  const refreshExpiresAt = new Date(now.getTime() + ms(env.SESSION_TTL));

  const session = await prisma.$transaction(async (tx) => {
    const session = await tx.session.create({
      data: {
        userId: user.id,
        refreshTokenHash: hashToken(refreshToken),
        refreshExpiresAt,
        ...(ip && { ipAddress: ip }),
        ...(userAgent && { userAgent }),
      },
    });

    if (isReactivation) {
      await tx.user.update({
        where: { id: user.id },
        data: {
          isAcceptingMessages: true,
          status: UserStatus.ACTIVE,
          deletionScheduledAt: null,
        },
      });
      // Remove from deletion queue
    }

    return session;
  });

  await createEmailJob({
    to: user.email,
    template: isReactivation ? emailTemplates.welcomeBack : emailTemplates.loginAlert,
    data: {
      name: user.name,
      time: now,
      deviceInfo: userAgent || "",
    },
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      publicId: user.publicId,
    },
    session: {
      id: session.id,
      refreshToken: refreshToken,
    },
  };
};

function isReactivationLogin(user: User, now: Date) {
  if (user.status !== UserStatus.DELETION_SCHEDULED && user.status !== UserStatus.DEACTIVATED)
    return false;

  if (
    user.status === UserStatus.DELETION_SCHEDULED &&
    user.deletionScheduledAt &&
    user.deletionScheduledAt < now
  )
    throw new BadRequestError("Invalid credentials");

  return true;
}

export { login };
