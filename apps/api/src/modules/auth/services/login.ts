import ms from "ms";

import { prisma, UserStatus, type User } from "@repo/db";
import type { LoginDto } from "@repo/contracts";

import { env } from "@/config/env.js";

import { ForbiddenError, BadRequestError } from "@/shared/errors/index.js";

import { verifyPassword } from "../crypto/password.js";
import { generateSecureToken, hashToken } from "../crypto/token.js";

import { emailTemplates } from "@repo/jobs/email";
import { createEmailJob } from "@/shared/queues/email.js";
import { storeEmailVerificationToken } from "../redis/emailVerification.js";

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

  if (!user || !(await verifyPassword(password, user.passwordHash)))
    throw new BadRequestError("Invalid credentials.");

  if (user.status === UserStatus.UNVERIFIED) {
    // todo : add cooldown to token generation
    await resendVerificationToken(user, now);
    throw new ForbiddenError("Please activate account before proceeding");
  }

  const isReactivation = isReactivationLogin(user, now);

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

async function resendVerificationToken(user: User, now: Date) {
  const verificationToken = generateSecureToken();
  const tokenExpiresAt = new Date(now.getTime() + ms("30min"));

  let newDeleteSchedule = user.deletionScheduledAt;

  if (!newDeleteSchedule || newDeleteSchedule < tokenExpiresAt) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        deletionScheduledAt: tokenExpiresAt,
      },
    });

    newDeleteSchedule = tokenExpiresAt;
  }

  // store in redis after db call successfully extends deletion Schedule
  await storeEmailVerificationToken(hashToken(verificationToken), user.id);

  await createEmailJob({
    to: user.email,
    template: emailTemplates.emailVerification,
    data: {
      name: user.name,
      verificationUrl: `${env.CLIENT_URL}/auth/verify-email?token=${verificationToken}`,
      deletionScheduledAt: newDeleteSchedule,
      tokenExpiresAt,
    },
  });
}

export { login };
