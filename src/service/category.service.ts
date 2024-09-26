import { Response } from "express";
import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import CategoryModel from "../models/category.model";
import OrderModel from "../models/order.model";
import { ProductDocument } from "../models/product.model";


export async function createCategory(Category: any) {
    return await CategoryModel.create(Category);
}

export async function getOrder(
    query: FilterQuery<ProductDocument>,
    options: QueryOptions = { lean: true }
) {
    return OrderModel.findOne(query, {}, options);
}

export async function getCategories() {
    return await CategoryModel.find({})
}

export async function updateOrder(
    query: FilterQuery<ProductDocument>,
    update: UpdateQuery<ProductDocument>,
    options: QueryOptions = { lean: true }
) {
    return OrderModel.findOneAndUpdate(query, update, options);
}

export async function deleteCategory(
    query: FilterQuery<ProductDocument>,
) {
    return CategoryModel.findOneAndDelete(query);
}
