import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import ProductModel, { ProductDocument } from "../models/product.model";


export async function createProduct(product: any) {
    try {
        return await ProductModel.create(product);
    } catch (error) {
        console.log(error)
        return error
    }
}

export async function getProduct(
    query: FilterQuery<ProductDocument>,
    options: QueryOptions = { lean: true }
) {
    return ProductModel.findOne(query, {}, options);
}

export async function getProductByCategory(
    query: FilterQuery<ProductDocument>,
    options: QueryOptions = { lean: true }
) {
    return ProductModel.find(query, {}, options);
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
