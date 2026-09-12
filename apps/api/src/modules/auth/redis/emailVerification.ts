import ms from "ms";

import { redis } from "@/shared/redis.js";
import { NotFoundError } from "@/shared/errors/NotFoundError.js";

const EMAIL_VERIFICATION_TTL = ms("30min");

const userIdKey = (userId: string) => `email-verification:user:${userId}`;
const tokenKey = (tokenHash: string) => `email-verification:token:${tokenHash}`;

const storeEmailVerificationToken = async (tokenHash: string, userId: string) => {
  await redis
    .multi()
    .set(userIdKey(userId), tokenHash, { PX: EMAIL_VERIFICATION_TTL })
    .set(tokenKey(tokenHash), userId, { PX: EMAIL_VERIFICATION_TTL })
    .exec();
};

const consumeEmailVerificationToken = async (tokenHash: string) => {
  const result = (await redis.eval(
    `
    local tokenKey = KEYS[1]
    local userPrefix = KEYS[2]
    local tokenHash = ARGV[1]

    local userId = redis.call("GET", tokenKey)

    if not userId then
      return {0, "NOT_FOUND"}
    end

    local userKey = userPrefix .. userId
    local currentHash = redis.call("GET", userKey)

    if currentHash ~= tokenHash then
      return {0, "NOT_FOUND"}
    end

    redis.call("DEL", tokenKey)
    redis.call("DEL", userKey)

    return {1, userId}
  `,
    {
      keys: [tokenKey(tokenHash), userIdKey("")],
      arguments: [tokenHash],
    }
  )) as [0, "NOT_FOUND"] | [1, string];

  if (result[0] === 0) throw new NotFoundError("Invalid or expired email verification token");

  return result[1];

  /* REFERENCE IMPLEMENTATION (NOT ATOMIC):
   *
   * The following expresses the same logical steps, but unlike the Lua script,
   * the operations are separate Redis commands and therefore the complete
   * read -> validate -> consume sequence is not atomic.
   *
   * const userId = await redis.get(tokenKey(tokenHash));
   *
   * if (!userId)
   *   throw new NotFoundError("Invalid or expired reset token");
   *
   * const currentHash = await redis.get(userIdKey(userId));
   *
   * if (currentHash !== tokenHash)
   *   throw new NotFoundError("Invalid or expired reset token");
   *
   * await redis.del(tokenKey(tokenHash));
   * await redis.del(userIdKey(userId));
   *
   * return userId;
   */
};

export { storeEmailVerificationToken, consumeEmailVerificationToken };
