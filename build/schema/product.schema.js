"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductSchema = exports.deleteProductSchema = exports.updateStockSchema = exports.updateProductSchema = exports.createProductSchema = void 0;
const zod_1 = require("zod");
// Define the structure for the image object
const imageSchema = (0, zod_1.object)({
    path: (0, zod_1.string)({
        required_error: "Image path is required"
    })
});
const categorySchema = (0, zod_1.object)({
    name: (0, zod_1.string)({
        required_error: "Category name is required"
    }),
    id: (0, zod_1.string)({
        required_error: "Category ID is required"
    })
});
// Define the payload schema for product creation/updating
const payload = {
    body: (0, zod_1.object)({
        title: (0, zod_1.string)({
            required_error: "Title is required"
        }),
        price: (0, zod_1.number)({
            required_error: "Price is required"
        }),
        description: (0, zod_1.string)({
            required_error: "Description is required"
        }),
        image: (0, zod_1.array)(imageSchema, {
            required_error: "Image is required"
        }),
        category: categorySchema,
        isAvailable: (0, zod_1.boolean)({
            required_error: "isAvailable is required"
        })
    })
};
// Define the params schema for product ID
const params = {
    params: (0, zod_1.object)({
        productId: (0, zod_1.string)({
            required_error: "productId is required"
        })
    })
};
const stockUpdate = {
    params: (0, zod_1.object)({
        isAvailable: (0, zod_1.boolean)({
            required_error: "isAvailable is required"
        })
    })
};
// Create schemas for various operations
exports.createProductSchema = (0, zod_1.object)({
    ...payload
});
exports.updateProductSchema = (0, zod_1.object)({
    ...payload,
    ...params
});
exports.updateStockSchema = (0, zod_1.object)({
    ...stockUpdate,
    ...params
});
exports.deleteProductSchema = (0, zod_1.object)({
    ...params
});
exports.getProductSchema = (0, zod_1.object)({
    ...params
});
