import * as z from 'zod'

export const ProductValidation = z.object({
    productid:
        z.number()
            .optional(),
    productcode:
        z.string({
            required_error: "Name is required",
            invalid_type_error: "Name must be a string",
        })
            .min(2, { message: "Name: Must be 5 or more characters long" })
            .max(30, { message: "Name: Must be less than 10 characters" }),
    productname:
        z.string({
            required_error: "Name is required",
            invalid_type_error: "Name must be a string",
        })
            .min(5, { message: "Name: Must be 5 or more characters long" })
            .max(30, { message: "Name: Must be less than 10 characters" }),
    isactive:
        z.boolean(),
})