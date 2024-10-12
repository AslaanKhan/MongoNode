import { Request, Response } from "express";
import ProductModel from "../models/product.model";
import UserModel from "../models/user.model";
import { CreateOrderInput, UpdateOrderInput } from "../schema/order.schema";
import { cancelOrder, createOrder, getOrder, getOrders, getOrdersByUserId, updateOrder } from "../service/order.service";

export async function createOrdertHandler(req: Request<{}, {}, CreateOrderInput["body"]>, res: Response) {
    const body = req.body
    const user = await UserModel.findOne({ _id: res?.locals?.user?._doc?._id })

    // if (!user) {
    //     return res.send({ status: 200, message: "Please login or signup" })
    // }

    let totalAmount = 0

    for (const product of body.products) {
        const productTotal = await ProductModel.findOne({ _id: product?.id });
        if (productTotal) {
            const price = productTotal.price * product.quantity;
            totalAmount += price;
        } else {
            return res.send(`Product not found: ${product.id}`);
        }
    }
    totalAmount = Number(totalAmount.toFixed(2));
    await createOrder({ ...body, amount: totalAmount, user: "67066344e5fb3ab43f4d9951", orderStatus:"completed" })
    return res.send({ status: "200", message: "Order placed" })
}

export async function updateOrdertHandler(req: Request<UpdateOrderInput["params"], UpdateOrderInput["body"]>, res: Response) {
    const user = await UserModel.findOne({ _id: res?.locals?.user?._doc?._id })
    const orderId = req.params.orderId
    const update = req.body
    const order = await getOrder({ _id: orderId })

    if (!order) {
        return res.sendStatus(404)
    }   

    await updateOrder({ _id: orderId }, update, { new: true })
    return res.send({ status: '200', message: "Order Updated" })
}

export async function getOrdersByUserIdHandler(req: Request, res: Response) {
    const user = await UserModel.findOne({ _id: res?.locals?.user?._doc?._id })
    // if(user){
    //     const orders = await getOrdersByUserId(res)
    //     return res.send({ status: "200", orders: orders })
    // }
    const { userId } = req.params
    const orders = await getOrdersByUserId({ user: userId})
    return res.send({ status: "200", orders })

}

export async function getAllOrdersHandler(req: Request, res: Response) {
    const user = await UserModel.findOne({ _id: res?.locals?.user?._doc?._id })
    // if(user){
    //     const orders = await getOrdersByUserId(res)
    //     return res.send({ status: "200", orders: orders })
    // }
    const orders = await getOrders()
    return res.send({ status: "200", orders })

}

export async function getOrderByIdHandler(req: Request<UpdateOrderInput["params"]>, res: Response) {
    const orderId = req.params.orderId
    const order = await getOrder({ _id: orderId })
    return res.send({ status: "200", order })
}

export async function cancelOrderHandler(req: Request, res: Response) {
    const orderId = req.params.orderId
    const order = await getOrder({ _id: orderId })

    if (!order) {
        return res.sendStatus(404)
    }


    await cancelOrder({ _id: orderId }, { orderStatus: "cancelled" })
    return res.send({ status: "200", message: "Order Cancelled" })
}