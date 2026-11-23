import type { GetMessagesDto, GetMessagesResponse } from "@repo/contracts";
export interface GetMessagesInput { userId: string; query: GetMessagesDto; }
export const getMessages = async (_input: GetMessagesInput): Promise<GetMessagesResponse> => {
  // TODO: Migrate legacy pagination, filtering, projection, and read-status behavior.
  throw new Error("getMessages service is not implemented");
};