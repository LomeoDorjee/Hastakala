import * as z from 'zod'

export const MarksValidation = z.object({
    staffid: z.number(),
    fyearid: z.number(),
    hod_q1: z.number().lte(10).nonnegative(),
    hod_q2: z.number().lte(10).nonnegative(),
    hod_q3: z.number().lte(10).nonnegative(),
    hod_q4: z.number().lte(10).nonnegative(),
    hod_q5: z.number().lte(10).nonnegative(),
    hod_q6: z.number().lte(10).nonnegative(),
    hod_q7: z.number().lte(10).nonnegative(),
    hod_q8: z.number().lte(10).nonnegative(),
    hod_q9: z.number().lte(10).nonnegative(),
    hod_q10: z.number().lte(10).nonnegative(),
    sup_q1: z.number().lte(5).nonnegative(),
    sup_q2: z.number().lte(5).nonnegative(),
    sup_q3: z.number().lte(5).nonnegative(),
    sup_q4: z.number().lte(5).nonnegative(),
    sup_q5: z.number().lte(5).nonnegative()
})

export const AppraisalValidation = z.object({
    staffid: z.number(),
    fyearid: z.number(),
})