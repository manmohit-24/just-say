import { Router } from "express";
import {
  sendMessageSchema,
  getMessagesSchema,
  deleteMessageSchema,
  aiSuggestionSchema,
} from "@repo/contracts";
import { validateBody, validateParams, validateQuery } from "@/shared/middleware/validate.js";
import { requireAuth } from "@/modules/auth/index.js";
import {
  sendMessageController,
  getMessagesController,
  deleteMessageForUserController,
  unsendMessageController,
  aiSuggestionController,
} from "./messaging.controllers.js";
const messagingRouter = Router();

messagingRouter.post("/", validateBody(sendMessageSchema), sendMessageController);

messagingRouter.get("/", requireAuth, validateQuery(getMessagesSchema), getMessagesController);

// delete for user only
messagingRouter.patch(
  "/:messageId",
  requireAuth,
  validateParams(deleteMessageSchema),
  deleteMessageForUserController
);

// unsend message
messagingRouter.delete(
  "/:messageId",
  requireAuth,
  validateParams(deleteMessageSchema),
  unsendMessageController
);

// ai suggestions
messagingRouter.post("/suggestions", validateBody(aiSuggestionSchema), aiSuggestionController);

export { messagingRouter };
