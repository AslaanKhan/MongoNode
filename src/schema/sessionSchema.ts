import { object, string } from "zod";

export const createSessionSchema = object({
  body: object({
    number: string({
      required_error: "Password is required",
    }),
  }),
});