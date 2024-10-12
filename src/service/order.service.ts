import { Response } from "express";
import mongoose, { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import OrderModel, { OrderDocument } from "../models/order.model";
import { ProductDocument } from "../models/product.model";


export async function createOrder(order: any) {
    return await OrderModel.create(order);
}

export async function getOrder(query: FilterQuery<OrderDocument>) {
    const matchCriteria: any = {
        _id: new mongoose.Types.ObjectId(query?._id),   
    };

    return OrderModel.aggregate([
        { $match: matchCriteria },
        {
            $unwind: '$products', 
        },
        {
            $lookup: {
                from: 'products',
                localField: 'products.id',
                foreignField: '_id',
                as: 'productDetails',
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'userDetails',
            },
        },
        {
            $unwind: { path: "$productDetails", preserveNullAndEmptyArrays: true },
        },
        {
            $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true },
        },
        {
            $group: {
                _id: "$_id",
                user: { $first:{ name:"$userDetails.name", number:"$userDetails.number"}},
                orderDate: { $first: "$createdAt" },
                totalPrice: { $first: "$amount" },
                orderStatus: { $first: "$orderStatus" },
                paymentMehtod: { $first: "$paymentMode" },
                products: {
                    $push: {
                        productId: "$products.id",
                        quantity: "$products.quantity",
                        title: "$productDetails.title",
                        price: "$productDetails.price",
                        image: "$productDetails.image",
                    }
                }
            },
        },
        {
            $project: {
                _id: 1,
                user: 1,
                orderDate: 1,
                orderStatus: 1,
                paymentMehtod: 1,
                totalPrice: 1,
                products: 1,
            },
        },
    ]).exec();
}

export async function getOrders() {
    return OrderModel.find();
}

export async function getOrdersByUserId(query:FilterQuery<OrderDocument>) {
    return await OrderModel.find(query);
}

export async function updateOrder(
    query: FilterQuery<ProductDocument>,
    update: UpdateQuery<ProductDocument>,
    options: QueryOptions = { lean: true }
) {
    return OrderModel.findOneAndUpdate(query, update, options).exec();
}

export async function cancelOrder( 
    query: FilterQuery<ProductDocument>, 
    update: UpdateQuery<ProductDocument>,
    ) {
    return OrderModel.findOneAndUpdate(query, update);
}
