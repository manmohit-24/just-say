import type { Request, Response } from "express";

import type { SuccessResponse, RegisterResponse, LoginResponse } from "@repo/contracts";

import {
  register,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  changePassword,
} from "./services/index.js";

import {
  clearAccessCookie,
  clearRefreshCookie,
  setAccessCookie,
  setRefreshCookie,
} from "./cookies/index.js";
import { generateAccessToken } from "./jwt/access.js";
import { refreshAccessToken } from "./services/refreshAccessToken.js";
import { ForbiddenError } from "@/shared/errors/ForbiddenError.js";

const registerController = async (req: Request, res: Response) => {
  const user = await register(req.body);

  res.status(201).json({
    success: true,
    data: user,
  } satisfies SuccessResponse<RegisterResponse>);
};

const loginController = async (req: Request, res: Response) => {
  const ip = req.ip;
  const userAgent = req.get("User-Agent");

  const { user, session } = await login(req.body, { ip, userAgent });

  const accessToken = generateAccessToken({ userId: user.id, sessionId: session.id });

  setAccessCookie(res, accessToken);
  setRefreshCookie(res, session.refreshToken);

  res.status(200).json({
    success: true,
    data: {
      name: user.name,
      email: user.email,
      username: user.username,
    },
  } satisfies SuccessResponse<LoginResponse>);
};

const logoutController = async (req: Request, res: Response) => {
  await logout(req.auth!);

  clearAccessCookie(res);
  clearRefreshCookie(res);

  res.status(200).json({
    success: true,
    data: null,
  } satisfies SuccessResponse<null>);
};

const verifyEmailController = async (req: Request, res: Response) => {
  await verifyEmail(req.body);

  res.status(200).json({
    success: true,
    data: null,
  } satisfies SuccessResponse<null>);
};

const forgotPasswordController = async (req: Request, res: Response) => {
  await forgotPassword(req.body);

  res.status(200).json({
    success: true,
    data: null,
  } satisfies SuccessResponse<null>);
};

const resetPasswordController = async (req: Request, res: Response) => {
  await resetPassword(req.body);

  res.status(200).json({
    success: true,
    data: null,
  } satisfies SuccessResponse<null>);
};

const refreshAccessTokenController = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const ip = req.ip;
  const userAgent = req.get("User-Agent");

  if (!refreshToken) throw new ForbiddenError("Invalid or expired token");

  const {
    userId,
    refreshToken: newToken,
    sessionId,
  } = await refreshAccessToken(refreshToken, { ip, userAgent });

  const accessToken = generateAccessToken({ userId, sessionId });

  setAccessCookie(res, accessToken);
  setRefreshCookie(res, newToken);

  res.status(200).json({
    success: true,
    data: null,
  } satisfies SuccessResponse<null>);
};

const changePasswordController = async (req: Request, res: Response) => {
  await changePassword(req.body, req.auth!);

  res.status(200).json({
    success: true,
    data: null,
  } satisfies SuccessResponse<null>);
};

export {
  registerController,
  loginController,
  logoutController,
  verifyEmailController,
  forgotPasswordController,
  resetPasswordController,
  refreshAccessTokenController,
  changePasswordController,
};
