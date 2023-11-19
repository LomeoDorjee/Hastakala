import * as z from 'zod'

export const TransferValidation = z.object({
    productid: z.number(),
    fromuserid: z.string(),
    touserid: z.string(),
    remarks: z.string().min(1).max(30),
    status: z.string().min(3).max(30)
})