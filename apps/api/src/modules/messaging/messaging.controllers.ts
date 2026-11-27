import type { Request, Response } from "express";
import { pipeUIMessageStreamToResponse, toUIMessageStream } from "ai";

import type { GetMessagesDto, GetMessagesResponse, SuccessResponse } from "@repo/contracts";

import { logger } from "@/shared/logger.js";
import {
  sendMessage,
  getMessages,
  aiSuggestion,
  deleteMessageForUser,
  unsendMessage,
} from "./services/index.js";

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

  pipeUIMessageStreamToResponse({
    response: res,
    stream: toUIMessageStream({
      stream: result.stream,
      onError: (error) => {
        // Log the real error server-side.
        logger.error({ err: error }, "AI suggestion stream failed");

        // Send only a safe message to the frontend.
        return "AI generation failed. Please try again later.";
      },
    }),
  });
};

export {
  sendMessageController,
  getMessagesController,
  aiSuggestionController,
  deleteMessageForUserController,
  unsendMessageController,
};
