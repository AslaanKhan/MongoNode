import mongoose from "mongoose";
import { ProductDocument } from "./product.model";

export interface CategoryDocument extends mongoose.Document {
    name: string;   
    createdAt: Date;
    updatedAt: Date;
}

const CategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true, // Automatically trims whitespace
        },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    {
        timestamps: true,
    }
);

const CategoryModel = mongoose.model<CategoryDocument>("Category", CategorySchema);

export default CategoryModel;
