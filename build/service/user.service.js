"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.getUserByParam = getUserByParam;
exports.updateUser = updateUser;
const user_model_1 = __importDefault(require("../models/user.model"));
async function createUser(input) {
    try {
        return await user_model_1.default.create(input);
    }
    catch (error) {
        throw new Error(error);
    }
}
// export async function getUser(query: FilterQuery<UserDocument>) {
//     return UserModel.findOne(query).lean();
//   }
async function getUserByParam(query) {
    return user_model_1.default.findOne(query).lean();
}
async function updateUser(query, update, options = { lean: true }) {
    return user_model_1.default.findOneAndUpdate(query, update, options);
}
