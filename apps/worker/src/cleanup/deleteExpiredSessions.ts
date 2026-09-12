import { prisma } from "@repo/db";

const BATCH_SIZE = 100;

async function deleteBatch() {
  const sessions = await prisma.$queryRaw<{ id: string }[]>`
    WITH sessions_to_delete AS (
      SELECT id
      FROM "Session"
      WHERE "refreshExpiresAt" <= NOW()
      ORDER BY "refreshExpiresAt"
      FOR UPDATE SKIP LOCKED
      LIMIT ${BATCH_SIZE}
    )
    DELETE FROM "Session"
    WHERE id IN (SELECT id FROM sessions_to_delete)
    RETURNING id;
  `;

  return sessions.length;
}

async function deleteExpiredSessions() {
  let deletedCount = 1;
  let count = 0;

  while (deletedCount > 0) {
    deletedCount = await deleteBatch();
    count += deletedCount;
  }

  return count;
}

export { deleteExpiredSessions };
