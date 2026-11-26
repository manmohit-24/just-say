import type { GetMessagesDto } from "@repo/contracts";
import { prisma } from "@repo/db";

export interface GetMessagesInput extends GetMessagesDto {
  userId: string;
}

const LIMIT = 15;

export const getMessages = async ({ userId, role, cursor }: GetMessagesInput) => {
  const res = await prisma.message.findMany({
    where:
      role === "RECEIVER"
        ? { receiverId: userId, deletedForReceiver: false }
        : { senderId: userId, deletedForSender: false },
    take: LIMIT + 1,
    skip: 0,
    ...(cursor && { cursor: { id: cursor } }),
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    include: {
      sender: { select: { username: true, name: true } },
      receiver: { select: { username: true, name: true } },
    },
  });

  // cursor is first element of next page
  const nextCursor = res.length > LIMIT ? (res[LIMIT]?.id ?? null) : null;

  const page = res.slice(0, LIMIT);

  const messages = page.map((msg) => {
    const { id, content, createdAt, status, anonymity, sender, receiver } = msg;

    return {
      id,
      content,
      createdAt,
      status,
      anonymity,
      sender: role === "SENDER" || anonymity === "NONE" ? sender : null,
      receiver,
    };
  });

  if (role === "RECEIVER") {
    await prisma.message.updateMany({
      where: {
        id: { in: messages.map((msg) => msg.id) },
        status: "SENT",
        receiverId: userId,
      },
      data: { status: "READ" },
    });
  }

  return { messages, nextCursor };
};
