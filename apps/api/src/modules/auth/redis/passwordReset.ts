import ms from "ms";

import { redis } from "@/shared/redis.js";
import { NotFoundError } from "@/shared/errors/NotFoundError.js";

const PASSWORD_RESET_TTL = ms("30min");

const userIdKey = (userId: string) => `password-reset:user:${userId}`;
const tokenKey = (tokenHash: string) => `password-reset:token:${tokenHash}`;

const storePasswordResetToken = async (tokenHash: string, userId: string) => {
  await redis
    .multi()
    .set(userIdKey(userId), tokenHash, { PX: PASSWORD_RESET_TTL })
    .set(tokenKey(tokenHash), userId, { PX: PASSWORD_RESET_TTL })
    .exec();
};

const consumePasswordResetToken = async (tokenHash: string) => {
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

  if (result[0] === 0) throw new NotFoundError("Invalid or expired reset token");

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

export { storePasswordResetToken, consumePasswordResetToken };
/** DOCS :
 * Password-reset state is intentionally stored in Redis rather than PostgreSQL.
 *
 * Design decisions:
 * - Password-reset tokens are ephemeral security state, so Redis TTL is used
 *   for automatic expiration.
 * - The plaintext token is never stored; only its hash is used as the token
 *   mapping key.
 * - Every forgot-password request generates a new token.
 * - Only the latest token for a user is considered valid.
 * - Two mappings are maintained:
 *
 *     password-reset:user:{userId}      -> tokenHash
 *     password-reset:token:{tokenHash}  -> userId
 *
 *   The user -> token mapping identifies the currently active token, while
 *   the token -> user mapping allows the reset request to resolve the user.
 *
 * - MULTI/EXEC is used when creating the mappings so the two Redis writes are
 *   executed as one queued transaction, preventing other Redis commands from
 *   interleaving between them.
 * - Redis transactions do not provide rollback; MULTI/EXEC provides atomic
 *   execution of the queued commands, not database-style all-or-nothing
 *   rollback semantics.
 *
 * Token validity is determined by two conditions:
 * 1. The token -> user mapping must exist. This ensures the token has not
 *    expired or already been consumed.
 * 2. The user -> token mapping must contain the same token hash. This ensures
 *    that an older token is rejected after a newer reset request replaces it.
 *
 * Token consumption is performed by a Lua script so the complete
 * read -> validate -> consume operation is atomic:
 *
 *     token -> user mapping exists
 *              ↓
 *     user -> token mapping matches
 *              ↓
 *     delete both mappings
 *
 *   The script first resolves the userId from the token mapping, then checks
 *   that the user's current token hash still matches the supplied token hash.
 *   Only when both conditions hold are the token and user mappings deleted.
 *
 *   This prevents a race where concurrent requests, or an older token,
 *   could otherwise observe valid state before the mappings are deleted.
 *   In particular, an older token cannot delete the user -> token mapping
 *   belonging to a newer valid token.
 *
 * - The Lua script returns a status code and the userId:
 *
 *     {0, "NOT_FOUND"} -> token is invalid, expired, consumed, or stale
 *     {1, userId}      -> token was successfully consumed
 *
 * Redis is treated as disposable state here. Losing this data only invalidates
 * the reset flow; the user can request another reset token. The actual
 * password and account state remain durable in PostgreSQL.
 */
