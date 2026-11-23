import type { DeleteMessageDto } from "@repo/contracts";

interface UnsendMessageInput extends DeleteMessageDto {
  userId: string;
}

export const unsendMessage = async (_input: UnsendMessageInput) => {
  console.log(_input);

  // TODO: Migrate sender-only authorization and unsend semantics.
  throw new Error("unsendMessage service is not implemented");
};
