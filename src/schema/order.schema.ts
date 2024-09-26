import { array, number, object, string, TypeOf } from "zod"

const payload = {
    body: object({
        products: array(object({
            id: string(),
            quantity: number()
        })),
        amount: number(),
        paymentMode: string({
            required_error: "Payment mode is required"
        }),
        paymentId: string(),
        paymentStatus: string(),
        paymentResult: string(),
        orderStatus: string(),
    })
}

const updatePayload = {
    body: object({
        products: array(object({
            id: string(),
            quantity: number()
        })),
        amount: number(),
        paymentId: string(),
        paymentStatus: string(),
        paymentResult: string(),
        orderStatus: string(),
    })
}

const params = {
    params: object({
        orderId: string({
            required_error: "orderId is required"
        })
    })
}


export const createOrderSchema = object({
    ...payload
})

export const updateOrderSchema = object({
    ...updatePayload,
    ...params
})


export type CreateOrderInput = TypeOf<typeof createOrderSchema>
export type UpdateOrderInput = TypeOf<typeof updateOrderSchema>