import type { SendMessageDto } from "@repo/contracts";
export interface SendMessageInput { /** Legacy endpoint allowed guest senders; guest auth is not migrated yet. */ auth: { userId: string; sessionId: string } | null; data: SendMessageDto; }
export const sendMessage = async (_input: SendMessageInput): Promise<void> => {
  // TODO: Migrate legacy send-message business logic.
  throw new Error("sendMessage service is not implemented");
};