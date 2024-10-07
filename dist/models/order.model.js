"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const OrderSchema = new mongoose_1.default.Schema({
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true },
    userAgent: { type: String },
    amount: { type: Number, required: true },
    paymentMode: { type: String, required: true },
    paymentId: { type: String },
    paymentStatus: { type: String },
    paymentResult: { type: String },
    orderStatus: { type: String, default: "pending" },
    products: [{
            id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Product", required: true },
            quantity: { type: Number, required: true, min: 1 }
        }],
}, {
    timestamps: true,
});
const OrderModel = mongoose_1.default.model("Order", OrderSchema);
exports.default = OrderModel;
