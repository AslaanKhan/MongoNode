import mongoose from "mongoose";

export interface Condition {
    minQuantity?: number; // Minimum quantity for the discount
    discountPerVal?: number; // Discount amount per kg
}

export interface ProductOffer {
    product: mongoose.Schema.Types.ObjectId; // Product ID
    productName: string; // Product Name    
}

export interface OfferDocument extends mongoose.Document {
    productIds: ProductOffer[];
    discountPercentage?: number; // Optional percentage discount
    flatDiscount?: number; // Optional flat discount
    conditions?: Condition; // Optional conditions for the offer
    startDate: Date;
    endDate: Date;
    code?: string; // Optional promotional code
    isActive: boolean; // Indicates if the offer is active
}

const OfferSchema = new mongoose.Schema({
    productIds: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Products"}, // Product ID
        productName: { type: String,}, // Product Name
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
OfferSchema.pre('save', function(next) {
    this.productIds.forEach((offer: any) => {
        if (offer.discountPercentage && offer.flatDiscount) {
            return next(new Error("Cannot apply both percentage and flat discount for the same product."));
        }
    });

    if (this.startDate && this.endDate && this.startDate >= this.endDate) {
        return next(new Error("Start date must be before end date."));
    }

    next();
});

const OfferModel = mongoose.model<OfferDocument>("Offers", OfferSchema);

export default OfferModel;
