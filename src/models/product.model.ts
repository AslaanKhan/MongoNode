import mongoose from "mongoose";

export interface ProductDocument extends mongoose.Document {
    title: string,
    price: number,
    description: string,
    image: string[],
    category: string[],
    isAvailable: boolean,
    createdAt: Date,
    updatedAt: Date,
}

const ProductSchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: [String] },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "categories", required: true },
    isAvailable: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
})

const ProductModel = mongoose.model("Products", ProductSchema);

export default ProductModel