import { prisma } from "@repo/db";
import { generateSecureToken, hashToken } from "../crypto/token.js";
import { ForbiddenError } from "@/shared/errors/ForbiddenError.js";

const refreshAccessToken = async (
  refreshToken: string,
  deviceInfo: { ip: string | undefined; userAgent: string | undefined }
) => {
  const token = generateSecureToken();
  const { ip, userAgent } = deviceInfo;

  const res = await prisma.session.updateManyAndReturn({
    where: {
      refreshTokenHash: hashToken(refreshToken),
      refreshExpiresAt: {
        gt: new Date(),
      },
    },
    data: {
      refreshTokenHash: hashToken(token),
      ...(ip && { ipAddress: ip }),
      ...(userAgent && { userAgent }),
    },
    select: {
      id: true,
      userId: true,
    },
  });

  if (res.length == 0 || !res[0]) throw new ForbiddenError("invalid or expired token");

  const session = res[0];

  return {
    sessionId: session.id,
    userId: session.userId,
    refreshToken: token,
  };
};

export { refreshAccessToken };

/* Session Handling per user status :
  UNVERIFIED
      → cannot login
      → therefore no sessions

  DEACTIVATED
      → sessions removed when deactivated

  DELETION_SCHEDULED
      → sessions removed when deletion is scheduled

 So only user with ACTIVE status can have sessions,
 thats why we not handled invalid status part in this service
*/
