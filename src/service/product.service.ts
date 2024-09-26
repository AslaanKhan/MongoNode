import { Omit } from "lodash";
import { Document, FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import ProductModel, { ProductDocument } from "../models/product.model";


export async function createProduct(product: any) {
    return await ProductModel.create(product);
}

export async function getProduct(
    query: FilterQuery<ProductDocument>,
    options: QueryOptions = { lean: true }
) {
    return ProductModel.findOne(query, {}, options);
}

export async function getAllProducts() {
    return await ProductModel.find({})
}

export async function updateProduct(
    query: FilterQuery<ProductDocument>,
    update: UpdateQuery<ProductDocument>,
    options: QueryOptions = { lean: true }
) {
    return ProductModel.findOneAndUpdate(query, update, options);
}

export async function deleteProduct(query: FilterQuery<ProductDocument>) {
    return ProductModel.findOneAndDelete(query);
}
