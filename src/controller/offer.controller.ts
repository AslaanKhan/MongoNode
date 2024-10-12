import { Request, Response } from "express";
import UserModel from "../models/user.model";
import { deleteCategory } from "../service/category.service";
import { createOfferAndUpdateProducts, getAllOffers, getOfferById, toggleOffer, updateOfferAndUpdateProducts } from "../service/offer.service";

export async function createOfferHandler(req: Request, res: Response) {
    const body = req.body
    const user = await UserModel.findOne({ _id: res?.locals?.user?._doc?._id })

    // if (!user?.isAdmin) {
    //     return res.send({ status: 200, message: "Only admin can create category" })
    // }

    try {
        const offer = await createOfferAndUpdateProducts(body); // Using the updated service
        return res.send({ status: "200", message: "Offer created", offer });
    } catch (error:any) {
        return res.status(500).send({ status: "500", message: "Error creating offer", error: error.message });
    }
}

export async function getAllOffersHandler(req: Request, res: Response) {
    const offers = await getAllOffers()
    return res.send({ status: "200", offers })
}

export async function getOfferByIdHandler(req: Request, res: Response) {
    const Id = req.params.offerId
    const offer = await getOfferById(Id)
    return res.send({ status: "200", offer })
}

export async function updateOfferByIdHandler(req: Request, res: Response) {
    const user = await UserModel.findOne({ _id: res?.locals.user?._doc?._id });
    const offerId = req.params.offerId;
    const updateData = req.body;

    const offerExist = await getOfferById(offerId);
    if (!offerExist) {
        return res.status(404).send({ message: "Offer not found" });
    }

    try {
        const updatedOffer = await updateOfferAndUpdateProducts(offerId, updateData);
        return res.send({ status: "200", message: "Offer Updated", offer: updatedOffer });
    } catch (error:any) {
        return res.status(500).send({ status: "500", message: "Error updating offer", error: error.message });
    }
}

export async function toggleOfferHandler(req:Request, res:Response) {    
    const offerId = req.params.offerId;
    const updateData = req.body;

    try {
        const updatedOffer = await toggleOffer(offerId, updateData);
        return res.send({ status: "200", message: "Offer Updated", offer: updatedOffer });
    } catch (error:any) {
        return res.status(500).send({ status: "500", message: "Error updating offer", error: error.message });
    }
}

export async function deleteCategoryHandler(req: Request, res: Response) {
    const categoryId = req.params.categoryId
    await deleteCategory({ _id: categoryId })
    return res.send({ status: "200", message: "Category deleted" })
}