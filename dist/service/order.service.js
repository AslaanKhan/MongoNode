"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrder = createOrder;
exports.getOrder = getOrder;
exports.getOrders = getOrders;
exports.getOrdersByUserId = getOrdersByUserId;
exports.updateOrder = updateOrder;
exports.cancelOrder = cancelOrder;
const order_model_1 = __importDefault(require("../models/order.model"));
async function createOrder(order) {
    return await order_model_1.default.create(order);
}
async function getOrder(query, options = { lean: true }) {
    return order_model_1.default.findOne(query, {}, options);
}
async function getOrders() {
    return order_model_1.default.find();
}
async function getOrdersByUserId(res) {
    return await order_model_1.default.find({}).where("user").equals(res.locals.user._doc._id);
}
async function updateOrder(query, update, options = { lean: true }) {
    return order_model_1.default.findOneAndUpdate(query, update, options);
}
async function cancelOrder(query, update) {
    return order_model_1.default.findOneAndUpdate(query, update);
}
