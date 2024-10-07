"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSessionSchema = void 0;
const zod_1 = require("zod");
exports.createSessionSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        number: (0, zod_1.string)({
            required_error: "Password is required",
        }),
    }),
});
