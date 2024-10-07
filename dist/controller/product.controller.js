"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProductHandler = createProductHandler;
exports.updateProductHandler = updateProductHandler;
exports.getProductHandler = getProductHandler;
exports.getProductByIdHandler = getProductByIdHandler;
exports.getProductByCategoryHandler = getProductByCategoryHandler;
exports.deleteProductHandler = deleteProductHandler;
const user_model_1 = __importDefault(require("../models/user.model"));
const product_service_1 = require("../service/product.service");
async function createProductHandler(req, res) {
    const body = req.body;
    const user = await user_model_1.default.findOne({ _id: res?.locals?.user?._doc?._id });
    // if(!user?.isAdmin){
    //     return res.send({ status:200, message:"User not admin" })
    // }
    try {
        const product = await (0, product_service_1.createProduct)(body);
        return res.send({ status: "200", message: "Product Created", product });
    }
    catch (error) {
        return res.send({ status: "200", message: "Something went wrong", error });
    }
}
async function updateProductHandler(req, res) {
    const user = await user_model_1.default.findOne({ _id: res?.locals.user?._doc?._id });
    const productId = req.params.productId;
    const update = req.body;
    const productExist = await (0, product_service_1.getProduct)({ _id: productId });
    if (!productExist) {
        return res.sendStatus(404);
    }
    // if(!user?.isAdmin){
    //     return res.status(403).send({ message:"User not admin" })
    // }
    const product = await (0, product_service_1.updateProduct)({ _id: productId }, update, { new: true });
    return res.send({ status: '200', message: "Product Updated", product });
}
async function getProductHandler(req, res) {
    const products = await (0, product_service_1.getAllProducts)();
    return res.send({ status: "200", products: products });
}
async function getProductByIdHandler(req, res) {
    const productId = req.params.productId;
    const products = await (0, product_service_1.getProduct)({ _id: productId });
    return res.send({ status: "200", product: products });
}
async function getProductByCategoryHandler(req, res) {
    const categoryId = req.params.categoryId;
    const products = await (0, product_service_1.getProductByCategory)({ 'category.id': categoryId });
    return res.send({ status: "200", product: products });
}
async function deleteProductHandler(req, res) {
    const user = await user_model_1.default.findOne({ _id: res?.locals?.user?._doc?._id });
    const productId = req.params.productId;
    const product = await (0, product_service_1.getProduct)({ _id: productId });
    if (!product) {
        return res.send({ status: "200", message: "Product not found" });
    }
    // if(!user?.isAdmin){
    //     return res.status(403).send({ message:"User not admin" })
    // }
    await (0, product_service_1.deleteProduct)({ _id: productId });
    return res.send({ status: "200", message: "Product deleted " });
}
