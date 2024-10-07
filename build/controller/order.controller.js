"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrdertHandler = createOrdertHandler;
exports.updateOrdertHandler = updateOrdertHandler;
exports.getOrdersByUserIdHandler = getOrdersByUserIdHandler;
exports.getOrderByIdHandler = getOrderByIdHandler;
exports.cancelOrderHandler = cancelOrderHandler;
const product_model_1 = __importDefault(require("../models/product.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const order_service_1 = require("../service/order.service");
async function createOrdertHandler(req, res) {
    const body = req.body;
    const user = await user_model_1.default.findOne({ _id: res.locals.user._doc._id });
    if (!user) {
        return res.send({ status: 200, message: "Please login or signup" });
    }
    let totalAmount = 0;
    for (const product of body.products) {
        const productTotal = await product_model_1.default.findOne({ _id: product.id });
        if (productTotal) {
            const price = productTotal.price * product.quantity;
            totalAmount += price;
        }
        else {
            return res.send(`Product not found: ${product.id}`);
        }
    }
    totalAmount = Number(totalAmount.toFixed(2));
    await (0, order_service_1.createOrder)({ ...body, amount: totalAmount, user: user._id });
    return res.send({ status: "200", message: "Order placed" });
}
async function updateOrdertHandler(req, res) {
    const user = await user_model_1.default.findOne({ _id: res.locals.user._doc._id });
    const orderId = req.params.orderId;
    const update = req.body;
    const order = await (0, order_service_1.getOrder)({ orderId });
    if (!order) {
        return res.sendStatus(404);
    }
    await (0, order_service_1.updateOrder)({ orderId }, update, { new: true });
    return res.send({ status: '200', message: "Order Updated" });
}
async function getOrdersByUserIdHandler(req, res) {
    const user = await user_model_1.default.findOne({ _id: res?.locals?.user?._doc?._id });
    if (user) {
        const orders = await (0, order_service_1.getOrdersByUserId)(res);
        return res.send({ status: "200", orders: orders });
    }
    const order = await (0, order_service_1.getOrders)();
    return res.send({ status: "200", order });
}
async function getOrderByIdHandler(req, res) {
    const orderId = req.params.orderId;
    console.log(req.params.orderId);
    const order = await (0, order_service_1.getOrder)({ _id: orderId });
    return res.send({ status: "200", order });
}
async function cancelOrderHandler(req, res) {
    const orderId = req.params.orderId;
    const order = await (0, order_service_1.getOrder)({ _id: orderId });
    if (!order) {
        return res.sendStatus(404);
    }
    await (0, order_service_1.cancelOrder)({ _id: orderId }, { orderStatus: "cancelled" });
    return res.send({ status: "200", message: "Order Cancelled" });
}
