import { prisma, UserStatus } from "@repo/db";

const BATCH_SIZE = 100;

async function deleteBatch() {
  const users = await prisma.$queryRaw<{ id: string }[]>`
    WITH users_to_delete AS (
      SELECT id
      FROM "User"
      WHERE status = ${UserStatus.DELETION_SCHEDULED}
        AND "deletionScheduledAt" <= NOW()
      ORDER BY "deletionScheduledAt"
      FOR UPDATE SKIP LOCKED
      LIMIT ${BATCH_SIZE}
    )
    DELETE FROM "User"
    WHERE id IN (SELECT id FROM users_to_delete)
    RETURNING id;
  `;

  return users.length;
}

async function deleteExpiredUsers() {
  let deletedCount = 1;
  let count = 0;

  while (deletedCount > 0) {
    deletedCount = await deleteBatch();
    count += deletedCount;
  }

  return count;
}

export { deleteExpiredUsers };
