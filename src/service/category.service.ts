import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import CategoryModel, { CategoryDocument } from "../models/category.model";
import ProductModel from "../models/product.model";


export async function createCategory(Category: any) {
    return await CategoryModel.create({...Category, isAvailable: true});
}

export async function getCategory(
    query: FilterQuery<CategoryDocument>,
    options: QueryOptions = { lean: true }
) {
    return CategoryModel.findOne(query, {}, options);
}

export async function getCategories() {
    return await CategoryModel.find({})
}

export async function updateCategory(
    query: FilterQuery<CategoryDocument>,
    update: UpdateQuery<CategoryDocument>,
    options: QueryOptions = { lean: true }
)  {
    const updatedCategory = await CategoryModel.findOneAndUpdate(query, update, options);

    if (updatedCategory) {
        await ProductModel.updateMany(
            { 'category.id': updatedCategory._id },
            { $set: { 'category.name': updatedCategory.name, 'isAvailable': updatedCategory?.isAvailable  } },
        );
    }

    return updatedCategory;
}

export async function deleteCategory(
    query: FilterQuery<CategoryDocument>,
) {
    return CategoryModel.findOneAndDelete(query);
}
