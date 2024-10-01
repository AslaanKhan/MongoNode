import { FilterQuery } from "mongoose";
import OfferModel, { OfferDocument } from "../models/offer.model";
import ProductModel from "../models/product.model";


export async function getAllOffers() {
    return OfferModel.find();
}

export async function createOffer(offer: OfferDocument) {
    return OfferModel.create(offer);
}



async function calculateFinalPrice(productId: string, quantity: number) {
    const product = await ProductModel.findById(productId).populate<{ offerIds: OfferDocument[] }>('offerIds');;
    if (product) {
        let finalPrice = product.price * quantity; // Base price without discount
        // Check for applicable offers
        product?.offerIds?.forEach(offer => {
            if (offer?.isActive && new Date() >= offer.startDate && new Date() <= offer.endDate) {
                // Check if the quantity meets the conditions
                if (offer.conditions && offer.conditions.minQuantity && quantity >= offer.conditions.minQuantity) {
                    const discount = offer.conditions.discountPerVal ? offer.conditions.discountPerVal * (quantity - offer.conditions.minQuantity) : 0;
                    finalPrice -= discount; // Apply discount
                }
            }
        });
        return finalPrice;
    }

}

const offer = new OfferModel({
    productIds: ['productId1', 'productId2'],
    conditions: {
        minQuantity: 1, // Minimum 1 kg
        discountPerKg: 5, // $5 off for each kg above 1 kg
    },
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Offer valid for 7 days
});

// await offer.save();
