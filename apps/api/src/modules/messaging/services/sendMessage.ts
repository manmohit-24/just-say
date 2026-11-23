import type { SendMessageDto } from "@repo/contracts";

export interface SendMessageInput extends SendMessageDto {
  userId: string | null;
}

export const sendMessage = async (_input: SendMessageInput) => {
  console.log(_input);

  // TODO: Migrate legacy send-message business logic.
  throw new Error("sendMessage service is not implemented");
};
