"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const OfferSchema = new mongoose_1.default.Schema({
    productIds: [{
            product: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Products" }, // Product ID
            productName: { type: String, }, // Product Name
        }],
    discountPercentage: { type: Number }, // Optional percentage discount
    flatDiscount: { type: Number }, // Optional flat discount
    conditions: {
        minQuantity: { type: Number }, // Optional minimum quantity condition
        discountPerVal: { type: Number }, // Discount per kg
    },
    startDate: { type: Date, },
    endDate: { type: Date, },
    code: { type: String },
    isActive: { type: Boolean, default: true }, // By default, offers are active
});
// Middleware to ensure either discountPercentage or flatDiscount is used per product, not both
OfferSchema.pre('save', function (next) {
    this.productIds.forEach((offer) => {
        if (offer.discountPercentage && offer.flatDiscount) {
            return next(new Error("Cannot apply both percentage and flat discount for the same product."));
        }
    });
    if (this.startDate && this.endDate && this.startDate >= this.endDate) {
        return next(new Error("Start date must be before end date."));
    }
    next();
});
const OfferModel = mongoose_1.default.model("Offers", OfferSchema);
exports.default = OfferModel;
