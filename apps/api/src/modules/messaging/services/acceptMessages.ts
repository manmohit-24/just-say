import type { AcceptMessagesDto, AcceptMessagesResponse } from "@repo/contracts";
export interface AcceptMessagesInput { userId: string; data: AcceptMessagesDto; }
export const acceptMessages = async (_input: AcceptMessagesInput): Promise<AcceptMessagesResponse> => {
  // TODO: Migrate acceptance-status update and legacy response semantics.
  throw new Error("acceptMessages service is not implemented");
};
export const getMessageAcceptance = async (_userId: string): Promise<AcceptMessagesResponse> => {
  // TODO: Migrate acceptance-status retrieval.
  throw new Error("getMessageAcceptance service is not implemented");
};