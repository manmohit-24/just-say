import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";

import { env } from "@/config/env.js";
import { requestLogger, errorHandler } from "@/shared/middleware/index.js";
import { healthRouter } from "@/modules/health/health.routes.js";
import { NotFoundError } from "@/shared/errors/index.js";
import { resolveAuth } from "./modules/auth/index.js";
import { authRouter } from "./modules/auth/index.js";
import { userRouter } from "./modules/user/index.js";
import { messagingRouter } from "./modules/messaging/messaging.routes.js";

const app = express();

// Security
app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));

// Request Parsing
app.use(cookieParser());
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));

// app.ts: don't compress the AI stream
app.use(
  compression({
    filter: (req, res) =>
      req.path === "/messages/suggestions" ? false : compression.filter(req, res),
  })
);

app.set("trust proxy", 1);

// Observability
app.use(requestLogger);

// Health Check Route
app.use("/health", healthRouter);

// Auth middleware
app.use(resolveAuth);

// App routes
app.use("/auth", authRouter);

// User routes
app.use("/user", userRouter);

// Messaging routes
app.use("/messages", messagingRouter);

app.use((_req) => {
  throw new NotFoundError("Route not found");
});

// Error Handler
app.use(errorHandler);

export { app };
