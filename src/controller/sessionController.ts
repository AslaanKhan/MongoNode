import { Request, Response } from "express";
import config from "config";
import { signJwt } from "../utils/jwt.utils";
import { createSession, findSessions, updateSession } from "../service/sessionService";
import UserModel from "../models/user.model";

export async function createUserSessionHandler(req: Request, res: Response) {
  // Validate the user's password
  const user = await UserModel.findOne({ number: req.body.number });

  if (!user) {
    return res.status(401).send("number");
  }

  // create a session
  const session = await createSession(user._id, req.get("user-agent") || "");

  // create an access token

  const accessToken = signJwt(
    { ...user, session: session._id },
    "accessTokenPrivateKey",
    { expiresIn: config.get("accessTokenTtl") } // 1yr,
  );

  // create a refresh token
  const refreshToken = signJwt(
    { ...user, session: session._id },
    "refreshTokenPrivateKey",
    { expiresIn: config.get("refreshTokenTtl") } // 1yr
  );

  // return access & refresh tokens

  return { accessToken, refreshToken };
}

export async function getUserSessionsHandler(req: Request, res: Response) {
  // const userId = res.locals.user._id;

  const sessions = await findSessions({ valid: true });

  return res.send(sessions);
}

export async function deleteSessionHandler(req: Request, res: Response) {
  const sessionId = res.locals.user.session;
  await updateSession({ _id: sessionId }, { valid: false, updatedAt: new Date() });

  return res.send({
    accessToken: null,
    refreshToken: null,
  });
}