import { array, boolean, number, object, string, TypeOf } from "zod";

// Define the structure for the image object
const imageSchema = object({
    path: string({
        required_error: "Image path is required"
    })
});

const categorySchema = object({
    name: string({
        required_error: "Category name is required"
    }),
    id: string({
        required_error: "Category ID is required"
    })
});
// Define the payload schema for product creation/updating
const payload = {
    body: object({
        title: string({
            required_error: "Title is required"
        }),
        price: number({
            required_error: "Price is required"
        }),
        description: string({
            required_error: "Description is required"
        }),
        image: array(imageSchema, {
            required_error: "Image is required"
        }),
        category: categorySchema,
        isAvailable: boolean({
            required_error: "isAvailable is required"
        })
    })
};

// Define the params schema for product ID
const params = {
    params: object({
        productId: string({
            required_error: "productId is required"
        })
    })
};

const stockUpdate = {
    params: object({
        isAvailable: boolean({
            required_error: "isAvailable is required"
        })
    })
};

// Create schemas for various operations
export const createProductSchema = object({
    ...payload
});

export const updateProductSchema = object({
    ...payload,
    ...params
});

export const updateStockSchema = object({
    ...stockUpdate,
    ...params
});

export const deleteProductSchema = object({
    ...params
});

export const getProductSchema = object({
    ...params
});

// Define TypeScript types for the schemas
export type CreateProductInput = TypeOf<typeof createProductSchema>;
export type UpdateProductInput = TypeOf<typeof updateProductSchema>;
export type DeleteProductInput = TypeOf<typeof deleteProductSchema>;
export type GetProductInput = TypeOf<typeof getProductSchema>;
