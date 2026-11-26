import type { Request, Response } from "express";
import type { GetMessagesDto, GetMessagesResponse, SuccessResponse } from "@repo/contracts";
import {
  sendMessage,
  getMessages,
  aiSuggestion,
  deleteMessageForUser,
  unsendMessage,
} from "./services/index.js";

import { pipeTextStreamToResponse, toTextStream } from "ai";

const sendMessageController = async (req: Request, res: Response) => {
  const userId = req.auth?.userId ?? null;

  await sendMessage({ userId, ...req.body });

  res.status(200).json({ success: true, data: null } satisfies SuccessResponse<null>);
};

const getMessagesController = async (req: Request, res: Response) => {
  const { userId } = req.auth!;
  const { cursor, role } = req.query;

  const data = await getMessages({
    userId,
    cursor: cursor as string,
    role: role as GetMessagesDto["role"],
  });

  res.status(200).json({ success: true, data } satisfies SuccessResponse<GetMessagesResponse>);
};

const deleteMessageForUserController = async (req: Request, res: Response) => {
  const { userId } = req.auth!;
  const { messageId } = req.params;

  await deleteMessageForUser({ userId, messageId: messageId as string });

  res.status(200).json({ success: true, data: null } satisfies SuccessResponse<null>);
};

const unsendMessageController = async (req: Request, res: Response) => {
  const { userId } = req.auth!;
  const { messageId } = req.params;

  await unsendMessage({ userId, messageId: messageId as string });

  res.status(200).json({ success: true, data: null } satisfies SuccessResponse<null>);
};

const aiSuggestionController = async (req: Request, res: Response) => {
  const result = aiSuggestion(req.body);
  pipeTextStreamToResponse({ response: res, stream: toTextStream(result) });
};

export {
  sendMessageController,
  getMessagesController,
  aiSuggestionController,
  deleteMessageForUserController,
  unsendMessageController,
};
