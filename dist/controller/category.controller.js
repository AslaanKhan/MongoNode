"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCategorytHandler = createCategorytHandler;
exports.getCategoriesHandler = getCategoriesHandler;
exports.updateCategoriesHandler = updateCategoriesHandler;
exports.deleteCategoryHandler = deleteCategoryHandler;
const user_model_1 = __importDefault(require("../models/user.model"));
const category_service_1 = require("../service/category.service");
async function createCategorytHandler(req, res) {
    const body = req.body;
    const user = await user_model_1.default.findOne({ _id: res?.locals?.user?._doc?._id });
    // if (!user?.isAdmin) {
    //     return res.send({ status: 200, message: "Only admin can create category" })
    // }
    await (0, category_service_1.createCategory)(body);
    return res.send({ status: "200", message: "Category created" });
}
async function getCategoriesHandler(req, res) {
    const categories = await (0, category_service_1.getCategories)();
    return res.send({ status: "200", categories });
}
async function updateCategoriesHandler(req, res) {
    const user = await user_model_1.default.findOne({ _id: res?.locals.user?._doc?._id });
    const categoryId = req.params.categoryId;
    const update = req.body;
    const categoryExist = await (0, category_service_1.getCategory)({ _id: categoryId });
    if (!categoryExist) {
        return res.status(201).send({ message: "Category not found" });
    }
    const categories = await (0, category_service_1.updateCategory)({ _id: categoryId }, update, { new: true });
    return res.send({ status: "200", categories });
}
async function deleteCategoryHandler(req, res) {
    const categoryId = req.params.categoryId;
    await (0, category_service_1.deleteCategory)({ _id: categoryId });
    return res.send({ status: "200", message: "Category deleted" });
}
