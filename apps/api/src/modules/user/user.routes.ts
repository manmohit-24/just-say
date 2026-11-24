import { Router, type Request, type Response } from "express";

import {
  authorizeEmailChangeSchema,
  deactivateProfileSchema,
  deleteProfileSchema,
  getUserByUsernameSchema,
  isUsernameAvailableSchema,
  updateProfileSchema,
  verifyEmailChangeSchema,
} from "@repo/contracts";

import { validateBody, validateParams, validateQuery } from "@/shared/middleware/validate.js";
import { requireAuth } from "@/modules/auth/index.js";

import {
  authorizeEmailChangeController,
  deactivateProfileController,
  deleteProfileController,
  getMeController,
  getUserByUsernameController,
  isUsernameAvailableController,
  requestEmailChangeController,
  updateProfileController,
  verifyEmailChangeController,
} from "./user.controllers.js";

const userRouter = Router();

userRouter.get("/me", requireAuth, getMeController);
userRouter.patch("/me", requireAuth, validateBody(updateProfileSchema), updateProfileController);

userRouter.delete("/me", requireAuth, validateBody(deleteProfileSchema), deleteProfileController);
userRouter.post(
  "/me/deactivate",
  requireAuth,
  validateBody(deactivateProfileSchema),
  deactivateProfileController
);

userRouter.post("/me/email/request", requireAuth, requestEmailChangeController);
userRouter.post(
  "/me/email/authorize",
  validateBody(authorizeEmailChangeSchema),
  authorizeEmailChangeController
);
userRouter.post(
  "/me/email/verify",
  validateBody(verifyEmailChangeSchema),
  verifyEmailChangeController
);

userRouter.get(
  "/is-username-available",
  validateQuery(isUsernameAvailableSchema),
  isUsernameAvailableController
);

userRouter.get("/:username", validateParams(getUserByUsernameSchema), getUserByUsernameController);

export { userRouter };
