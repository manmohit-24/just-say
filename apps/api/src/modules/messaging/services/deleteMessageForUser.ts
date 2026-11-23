import type { DeleteMessageDto } from "@repo/contracts";

interface DeleteMessageForUserInput extends DeleteMessageDto {
  userId: string;
}

export const deleteMessageForUser = async (_input: DeleteMessageForUserInput) => {
  console.log(_input);

  // TODO: Migrate participant authorization and per-user deletion semantics.
  throw new Error("deleteMessageForUser service is not implemented");
};
