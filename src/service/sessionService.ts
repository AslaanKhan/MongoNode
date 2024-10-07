import config from "config";
import { get } from "lodash";
import { FilterQuery, UpdateQuery } from "mongoose";
import SessionModel, { SessionDocument } from "../models/session.model";
import { signJwt, verifyJwt } from "../utils/jwt.utils";
import { getUserByParam } from "./user.service";

export async function createSession(userId: object, userAgent: string) {
  const existingSessions = await findSessions({ user: userId, valid: true });
  const activeSession = existingSessions.length === 1 ? existingSessions[0] : null;
  if (activeSession) {
    return activeSession.toJSON()
  } else if (existingSessions.length > 1) {
    existingSessions.forEach(async (session) => {
      await updateSession({ _id: get(session, "_id") }, { valid: false });
    })
  }
  const session = await SessionModel.create({ user: userId, userAgent });
  return session.toJSON();
}

export async function findSessions(query: FilterQuery<SessionDocument>) {
  return SessionModel.find(query);
}

export async function updateSession(
  query: FilterQuery<SessionDocument>,
  update: UpdateQuery<SessionDocument>
) {
  return SessionModel.updateOne(query, update);
}

export async function reIssueAccessToken({
  refreshToken,
}: {
  refreshToken: any;
}) {
  const { decoded } = verifyJwt(refreshToken, "refreshTokenPublicKey");

  if (!decoded || !get(decoded, "session")) return false;

  const session = await SessionModel.findById(get(decoded, "session"));

  if (!session || !session.valid) return false;

  const user = await getUserByParam({ _id: session.user });

  if (!user) return false;

  const accessToken = signJwt(
    { ...user, session: session._id },
    "accessTokenPrivateKey",
    { expiresIn: config.get("accessTokenTtl") }
  );

  return accessToken;
}