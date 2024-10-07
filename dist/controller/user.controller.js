"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrGetUserHandler = createOrGetUserHandler;
exports.getAllUsershandler = getAllUsershandler;
exports.getUserByIdHandler = getUserByIdHandler;
exports.adminLoginHandler = adminLoginHandler;
const validateResource_1 = __importDefault(require("../middleware/validateResource"));
const user_model_1 = __importDefault(require("../models/user.model"));
const user_schema_1 = require("../schema/user.schema");
const user_service_1 = require("../service/user.service");
const logger_1 = __importDefault(require("../utils/logger"));
const sessionController_1 = require("./sessionController");
async function createOrGetUserHandler(req, res) {
    try {
        const { number, name } = req.body;
        let existingUser;
        if (number) {
            existingUser = await (0, user_service_1.getUserByParam)({ number });
        }
        else if (name) {
            existingUser = await (0, user_service_1.getUserByParam)({ number });
        }
        if (existingUser) {
            const token = await (0, sessionController_1.createUserSessionHandler)(req, res, existingUser);
            return res.send({ status: 200, message: 'User logged in', token: token });
        }
        ;
        (0, validateResource_1.default)(user_schema_1.createUserSchema)(req, res, async () => {
            // Create a new user
            const user = await (0, user_service_1.createUser)(req.body);
            const token = await (0, sessionController_1.createUserSessionHandler)(req, res, user);
            return res.send({ status: 200, message: 'User created successfully', token: token });
        });
    }
    catch (error) {
        logger_1.default.error(error);
        return res.status(409).send(error.message);
    }
}
async function getAllUsershandler(req, res) {
    try {
        const users = await user_model_1.default.find({});
        // setTimeout(() => {
        //   return res.send({ status: 200, users });
        // }, 60000);
        return res.send({ status: 200, users });
    }
    catch (error) {
        console.error('Error fetching users:', error);
        return res.status(500).send({ status: 500, message: 'Internal Server Error' });
    }
}
async function getUserByIdHandler(req, res) {
    try {
        const { id } = req.params;
        const user = await (0, user_service_1.getUserByParam)({ _id: id });
        // setTimeout(() => {
        //   return res.send({ status: 200, users });
        // }, 60000);
        return res.send({ status: 200, user });
    }
    catch (error) {
        console.error('Error fetching users:', error);
        return res.status(500).send({ status: 500, message: 'Internal Server Error' });
    }
}
async function adminLoginHandler(req, res) {
    try {
        const { id } = req.params;
        const user = await (0, user_service_1.getUserByParam)({ number: id });
        if (user?.isAdmin) {
            const token = await (0, sessionController_1.createUserSessionHandler)(req, res, user);
            return res.send({ status: 200, message: 'User logged in', token: token });
        }
        return res.send({ status: 201, message: 'User not admin' });
        // setTimeout(() => {
        //   return res.send({ status: 200, users });
        // }, 60000);
    }
    catch (error) {
        console.error('Error fetching users:', error);
        return res.status(500).send({ status: 500, message: 'Internal Server Error' });
    }
}
