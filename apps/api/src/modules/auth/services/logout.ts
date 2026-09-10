import { prisma } from "@repo/db";

type LogoutDTO = {
  userId: string;
  sessionId: string;
};

const logout = async ({ userId, sessionId }: LogoutDTO) => {
  await prisma.session.delete({
    where: {
      userId: userId,
      id: sessionId,
    },
  });
};

export { logout };
