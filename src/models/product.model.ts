import mongoose from "mongoose";

export interface Category {
    name: string;
    id: string;
}


export interface ProductDocument extends mongoose.Document {
    title: string,
    price: number,
    description: string,
    image: { path: string }[], // Update the type to reflect the new structure
    category: Category,
    isAvailable: boolean,
    createdAt: Date,
    updatedAt: Date,
}

const ProductSchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    image: [{ path: { type: String } }], // Update the image field to store an array of objects
    category: { 
        name: { type: String, required: true }, // Name of the category
        id: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true } // ObjectId reference for the category
    },
    isAvailable: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// Middleware to update updatedAt field before saving
ProductSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

const ProductModel = mongoose.model<ProductDocument>("Products", ProductSchema);

export default ProductModel;
