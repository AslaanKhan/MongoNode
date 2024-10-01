import mongoose from "mongoose";
import { optional } from "zod";

export interface Condition {
    minQuantity?: number; // Minimum quantity for the discount
    discountPerVal?: number; // Discount amount per kg
}

export interface OfferDocument extends mongoose.Document {
    productIds: mongoose.Schema.Types.ObjectId[];
    discountPercentage?: number; // For percentage discounts
    conditions?: Condition; // Conditions for the offer
    startDate: Date;
    endDate: Date;
    code?: string; // Optional promotional code
    isActive: boolean; // Indicates if the offer is active
}

const OfferSchema = new mongoose.Schema({
    productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Products" }],
    discountPercentage: { type: Number }, // Optional for percentage discounts
    conditions: {
        minQuantity: { type: Number }, // Optional minimum quantity condition
        discountPerVal: { type: Number }, // Discount per kg
    },
    startDate: { type: Date },
    endDate: { type: Date },
    code: { type: String },
    isActive: { type: Boolean, default: true }, // By default, offers are active
});

// Middleware to ensure the offer is valid
OfferSchema.pre('save', function(next) {
    if (this.endDate && this.startDate && this.startDate >= this.endDate) {
        return next(new Error("Start date must be before end date."));
    }
    next();
});

const OfferModel = mongoose.model<OfferDocument>("Offers", OfferSchema);

export default OfferModel;
