import { Router, type NextFunction, type Request, type Response } from "express";
import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "@repo/contracts";

import { validateBody } from "@/shared/middleware/validate.js";

import {
  loginController,
  registerController,
  logoutController,
  verifyEmailController,
  forgotPasswordController,
  resetPasswordController,
  refreshAccessTokenController,
  changePasswordController,
} from "./auth.controllers.js";
import { requireAuth, requireUnAuth } from "./middleware/authGaurds.js";

const authRouter = Router();

authRouter.post("/register", requireUnAuth, validateBody(registerSchema), registerController);
authRouter.post("/login", requireUnAuth, validateBody(loginSchema), loginController);
authRouter.post("/logout", requireAuth, logoutController);
authRouter.post("/verify-email", validateBody(verifyEmailSchema), verifyEmailController);
authRouter.post("/forgot-password", validateBody(forgotPasswordSchema), forgotPasswordController);
authRouter.post("/reset-password", validateBody(resetPasswordSchema), resetPasswordController);
authRouter.post("/refresh-access-token", refreshAccessTokenController);

authRouter.post(
  "/change-password",
  requireAuth,
  validateBody(changePasswordSchema),
  changePasswordController
);

// temporary endpoints to use as email link (until frontend is not ready)
authRouter.get(
  "/verify-email",
  (req: Request, _res: Response, next: NextFunction) => {
    const { token } = req.query;
    req.body = { token };
    next();
  },
  validateBody(verifyEmailSchema),
  verifyEmailController
);

authRouter.get("/reset-password", (req: Request, res: Response) => {
  const { token } = req.query;

  if (typeof token !== "string" || !token) {
    return res.status(400).send("Invalid reset link.");
  }

  res.type("html").send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Reset Password</title>
      </head>
      <body>
        <h1>Reset Password</h1>

        <form method="POST" action="/auth/reset-password">
          <input type="hidden" name="token" value="${token}"/>

          <label>
            New password:
            <input type="password" name="newPassword" required />
          </label>

          <button type="submit">
            Reset Password
          </button>
        </form>
      </body>
    </html>
  `);
});

export { authRouter };
