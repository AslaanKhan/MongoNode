"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllOffers = getAllOffers;
exports.getOfferById = getOfferById;
exports.updateOfferAndUpdateProducts = updateOfferAndUpdateProducts;
exports.getProductNamesByIds = getProductNamesByIds;
exports.createOfferAndUpdateProducts = createOfferAndUpdateProducts;
const mongoose_1 = __importDefault(require("mongoose"));
const offer_model_1 = __importDefault(require("../models/offer.model"));
const product_model_1 = __importDefault(require("../models/product.model"));
// Function to get all offers
async function getAllOffers() {
    return offer_model_1.default.find(); // Populate product details
}
async function getOfferById(Id) {
    return offer_model_1.default.findOne({ _id: Id }); // Populate product details
}
async function updateOfferAndUpdateProducts(offerId, offerData) {
    const session = await mongoose_1.default.startSession(); // Start a session for transaction
    session.startTransaction();
    try {
        // Get the current state of the offer
        const existingOffer = await offer_model_1.default.findById(offerId);
        if (!existingOffer) {
            throw new Error("Offer not found");
        }
        // Extract the current product IDs from the existing offer
        const currentProductIds = existingOffer.productIds.map(productOffer => productOffer.product.toString());
        // Extract the new product IDs from the updated data
        const newProductIds = offerData.productIds.map(productOffer => productOffer.product.toString());
        // Find products to remove the offer from (products not in the new list)
        const productsToRemoveOfferFrom = currentProductIds?.filter(productId => !newProductIds.includes(productId));
        // console.log(currentProductIds)
        // Find products to add the offer to (products not in the current list)
        const productsToAddOfferTo = newProductIds.filter(productId => !currentProductIds.includes(productId));
        // Remove offer ID from products that are no longer in the updated offer
        if (productsToRemoveOfferFrom.length > 0) {
            await product_model_1.default.updateMany({ _id: { $in: productsToRemoveOfferFrom } }, { $pull: { offers: offerId } }, { session });
        }
        // Add offer ID to products that are newly added to the offer
        if (productsToAddOfferTo.length > 0) {
            await product_model_1.default.updateMany({ _id: { $in: productsToAddOfferTo } }, { $addToSet: { offers: offerId } }, { session });
        }
        // Finally, update the offer itself
        const updatedOffer = await offer_model_1.default.findByIdAndUpdate(offerId, offerData, { new: true, session });
        // Commit the transaction
        await session.commitTransaction();
        session.endSession();
        return updatedOffer;
    }
    catch (error) {
        // If something goes wrong, abort the transaction
        await session.abortTransaction();
        session.endSession();
        throw error; // Throw the error to handle it properly in the caller
    }
}
async function getProductNamesByIds(productIds) {
    const products = await product_model_1.default.find({ _id: { $in: productIds } });
    return products.map(product => product.title); // Adjust according to your product model
}
// Function to create a new offer
async function createOfferAndUpdateProducts(offerData) {
    const session = await mongoose_1.default.startSession(); // Start a session for transaction
    session.startTransaction();
    try {
        // Create the offer
        const newOffer = await offer_model_1.default.create([offerData], { session });
        // Extract the offer ID and the product IDs from the offer
        const offerId = newOffer[0]._id;
        const productIds = offerData.productIds.map(productOffer => productOffer.product);
        // Update each product's offerIds field by pushing the new offer ID
        await product_model_1.default.updateMany({ _id: { $in: productIds } }, // Find all products in the offer
        { $addToSet: { offers: offerId } }, // Add the offer ID to each product
        { session });
        // Commit the transaction
        await session.commitTransaction();
        session.endSession();
        return newOffer[0]; // Return the newly created offer
    }
    catch (error) {
        // If something goes wrong, abort the transaction
        await session.abortTransaction();
        session.endSession();
        throw error; // Throw the error to handle it properly in the caller
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
