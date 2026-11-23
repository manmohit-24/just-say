import { Router } from "express";
import { sendMessageSchema, getMessagesSchema, acceptMessagesSchema, aiSuggestionSchema, deleteMessageForUserSchema, unsendMessageSchema } from "@repo/contracts";
import { validateBody, validateQuery } from "@/shared/middleware/validate.js";
import { requireAuth } from "@/modules/auth/index.js";
import { sendMessageController, getMessagesController, acceptMessagesController, getMessageAcceptanceController, aiSuggestionController, deleteMessageForUserController, unsendMessageController } from "./messaging.controllers.js";
const messagingRouter = Router();
// Legacy send-message allowed guest senders; guest auth is not supported by this API yet.
messagingRouter.post("/send-message", validateBody(sendMessageSchema), sendMessageController);
messagingRouter.get("/get-messages", requireAuth, validateQuery(getMessagesSchema), getMessagesController);
messagingRouter.post("/accept-messages", requireAuth, validateBody(acceptMessagesSchema), acceptMessagesController);
messagingRouter.get("/accept-messages", requireAuth, getMessageAcceptanceController);
messagingRouter.post("/ai-suggestion", validateBody(aiSuggestionSchema), aiSuggestionController);
messagingRouter.delete("/delete-message-for-user", requireAuth, validateQuery(deleteMessageForUserSchema), deleteMessageForUserController);
messagingRouter.delete("/unsend-message", requireAuth, validateQuery(unsendMessageSchema), unsendMessageController);
export { messagingRouter };