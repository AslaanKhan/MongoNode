"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signJwt = signJwt;
exports.verifyJwt = verifyJwt;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("config"));
function signJwt(object, keyName, options) {
    const signingKey = Buffer.from(config_1.default.get(keyName)).toString("ascii");
    return jsonwebtoken_1.default.sign(object, signingKey, {
        ...(options && options),
        algorithm: "RS256",
    });
}
function verifyJwt(token, keyName) {
    const publicKey = Buffer.from(config_1.default.get(keyName)).toString("ascii");
    try {
        const decoded = jsonwebtoken_1.default.verify(token, publicKey);
        return {
            valid: true,
            expired: false,
            decoded
        };
    }
    catch (error) {
        return {
            valid: false,
            expired: error.message === 'jwt expired',
            decoded: null
        };
    }
}
