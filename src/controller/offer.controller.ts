import { Request, Response } from "express";
import UserModel from "../models/user.model";
import { deleteCategory, getCategory, updateCategory } from "../service/category.service";
import { createOffer, getAllOffers } from "../service/offer.service";

export async function createOfferHandler(req: Request, res: Response) {
    const body = req.body
    const user = await UserModel.findOne({ _id: res?.locals?.user?._doc?._id })

    // if (!user?.isAdmin) {
    //     return res.send({ status: 200, message: "Only admin can create category" })
    // }

    await createOffer(body)
    return res.send({ status: "200", message: "Offer created" })
}

export async function getOffersHandler(req: Request, res: Response) {
    const offers = await getAllOffers()
    return res.send({ status: "200", offers })
}

export async function updateCategoriesHandler(req: Request, res: Response) {
    const user = await UserModel.findOne({ _id: res?.locals.user?._doc?._id })
    const categoryId = req.params.categoryId
    const update = req.body
    const categoryExist = await getCategory({ _id: categoryId })

    if (!categoryExist) {
        return res.status(201).send({message: "Category not found" })
    }
    const categories = await updateCategory({ _id: categoryId }, update, { new: true })
    return res.send({ status: "200", categories })
}

export async function deleteCategoryHandler(req: Request, res: Response) {
    const categoryId = req.params.categoryId
    await deleteCategory({ _id: categoryId })
    return res.send({ status: "200", message: "Category deleted" })
}