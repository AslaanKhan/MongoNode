"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ProductSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    image: [{ path: { type: String } }],
    category: {
        name: { type: String, required: true },
        id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Category", required: true },
    },
    isAvailable: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    offers: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Offers" }], // Store references to offers
});
// Middleware to update updatedAt field before saving
ProductSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});
const ProductModel = mongoose_1.default.model("Products", ProductSchema);
exports.default = ProductModel;
