import { emailTemplates } from "@repo/jobs/email";

import { UserStatus } from "@/generated/prisma/enums.js";

import { env } from "@/config/env.js";

import { NotFoundError } from "@/shared/errors/NotFoundError.js";
import { createEmailJob } from "@/shared/queues/email.js";
import { prisma } from "@/shared/prisma.js";

import { generateSecureToken, hashToken } from "@/modules/auth/crypto/token.js";

import { storeEmailChangeAuthToken } from "../redis/emailChangeAuth.js";

const requestEmailChange = async (id: string) => {
  const token = generateSecureToken();
  const tokenHash = hashToken(token);

  const user = await prisma.user.findUnique({
    where: {
      id,
      status: UserStatus.ACTIVE,
    },
  });

  if (!user) throw new NotFoundError("User Not Found");

  await storeEmailChangeAuthToken(tokenHash, user.id);

  await createEmailJob({
    to: user.email,
    template: emailTemplates.emailChangeRequest,
    data: {
      name: user.name,
      changeEmailUrl: `${env.CLIENT_URL}/user/update-email?token=${token}`,
    },
  });
};

export { requestEmailChange };
