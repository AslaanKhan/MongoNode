"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserSessionHandler = createUserSessionHandler;
exports.getUserSessionsHandler = getUserSessionsHandler;
exports.deleteSessionHandler = deleteSessionHandler;
const config_1 = __importDefault(require("config"));
const jwt_utils_1 = require("../utils/jwt.utils");
const sessionService_1 = require("../service/sessionService");
async function createUserSessionHandler(req, res, user) {
    // Validate the user's password
    if (!user) {
        return res.status(401).send("number");
    }
    // create a session
    const session = await (0, sessionService_1.createSession)(user._id, req.get("user-agent") || "");
    // create an access token
    const accessToken = (0, jwt_utils_1.signJwt)({ ...user, session: session._id }, "accessTokenPrivateKey", { expiresIn: config_1.default.get("accessTokenTtl") } // 1yr,
    );
    // return access & refresh tokens
    return accessToken;
}
async function getUserSessionsHandler(req, res) {
    // const userId = res.locals.user._id;
    const sessions = await (0, sessionService_1.findSessions)({ valid: true });
    return res.send(sessions);
}
async function deleteSessionHandler(req, res) {
    const sessionId = res.locals.user.session;
    await (0, sessionService_1.updateSession)({ _id: sessionId }, { valid: false, updatedAt: new Date() });
    return res.send({
        accessToken: null,
        refreshToken: null,
    });
}
