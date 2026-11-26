import type { DeleteMessageDto } from "@repo/contracts";
import { prisma } from "@repo/db";

interface UnsendMessageInput extends DeleteMessageDto {
  userId: string;
}

export const unsendMessage = async ({ userId, messageId }: UnsendMessageInput) => {
  await prisma.message.delete({
    where: {
      id: messageId,
      senderId: userId,
    },
  });
};
