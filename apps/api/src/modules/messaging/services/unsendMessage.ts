import type { UnsendMessageDto } from "@repo/contracts";
export interface UnsendMessageInput { userId: string; query: UnsendMessageDto; }
export const unsendMessage = async (_input: UnsendMessageInput): Promise<void> => {
  // TODO: Migrate sender-only authorization and unsend semantics.
  throw new Error("unsendMessage service is not implemented");
};