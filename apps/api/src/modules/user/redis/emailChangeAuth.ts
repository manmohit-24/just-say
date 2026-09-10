import ms from "ms";

import { redis } from "@/shared/redis.js";
import { NotFoundError } from "@/shared/errors/NotFoundError.js";

const EMAIL_CHANGE_AUTH_TTL = ms("15min");

const userKey = (userId: string) => `email-change:authorization:user:${userId}`;
const tokenKey = (tokenHash: string) => `email-change:authorization:token:${tokenHash}`;

const storeEmailChangeAuthToken = async (tokenHash: string, userId: string) => {
  await redis
    .multi()
    .set(userKey(userId), tokenHash, { PX: EMAIL_CHANGE_AUTH_TTL })
    .set(tokenKey(tokenHash), userId, { PX: EMAIL_CHANGE_AUTH_TTL })
    .exec();
};

const getEmailChangeAuthUser = async (tokenHash: string) => {
  const userId = await redis.get(tokenKey(tokenHash));
  if (!userId) throw new NotFoundError("Invalid or expired email change token");

  const currentHash = await redis.get(userKey(userId));
  if (currentHash !== tokenHash) throw new NotFoundError("Invalid or expired email change token");

  return userId;
};

const consumeEmailChangeAuthToken = async (tokenHash: string) => {
  const userId = await redis.getDel(tokenKey(tokenHash));
  // again verifying if token still exist, to avaoid multiple req with same token success
  if (!userId) throw new NotFoundError("Invalid or expired email change token");
  await redis.del(userKey(userId));
};

export { storeEmailChangeAuthToken, getEmailChangeAuthUser, consumeEmailChangeAuthToken };

/**
 * Redis design:
 *
 * Two keys are maintained for each email-change authorization token:
 *
 *   user:{userId}  → tokenHash
 *   token:{tokenHash} → userId
 *
 * The token key allows O(1) lookup of the user from the token, while the
 * user key ensures that issuing a newer authorization token invalidates any
 * previously issued token.
 *
 * Both keys share the same TTL. The user mapping is checked when reading
 * the token, making it the source of truth for whether the token is still
 * the user's latest authorization token.
 *
 * Token consumption uses GETDEL so that only one concurrent request can
 * successfully consume the token. This prevents the same authorization
 * token from being used to create multiple verification challenges.
 */
