import { array, boolean, object, string, TypeOf } from "zod"


const payload = {
    body: object({
        title: string({
            required_error: "Title is required"
        }),
        price: string({
            required_error: "Price is required"
        }),
        description: string({
            required_error: "Description is required"
        }),
        image: array(string(),{
            required_error: "Image is required"
        }),
        category: array(string(),{
            required_error: "Category is required"
        }),
        isAvailable: boolean({
            required_error: "isAvailable is required"
        })
    })
}

const params = {
    params: object({
        productId: string({
            required_error: "productId is required"
        })
    })
}

export const createProductSchema = object({
    ...payload
})

export const updateProductSchema = object({
    ...payload,
    ...params
})

export const deleteProductSchema = object({
    ...params
})

export const getProductSchema = object({
    ...params
})

export type CreateProductInput = TypeOf<typeof createProductSchema>
export type UpdateProductInput = TypeOf<typeof updateProductSchema>
export type DeleteProductInput = TypeOf<typeof deleteProductSchema>
export type GetProductInput = TypeOf<typeof getProductSchema>