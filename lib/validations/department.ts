import * as z from 'zod'

export const DepartmentValidation = z.object({
    depname:
        z.string({
            required_error: "Name is required",
            invalid_type_error: "Name must be a string",
          })
            .min(5, { message: "Name: Must be 5 or more characters long" })
            .max(30, { message: "Name: Must be less than 10 characters" }),
    depid:
        z.number()
            .optional(),
    isactive:
        z.boolean()
} )