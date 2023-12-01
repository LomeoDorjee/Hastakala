import * as z from 'zod'

export const InchargeValidation = z.object({
    staffid: z.number(),
    inchargeid: z.number(),
})