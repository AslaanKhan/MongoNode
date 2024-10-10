import mongoose from "mongoose";
import OfferModel, { OfferDocument } from "../models/offer.model";
import ProductModel from "../models/product.model";

export async function getAllOffers() {
    return OfferModel.find()
}

export async function getOfferById(Id:string) {
    return OfferModel.findOne({_id:Id});
}

export async function updateOfferAndUpdateProducts(offerId: string, offerData: OfferDocument) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const existingOffer = await OfferModel.findById(offerId);

        if (!existingOffer) {
            throw new Error("Offer not found");
        }
        const currentProductIds = existingOffer.productIds.map(productOffer => productOffer.product.toString());
        const newProductIds = offerData.productIds.map(productOffer => productOffer.product.toString());
        const productsToRemoveOfferFrom = currentProductIds?.filter(productId => !newProductIds.includes(productId));
        const productsToAddOfferTo = newProductIds.filter(productId => !currentProductIds.includes(productId));

        if (productsToRemoveOfferFrom.length > 0) {
            await ProductModel.updateMany(
                { _id: { $in: productsToRemoveOfferFrom } },
                { $pull: { offers: offerId } },
                { session }
            );
        }

        if (productsToAddOfferTo.length > 0) {
            await ProductModel.updateMany(
                { _id: { $in: productsToAddOfferTo } },
                { $addToSet: { offers: offerId } },
                { session }
            );
        }

        const updatedOffer = await OfferModel.findByIdAndUpdate(offerId, offerData, { new: true, session });

        await session.commitTransaction();
        session.endSession();

        return updatedOffer;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
}

export async function getProductNamesByIds(productIds: string[]) {
    const products = await ProductModel.find({ _id: { $in: productIds } });
    return products.map(product => product.title);
}

export async function createOfferAndUpdateProducts(offerData: OfferDocument) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const newOffer = await OfferModel.create([offerData], { session });
        const offerId = newOffer[0]._id;
        const productIds = offerData.productIds.map(productOffer => productOffer.product);

        await ProductModel.updateMany(
            { _id: { $in: productIds } },
            { $addToSet: { offers: offerId } },
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        return newOffer[0];
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
 
}

// Function to calculate the final price after applying offers
// async function calculateFinalPrice(productId: string, quantity: number) {
//     const product = await ProductModel.findById(productId).populate<{ offerIds: OfferDocument[] }>('offerIds');
    
//     if (product) {
//         let finalPrice = product.price * quantity; // Base price without discount

//         // Check for applicable offers
//         const applicableOffers = product.offerIds.filter(offer => 
//             offer.isActive && 
//             new Date() >= offer.startDate && 
//             new Date() <= offer.endDate
//         );

//         applicableOffers.forEach(offer => {
//             // Check if conditions are met for the offer
//             const productOffer = offer.productIds.find(productOffer => productOffer.product.toString() === productId);
//             if (productOffer) {
//                 const { conditions, discountPercentage, flatDiscount } = productOffer;

//                 // Handle conditions and discounts
//                 if (conditions && conditions.minQuantity && quantity >= conditions.minQuantity) {
//                     // Apply discount per value if it exists
//                     if (conditions.discountPerVal) {
//                         const discount = conditions.discountPerVal * (quantity - conditions.minQuantity);
//                         finalPrice -= discount; // Apply discount
//                     }
//                 }
                
//                 // Apply flat discount if specified
//                 if (flatDiscount) {
//                     finalPrice -= flatDiscount;
//                 }

//                 // Apply percentage discount if specified
//                 if (discountPercentage) {
//                     const discountAmount = (finalPrice * discountPercentage) / 100;
//                     finalPrice -= discountAmount;
//                 }
//             }
//         });

//         return finalPrice;
//     }
// }