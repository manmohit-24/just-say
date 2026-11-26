import type { GetMessagesDto, SendMessageDto } from "@repo/contracts";

type MessageRole = GetMessagesDto["role"];
type Anonymity = SendMessageDto["anonymity"];

export type { MessageRole, Anonymity };
