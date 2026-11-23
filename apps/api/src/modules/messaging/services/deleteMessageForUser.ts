import type { DeleteMessageForUserDto } from "@repo/contracts";
export interface DeleteMessageForUserInput { userId: string; query: DeleteMessageForUserDto; }
export const deleteMessageForUser = async (_input: DeleteMessageForUserInput): Promise<void> => {
  // TODO: Migrate participant authorization and per-user deletion semantics.
  throw new Error("deleteMessageForUser service is not implemented");
};