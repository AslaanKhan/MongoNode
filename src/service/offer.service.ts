import mongoose from "mongoose";
import OfferModel, { OfferDocument } from "../models/offer.model";
import ProductModel from "../models/product.model";
import c from "config";

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
        
        const productsToRemoveOfferFrom = currentProductIds.filter(productId => !newProductIds.includes(productId));
        const productsToAddOfferTo = newProductIds;

        if (productsToRemoveOfferFrom.length > 0) {
            const products = await ProductModel.find({ _id: { $in: productsToRemoveOfferFrom } });
            for (const product of products) {
                let finalPrice = product.sellingPrice;
                
                const productOffer = existingOffer.productIds.find(po => po.product.toString() === product._id.toString());
                
                if (productOffer) {
                    const { discountPercentage, flatDiscount } = offerData;
                    
                    if (flatDiscount && flatDiscount > 0) {
                        finalPrice += flatDiscount;
                    }

                    if (discountPercentage && discountPercentage > 0) {
                        const discountAmount = (product.price * discountPercentage) / 100;
                        finalPrice += discountAmount;
                    }

                    finalPrice = Math.round(Math.max(finalPrice, 0));

                    await ProductModel.updateOne(
                        { _id: product._id },
                        { 
                            $pull: { offers: offerId },
                            $set: {
                                sellingPrice: finalPrice,
                            }
                        },
                        { session }
                    );
                }
            }
        }

        if (productsToAddOfferTo.length > 0) {
            const products = await ProductModel.find({ _id: { $in: productsToAddOfferTo } });
            for (const product of products) {
                let finalPrice = product.sellingPrice || product.price;
                
                const productOffer = offerData.productIds.find(po => po.product.toString() === product._id.toString());
                
                if (productOffer) {
                    const { discountPercentage, flatDiscount } = offerData;
                    
                    if (flatDiscount && flatDiscount > 0) {
                        finalPrice -= flatDiscount;
                    }

                    if (discountPercentage && discountPercentage > 0) {
                        const discountAmount = (product.price * discountPercentage) / 100;
                        finalPrice -= discountAmount;
                    }

                    finalPrice = Math.round(Math.max(finalPrice, 0));

                    await ProductModel.updateOne(
                        { _id: product._id },
                        {
                            $addToSet: { offers: offerId },
                            $set: {
                                sellingPrice: finalPrice,
                            }
                        },
                        { session }
                    );
                }
            }
        }

        // Finally, update the offer details
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

export async function toggleOffer(offerId: string, toggleValue: Partial<OfferDocument>) {
    const session = await mongoose.startSession();
    session.startTransaction();

    const offerData = await OfferModel.findById(offerId);
    try {
        const currentProductIds = offerData.productIds.map(productOffer => productOffer.product.toString());
        const products = await ProductModel.find({ _id: { $in: currentProductIds } });
        for (const product of products) {
            let finalPrice = product.sellingPrice;
            
            const productOffer = offerData.productIds.find(po => po.product.toString() === product._id.toString());
            
            if (productOffer) {
                const { discountPercentage, flatDiscount } = offerData;
                if (flatDiscount && flatDiscount > 0) {
                    if(toggleValue.isActive){
                        finalPrice -= flatDiscount;
                    }else{
                        finalPrice += flatDiscount;
                    }
                }

                if (discountPercentage && discountPercentage > 0) {
                    const discountAmount = (product.price * discountPercentage) / 100;
                    if(toggleValue.isActive){
                        finalPrice -= discountAmount;
                    }else{
                        finalPrice += discountAmount;
                    }
                }

                finalPrice = Math.round(Math.max(finalPrice, 0));
                if(toggleValue.isActive){
                    await ProductModel.updateOne(
                        { _id: product._id },
                        { 
                            $addToSet: { offers: offerId },
                            $set: {
                                sellingPrice: finalPrice,
                            }
                        },
                        { session }
                    );
                }else{
                    await ProductModel.updateOne(
                        { _id: product._id },
                        { 
                            $pull: { offers: offerId },
                            $set: {
                                sellingPrice: finalPrice,
                            }
                        },
                        { session }
                    );
                }
            }
        }
        const updatedOffer = await OfferModel.findByIdAndUpdate(offerId, toggleValue, { new: true, session });

        await session.commitTransaction();
        session.endSession();

        return updatedOffer;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
}

export async function deleteOffer(offerId: string) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        await toggleOffer(offerId, { isActive: false });
        await OfferModel.findByIdAndDelete(offerId, { session });
        await session.commitTransaction();
        session.endSession();
        return true;
    }catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
}

export async function createOfferAndUpdateProducts(offerData: OfferDocument) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const newOffer = await OfferModel.create([offerData], { session });
        const offerId = newOffer[0]._id;
        const productIds = offerData.productIds.map(productOffer => productOffer.product);
        const products = await ProductModel.find({ _id: { $in: productIds } });

        for (const product of products) {
            let finalPrice = product.price; // Base price without discount

            // Check if the offer has a percentage or flat discount
            const productOffer = offerData.productIds.find(po => po.product.toString() === product._id.toString());
            if (productOffer) {
                const { discountPercentage, flatDiscount } = offerData; 

                if (flatDiscount) {
                    finalPrice -= flatDiscount;
                }

                if (discountPercentage) {
                    const discountAmount = (product.price * discountPercentage) / 100;
                    finalPrice -= discountAmount;
                }

                finalPrice = Math.max(finalPrice, 0);

                await ProductModel.updateOne(
                    { _id: product._id },
                    {
                        $addToSet: { offers: offerId },
                        $set: {
                            sellingPrice: finalPrice,
                        }
                    },
                    { session }
                );
            }
        }

        await session.commitTransaction();
        session.endSession();

        return newOffer[0];
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
 
}
