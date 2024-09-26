import { object, string, TypeOf } from "zod"

export const createUserSchema = object({
    body: object({
        name: string(),
        email: string(),
        password: string(),
        address: string(),
        number: string().min(10, "Enter a valid Phone number").max(13,"Enter a valid phone number"),
    })
})

export const getUserSchema = object({
    body: object({
        name: string(),
        email: string(),
        password: string(),
        address: string(),
        number: string().min(10, "Enter a valid Phone number").max(13,"Enter a valid phone number"),
    })
})

export type CreateUserInput = TypeOf<typeof createUserSchema>