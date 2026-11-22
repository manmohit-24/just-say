import type { Request, Response } from "express";

import type {
  AuthorizeEmailChangeResponse,
  GetUserByIdDto,
  GetUserByUsernameDto,
  GetUserResponse,
  IsUsernameAvailableRespose,
  SuccessResponse,
} from "@repo/contracts";

import {
  getUserById,
  getUserByUsername,
  updateProfile,
  deleteProfile,
  deactivateProfile,
  isUsernameAvailable,
  requestEmailChange,
  authorizeEmailChange,
  verifyEmailChange,
} from "./services/index.js";

import { clearAccessCookie, clearRefreshCookie } from "../auth/cookies/clearCookies.js";

const getUserByUsernameController = async (req: Request<GetUserByUsernameDto>, res: Response) => {
  const { username } = req.params;

  const data = await getUserByUsername({ username });

  res.status(200).json({
    success: true,
    data: {
      username: data.username,
      name: data.name,
      isAcceptingMessages: data.isAcceptingMessages,
    },
  } satisfies SuccessResponse<GetUserResponse>);
};

const getMeController = async (req: Request, res: Response) => {
  const { userId } = req.auth!;

  const data = await getUserById({ id: userId });

  res.status(200).json({
    success: true,
    data,
  } satisfies SuccessResponse<GetUserResponse>);
};

const updateProfileController = async (req: Request, res: Response) => {
  const { userId } = req.auth!;

  await updateProfile(req.body, userId);

  res.status(200).json({
    success: true,
    data: null,
  } satisfies SuccessResponse<null>);
};

const deleteProfileController = async (req: Request, res: Response) => {
  const { userId } = req.auth!;

  await deleteProfile(req.body, userId);

  clearAccessCookie(res);
  clearRefreshCookie(res);

  res.status(200).json({
    success: true,
    data: null,
  } satisfies SuccessResponse<null>);
};

const deactivateProfileController = async (req: Request, res: Response) => {
  const { userId } = req.auth!;

  await deactivateProfile(req.body, userId);

  clearAccessCookie(res);
  clearRefreshCookie(res);

  res.status(200).json({
    success: true,
    data: null,
  } satisfies SuccessResponse<null>);
};

const isUsernameAvailableController = async (req: Request, res: Response) => {
  const { username } = req.query;
  const available = await isUsernameAvailable({ username: username as string });

  res.status(200).json({
    success: true,
    data: {
      available: available,
    },
  } satisfies SuccessResponse<IsUsernameAvailableRespose>);
};

const requestEmailChangeController = async (req: Request, res: Response) => {
  const { userId } = req.auth!;
  await requestEmailChange(userId);

  res.status(200).json({
    success: true,
    data: null,
  } satisfies SuccessResponse<null>);
};

const authorizeEmailChangeController = async (req: Request, res: Response) => {
  const challengeId = await authorizeEmailChange(req.body);

  res.status(200).json({
    success: true,
    data: { challengeId },
  } satisfies SuccessResponse<AuthorizeEmailChangeResponse>);
};

const verifyEmailChangeController = async (req: Request, res: Response) => {
  await verifyEmailChange(req.body);

  res.status(200).json({
    success: true,
    data: null,
  } satisfies SuccessResponse<null>);
};

export {
  getMeController,
  getUserByUsernameController,
  updateProfileController,
  deleteProfileController,
  deactivateProfileController,
  isUsernameAvailableController,
  requestEmailChangeController,
  authorizeEmailChangeController,
  verifyEmailChangeController,
};
