import { NotFoundError } from "@/shared/errors/NotFoundError.js";
import type { DeleteMessageDto } from "@repo/contracts";
import { prisma } from "@repo/db";

interface DeleteMessageForUserInput extends DeleteMessageDto {
  userId: string;
}

export const deleteMessageForUser = async ({ userId, messageId }: DeleteMessageForUserInput) => {
  await prisma.$transaction(async (tx) => {
    const msg = await tx.message.findUnique({ where: { id: messageId } });
    if (!msg) throw new NotFoundError("Message not found");

    let data;

    if (msg.senderId === userId) data = { deletedForSender: true };
    else if (msg.receiverId === userId) data = { deletedForReceiver: true };
    else throw new NotFoundError("Message not found");

    await tx.message.update({
      where: { id: msg.id },
      data,
    });
  });
};
