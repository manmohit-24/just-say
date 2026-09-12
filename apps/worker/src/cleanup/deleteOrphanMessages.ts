import { prisma } from "@repo/db";

const BATCH_SIZE = 100;

async function deleteBatch() {
  const messages = await prisma.$queryRaw<{ id: string }[]>`
    WITH messages_to_delete AS (
      SELECT id
      FROM "Message"
      WHERE "senderId" IS NULL
        AND "receiverId" IS NULL
      ORDER BY id
      FOR UPDATE SKIP LOCKED
      LIMIT ${BATCH_SIZE}
    )
    DELETE FROM "Message"
    WHERE id IN (SELECT id FROM messages_to_delete)
    RETURNING id;
  `;

  return messages.length;
}

async function deleteOrphanedMessages() {
  let deletedCount = 1;
  let count = 0;

  while (deletedCount > 0) {
    deletedCount = await deleteBatch();
    count += deletedCount;
  }

  return count;
}

export { deleteOrphanedMessages };
