import mongoose from "mongoose";

export interface Category {
    name: string;
    id: string;
}

export interface ProductDocument extends mongoose.Document {
    title: string; // Default language (e.g., English)
    price: number;
    description: string; // Default language (e.g., English)
    image: { path: string }[];
    category: Category;
    isAvailable: boolean;
    createdAt: Date;
    updatedAt: Date;
    offers?: mongoose.Schema.Types.ObjectId[];
    translations: {
        hi?: {
            title: string;
            description: string;
        };
    };
}

const ProductSchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    image: [{ path: { type: String } }],
    category: {
        name: { type: String, required: true },
        id: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    },
    isAvailable: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    offers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Offers" }], // Store references to offers

    translations: {
        hi: {
            title: { type: String, required: false },  // Optional field for Hindi title
            description: { type: String, required: false },  // Optional field for Hindi description
        },
        en: {
            title: { type: String, required: false },  // Optional field for English title
            description: { type: String, required: false },  // Optional field for English description
        },
    },
});

// Middleware to update updatedAt field before saving
ProductSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

const ProductModel = mongoose.model<ProductDocument>("Products", ProductSchema);

export default ProductModel;
