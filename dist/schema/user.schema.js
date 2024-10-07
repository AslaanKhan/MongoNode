"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
exports.createUserSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        name: (0, zod_1.string)(),
        email: (0, zod_1.string)(),
        password: (0, zod_1.string)(),
        address: (0, zod_1.string)(),
        number: (0, zod_1.string)().min(10, "Enter a valid Phone number").max(13, "Enter a valid phone number"),
    })
});
exports.getUserSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        name: (0, zod_1.string)(),
        email: (0, zod_1.string)(),
        password: (0, zod_1.string)(),
        address: (0, zod_1.string)(),
        number: (0, zod_1.string)().min(10, "Enter a valid Phone number").max(13, "Enter a valid phone number"),
    })
});
