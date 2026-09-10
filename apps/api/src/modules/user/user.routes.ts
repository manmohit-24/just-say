import { Router, type Request, type Response } from "express";

import {
  authorizeEmailChangeSchema,
  deactivateProfileSchema,
  deleteProfileSchema,
  getUserByPublicIdSchema,
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
  getUserByIdController,
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

// Temperory endpoints to handle frontend related forms :
userRouter.get("/update-email", async (req: Request, res: Response) => {
  const { token } = req.query;
  if (typeof token !== "string" || !token) return res.status(400).send("Invalid reset link.");

  const nonce = "this-is-a-simple-string";
  res.setHeader("Content-Security-Policy", `script-src 'self' 'nonce-${nonce}'`);

  res.type("html").send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Change Email</title>
      </head>
      <body>
        <h1>Change Email</h1>

        <form id="emailChangeForm">
          <input type="hidden" name="token" value="${token}" />

          <label>
            Current password:
            <input type="password" name="password" required />
          </label>

          <br><br>

          <label>
            New email:
            <input type="email" name="newEmail" required />
          </label>

          <br><br>

          <button type="submit">Continue now </button>
        </form>

        <p id="message"></p>

        <script nonce=${nonce} >
          const form = document.getElementById("emailChangeForm");

          const message = document.getElementById("message");

          form.addEventListener("submit", async (event) => {
            event.preventDefault();
            const formData = new FormData(form);

            const response = await fetch("/user/me/email/authorize", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                token: formData.get("token"),
                password: formData.get("password"),
                newEmail: formData.get("newEmail")
              })
            });

            const res = await response.json();

            if (!response.ok || !res.success) {
              message.textContent = res.message ?? "Something went wrong.";
              return;
            }

            const data = res.data;

            form.outerHTML = \`
              <form id="otpForm">
                <h2>Verify New Email</h2>

                <p>
                  Enter the verification code sent to
                  <strong>\${formData.get("newEmail")}</strong>.
                </p>

                <input
                  type="text"
                  name="otp"
                  maxlength="8"
                  required
                  autocomplete="one-time-code"
                />

                <input
                  type="hidden"
                  name="challengeId"
                  value="\${data.challengeId}"
                />

                <br><br>

                <button type="submit">Verify Email</button>
              </form>
            \`;

            document
              .getElementById("otpForm")
              .addEventListener("submit", verifyOtp);
          });

          async function verifyOtp(event) {
            event.preventDefault();
            const form = event.currentTarget;
            const formData = new FormData(form);

            const response = await fetch("/user/me/email/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                challengeId: formData.get("challengeId"),
                otp: formData.get("otp")
              })
            });

            const data = await response.json();

            if (!response.ok) {
              message.textContent = data.message ?? "Invalid verification code.";
              return;
            }

            form.outerHTML = \`
              <h2>Email Changed Successfully</h2>
              <p>Your email address has been changed successfully.</p>
            \`;
          }
        </script>
      </body>
    </html>
  `);
});

userRouter.get("/:id", validateParams(getUserByPublicIdSchema), getUserByIdController);

export { userRouter };
