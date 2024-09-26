import { Request, Response } from "express";
import UserModel from "../models/user.model";
import { CreateOrderInput, UpdateOrderInput } from "../schema/order.schema";
import { createCategory, deleteCategory, getCategories } from "../service/category.service";
import { cancelOrder, getOrder, updateOrder } from "../service/order.service";

export async function createCategorytHandler(req: Request<{}, {}, CreateOrderInput["body"]>, res: Response) {
    const body = req.body
    const user = await UserModel.findOne({ _id: res.locals.user._doc._id })

    if (!user?.isAdmin) {
        return res.send({ status: 200, message: "Only admin can create category" })
    }

    await createCategory(body)
    return res.send({ status: "200", message: "Category created" })
}

export async function getCategoriesHandler(req: Request, res: Response) {
    const categories = await getCategories()
    return res.send({ status: "200", categories })
}

export async function getOrderByIdHandler(req: Request<UpdateOrderInput["params"]>, res: Response) {
    const orderId = req.params.orderId
    console.log(req.params.orderId)
    const order = await getOrder({ _id: orderId })
    return res.send({ status: "200", order })
}

export async function deleteCategoryHandler(req: Request, res: Response) {
    const categoryId = req.params.categoryId


    await deleteCategory({ _id: categoryId })
    return res.send({ status: "200", message: "Order Cancelled" })
}