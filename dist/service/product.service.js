"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProduct = createProduct;
exports.getProduct = getProduct;
exports.getProductByCategory = getProductByCategory;
exports.getAllProducts = getAllProducts;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
const product_model_1 = __importDefault(require("../models/product.model"));
async function createProduct(product) {
    try {
        return await product_model_1.default.create(product);
    }
    catch (error) {
        console.log(error);
        return error;
    }
}
async function getProduct(query, options = { lean: true }) {
    return product_model_1.default.findOne(query, {}, options);
}
async function getProductByCategory(query, options = { lean: true }) {
    return product_model_1.default.find(query, {}, options);
}
async function getAllProducts() {
    return await product_model_1.default.find({});
}
async function updateProduct(query, update, options = { lean: true }) {
    return product_model_1.default.findOneAndUpdate(query, update, options);
}
async function deleteProduct(query) {
    return product_model_1.default.findOneAndDelete(query);
}
