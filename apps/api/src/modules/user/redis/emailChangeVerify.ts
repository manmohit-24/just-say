import ms from "ms";

import { redis } from "@/shared/redis.js";
import { NotFoundError, BadRequestError } from "@/shared/errors/index.js";

const EMAIL_CHANGE_VERIFY_TTL = ms("5min");

const userKey = (userId: string) => `email-change:verification:user:${userId}`;
const challengeKey = (challengeHash: string) =>
  `email-change:verification:challenge:${challengeHash}`;

const storeEmailChangeVerifyChallenge = async (
  challengeId: string,
  data: { otpHash: string; userId: string; newEmail: string }
) => {
  await redis
    .multi()
    .set(userKey(data.userId), challengeId, { PX: EMAIL_CHANGE_VERIFY_TTL })
    .hSet(challengeKey(challengeId), data)
    .pExpire(challengeKey(challengeId), EMAIL_CHANGE_VERIFY_TTL)
    .exec();
};

const consumeEmailChangeVerifyChallenge = async (challengeId: string, otpHash: string) => {
  const result = (await redis.eval(
    `
    local challengeKey = KEYS[1]
    local userKeyPrefix = KEYS[2]
    local otpHash = ARGV[1]
    local challengeId = ARGV[2]

    local challenge = redis.call("HGETALL", challengeKey)

    if #challenge == 0 then
      return {0, "NOT_FOUND"}
    end

    local challengeData = {}

    for i = 1, #challenge, 2 do
      challengeData[challenge[i]] = challenge[i + 1]
    end

    if not challengeData.userId
        or not challengeData.otpHash
        or not challengeData.newEmail then
      return {0, "NOT_FOUND"}
    end

    if challengeData.otpHash ~= otpHash then
      return {0, "INVALID_OTP"}
    end

    local userKey = userKeyPrefix .. challengeData.userId

    local latestChallenge = redis.call("GET", userKey)

    if latestChallenge ~= challengeId then
      return {0, "NOT_FOUND"}
    end

    redis.call("DEL", challengeKey)
    redis.call("DEL", userKey)

    return {
      1,
      challengeData.userId,
      challengeData.newEmail
    }
  `,
    {
      keys: [challengeKey(challengeId), userKey("")],
      arguments: [otpHash, challengeId],
    }
  )) as [0, "NOT_FOUND" | "INVALID_OTP"] | [1, string, string];

  if (result[0] === 0) {
    if (result[1] === "INVALID_OTP") throw new BadRequestError("Invalid OTP");
    throw new NotFoundError("Invalid or expired verification");
  }

  return {
    userId: result[1],
    newEmail: result[2],
  };

  /* REFERENCE IMPLEMENTATION (NOT ATOMIC) :
   *
   * This expresses the same logical validation and consumption flow, but the
   * individual Redis operations are separate and therefore the complete
   * operation is not atomic.
   *
   * const challenge = await redis.hGetAll(challengeKey(challengeId));
   *
   * if (
   *   !challenge ||
   *   !challenge.userId ||
   *   !challenge.otpHash ||
   *   !challenge.newEmail
   * ) {
   *   throw new NotFoundError("Invalid or expired verification");
   * }
   *
   * if (challenge.otpHash !== otpHash) {
   *   throw new BadRequestError("Invalid OTP");
   * }
   *
   * const latestChallenge = await redis.get(userKey(challenge.userId));
   *
   * if (latestChallenge !== challengeId) {
   *   throw new NotFoundError("Invalid or expired verification");
   * }
   *
   * await redis
   *   .multi()
   *   .del(challengeKey(challengeId))
   *   .del(userKey(challenge.userId))
   *   .exec();
   *
   * return {
   *   userId: challenge.userId,
   *   newEmail: challenge.newEmail,
   * };
   */
};

export { storeEmailChangeVerifyChallenge, consumeEmailChangeVerifyChallenge };

/** DOCS :
 * Email-change verification state is intentionally stored in Redis because
 * the OTP challenge is short-lived, single-use security state.
 *
 * Design decisions:
 * - The verification challenge has a short TTL and is automatically removed
 *   by Redis after expiration.
 * - The plaintext OTP is never stored; only its hash is stored.
 * - Every authorization request creates a new challenge.
 * - Only the latest challenge for a user is considered valid.
 *
 * - Two mappings are maintained:
 *
 *     email-change:verification:user:{userId}
 *         -> challengeId
 *
 *     email-change:verification:challenge:{challengeId}
 *         -> {
 *              otpHash,
 *              userId,
 *              newEmail
 *            }
 *
 *   The user -> challenge mapping identifies the currently active challenge,
 *   while the challenge -> data mapping contains the information required to
 *   verify and complete the email change.
 *
 * - MULTI/EXEC is used when creating the challenge so the user -> challenge
 *   mapping and challenge data are written together without another Redis
 *   command being interleaved between them.
 * - Redis transactions do not provide rollback; MULTI/EXEC provides atomic
 *   execution of the queued commands, not database-style rollback semantics.
 *
 * Challenge validity requires all of the following:
 * 1. The challenge must exist and contain the required fields.
 * 2. The supplied OTP hash must match the stored OTP hash.
 * 3. The challenge must still be the user's latest challenge.
 *
 * Challenge consumption is performed by a Lua script so the complete
 * read -> validate -> consume operation is atomic.
 *
 *   challenge exists
 *        ↓
 *   OTP matches
 *        ↓
 *   challenge is still latest
 *        ↓
 *   delete challenge + user mapping
 *
 * This prevents concurrent requests from both successfully consuming the same
 * challenge and also prevents an older challenge from deleting the mapping
 * belonging to a newer challenge.
 *
 * The Lua script returns:
 *
 *     {0, "NOT_FOUND"}   -> invalid, expired, consumed, or stale challenge
 *     {0, "INVALID_OTP"} -> OTP mismatch
 *     {1, userId, email} -> challenge successfully consumed
 *
 * Redis is treated as disposable state here. Losing the challenge only
 * invalidates the current email-change attempt; the user can start a new one.
 * The actual user account and email remain durable in PostgreSQL.
 */
