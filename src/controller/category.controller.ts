import { Request, Response } from "express";
import UserModel from "../models/user.model";
import { CreateOrderInput, UpdateOrderInput } from "../schema/order.schema";
import { createCategory, deleteCategory, getCategories, getCategory, updateCategory } from "../service/category.service";
import { cancelOrder, getOrder, updateOrder } from "../service/order.service";

export async function createCategorytHandler(req: Request, res: Response) {
    const body = req.body
    const user = await UserModel.findOne({ _id: res?.locals?.user?._doc?._id })

    // if (!user?.isAdmin) {
    //     return res.send({ status: 200, message: "Only admin can create category" })
    // }

    await createCategory(body?.value)
    return res.send({ status: "200", message: "Category created" })
}

export async function getCategoriesHandler(req: Request, res: Response) {
    const categories = await getCategories()
    return res.send({ status: "200", categories })
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