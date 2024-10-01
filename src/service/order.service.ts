import { Response } from "express";
import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import OrderModel from "../models/order.model";
import ProductModel, { ProductDocument } from "../models/product.model";


export async function createOrder(order: any) {
    return await OrderModel.create(order);
}

export async function getOrder(
    query: FilterQuery<ProductDocument>,
    options: QueryOptions = { lean: true }
) {
    return OrderModel.findOne(query, {}, options);
}

export async function getOrders() {
    return OrderModel.find();
}

export async function getOrdersByUserId(res: Response) {
    return await OrderModel.find({}).where("user").equals(res.locals.user._doc._id);
}

export async function updateOrder(
    query: FilterQuery<ProductDocument>,
    update: UpdateQuery<ProductDocument>,
    options: QueryOptions = { lean: true }
) {
    return OrderModel.findOneAndUpdate(query, update, options);
}

export async function cancelOrder( 
    query: FilterQuery<ProductDocument>, 
    update: UpdateQuery<ProductDocument>,
    ) {
    return OrderModel.findOneAndUpdate(query, update);
}
