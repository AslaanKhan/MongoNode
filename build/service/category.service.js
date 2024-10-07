"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCategory = createCategory;
exports.getCategory = getCategory;
exports.getCategories = getCategories;
exports.updateCategory = updateCategory;
exports.deleteCategory = deleteCategory;
const category_model_1 = __importDefault(require("../models/category.model"));
const product_model_1 = __importDefault(require("../models/product.model"));
async function createCategory(Category) {
    return await category_model_1.default.create({ ...Category, isAvailable: true });
}
async function getCategory(query, options = { lean: true }) {
    return category_model_1.default.findOne(query, {}, options);
}
async function getCategories() {
    return await category_model_1.default.find({});
}
async function updateCategory(query, update, options = { lean: true }) {
    // Update the category
    const updatedCategory = await category_model_1.default.findOneAndUpdate(query, update, options);
    // If the category was updated, reflect this change in related products
    if (updatedCategory) {
        await product_model_1.default.updateMany({ 'category.id': updatedCategory._id }, { $set: { 'category.name': updatedCategory.name, 'isAvailable': updatedCategory?.isAvailable } });
    }
    return updatedCategory;
}
async function deleteCategory(query) {
    return category_model_1.default.findOneAndDelete(query);
}
