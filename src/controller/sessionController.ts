import config from "config";
import { Request, Response } from "express";
import { createSession, findSessions, updateSession } from "../service/sessionService";
import { signJwt } from "../utils/jwt.utils";

export async function createUserSessionHandler(req: Request, res: Response, user: any) {

  if (!user) {
    return res.status(401).send("number");
  }

  const session = await createSession(user._id, req.get("user-agent") || "");

  const accessToken = signJwt(
    { ...user, session: session._id },
    "accessTokenPrivateKey",
    { expiresIn: config.get("accessTokenTtl") } // 1yr,
  );

  return accessToken ;
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