import type { GetMessagesDto } from "@repo/contracts";

export interface GetMessagesInput extends GetMessagesDto {
  userId: string;
}

export const getMessages = async (_input: GetMessagesInput) => {
  console.log(_input);

  // TODO: Migrate legacy pagination, filtering, projection, and read-status behavior.
  throw new Error("getMessages service is not implemented");
};
