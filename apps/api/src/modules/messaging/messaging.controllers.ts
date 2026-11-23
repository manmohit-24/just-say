import type { Request, Response } from "express";
import type { AcceptMessagesResponse, GetMessagesResponse, SuccessResponse } from "@repo/contracts";
import { sendMessage, getMessages, acceptMessages, getMessageAcceptance, aiSuggestion, deleteMessageForUser, unsendMessage } from "./services/index.js";
const sendMessageController = async (req: Request, res: Response) => { await sendMessage({ auth: req.auth ?? null, data: req.body }); res.status(200).json({ success: true, data: null } satisfies SuccessResponse<null>); };
const getMessagesController = async (req: Request, res: Response) => { const { userId } = req.auth!; const data = await getMessages({ userId, query: req.query as never }); res.status(200).json({ success: true, data } satisfies SuccessResponse<GetMessagesResponse>); };
const acceptMessagesController = async (req: Request, res: Response) => { const { userId } = req.auth!; const data = await acceptMessages({ userId, data: req.body }); res.status(200).json({ success: true, data } satisfies SuccessResponse<AcceptMessagesResponse>); };
const getMessageAcceptanceController = async (req: Request, res: Response) => { const { userId } = req.auth!; const data = await getMessageAcceptance(userId); res.status(200).json({ success: true, data } satisfies SuccessResponse<AcceptMessagesResponse>); };
const aiSuggestionController = async (req: Request, res: Response) => { // TODO: Preserve legacy streaming response after migrating the service.
  const data = await aiSuggestion(req.body); res.status(200).json({ success: true, data } satisfies SuccessResponse<unknown>);
};
const deleteMessageForUserController = async (req: Request, res: Response) => { const { userId } = req.auth!; await deleteMessageForUser({ userId, query: req.query as never }); res.status(200).json({ success: true, data: null } satisfies SuccessResponse<null>); };
const unsendMessageController = async (req: Request, res: Response) => { const { userId } = req.auth!; await unsendMessage({ userId, query: req.query as never }); res.status(200).json({ success: true, data: null } satisfies SuccessResponse<null>); };
export { sendMessageController, getMessagesController, acceptMessagesController, getMessageAcceptanceController, aiSuggestionController, deleteMessageForUserController, unsendMessageController };