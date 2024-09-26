import { array, number, object, string, TypeOf } from "zod"

const payload = {
    body: object({
        name: string()
    })
}

export const createCategorySchema = object({
    ...payload
})

export type CreateOrderInput = TypeOf<typeof createCategorySchema>