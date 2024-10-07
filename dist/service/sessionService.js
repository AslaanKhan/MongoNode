"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSession = createSession;
exports.findSessions = findSessions;
exports.updateSession = updateSession;
exports.reIssueAccessToken = reIssueAccessToken;
const config_1 = __importDefault(require("config"));
const lodash_1 = require("lodash");
const session_model_1 = __importDefault(require("../models/session.model"));
const jwt_utils_1 = require("../utils/jwt.utils");
const user_service_1 = require("./user.service");
async function createSession(userId, userAgent) {
    const existingSessions = await findSessions({ user: userId, valid: true });
    const activeSession = existingSessions.length === 1 ? existingSessions[0] : null;
    if (activeSession) {
        return activeSession.toJSON();
    }
    else if (existingSessions.length > 1) {
        existingSessions.forEach(async (session) => {
            await updateSession({ _id: (0, lodash_1.get)(session, "_id") }, { valid: false });
        });
    }
    const session = await session_model_1.default.create({ user: userId, userAgent });
    return session.toJSON();
}
async function findSessions(query) {
    return session_model_1.default.find(query);
}
async function updateSession(query, update) {
    return session_model_1.default.updateOne(query, update);
}
async function reIssueAccessToken({ refreshToken, }) {
    const { decoded } = (0, jwt_utils_1.verifyJwt)(refreshToken, "refreshTokenPublicKey");
    if (!decoded || !(0, lodash_1.get)(decoded, "session"))
        return false;
    const session = await session_model_1.default.findById((0, lodash_1.get)(decoded, "session"));
    if (!session || !session.valid)
        return false;
    const user = await (0, user_service_1.getUserByParam)({ _id: session.user });
    if (!user)
        return false;
    const accessToken = (0, jwt_utils_1.signJwt)({ ...user, session: session._id }, "accessTokenPrivateKey", { expiresIn: config_1.default.get("accessTokenTtl") });
    return accessToken;
}
