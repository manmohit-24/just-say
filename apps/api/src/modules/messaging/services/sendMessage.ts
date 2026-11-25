import { prisma } from "@repo/db";
import type { SendMessageDto } from "@repo/contracts";

import { ConflictError } from "@/shared/errors/ConflictError.js";
import { ForbiddenError } from "@/shared/errors/ForbiddenError.js";
import { NotFoundError } from "@/shared/errors/NotFoundError.js";

export interface SendMessageInput extends SendMessageDto {
  userId: string | null;
}

export const sendMessage = async ({
  userId,
  receiver: receiverUsername,
  content,
  anonymity,
}: SendMessageInput) => {
  const receiver = await prisma.user.findUnique({ where: { username: receiverUsername } });

  if (!receiver) throw new NotFoundError("Receiver not found");
  if (!receiver.isAcceptingMessages) throw new ConflictError("Receiver is not accepting messages");

  if (!userId && anonymity !== "TRULY_ANONYMOUS")
    throw new ForbiddenError("Guests are only allowed to send truly anonymous messages");

  if (userId === receiver.id) throw new ForbiddenError("Messaging to yourself is forbidden");

  await prisma.message.create({
    data: {
      senderId: userId,
      receiverId: receiver.id,
      content,
      anonymity,
    },
  });
};
