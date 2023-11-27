"use server"
import { attprisma } from "@/lib/db/att_db"
import { pisprisma } from "@/lib/db/pis_db"
import { catchErrorMessage } from "@/lib/utils"
import { MarksValidation } from "@/lib/validations/evaluation"
import { revalidatePath } from "next/cache"

export async function getAllMarks(fyearid: number) {

    try {
        const data: {
            MARKSID: number,
            STAFFID: number,
            STAFFNAME: string
            STAFFCODE: string
            FYEARID: number,
            FYEAR: string
            HOD_Q1: number,
            HOD_Q2: number,
            HOD_Q3: number,
            HOD_Q4: number,
            HOD_Q5: number,
            HOD_Q6: number,
            HOD_Q7: number,
            HOD_Q8: number,
            HOD_Q9: number,
            HOD_Q10: number,
            TOTAL_HOD: number,
            SUP_Q1: number,
            SUP_Q2: number,
            SUP_Q3: number,
            SUP_Q4: number,
            SUP_Q5: number,
            TOTAL_SUP: number,
        }[] = await pisprisma.$queryRaw`SELECT S.STAFFNAME, S.STAFFCODE, M.*, S.STAFFID,
		(SELECT FYEAR FROM ENG_FYEAR_PIS WHERE FYEARID = M.FYEARID) FYEAR
		FROM STAFF S LEFT JOIN PE_MARKS M ON M.STAFFID = S.STAFFID 
        WHERE JOBSTATUSID = 1 AND ( M.FYEARID = ${fyearid} OR M.FYEARID IS NULL ) `

        return {
            data: data,
            error: ""
        }

    } catch (error) {
        return {
            data: [],
            error: catchErrorMessage(error)
        }
    }

}


export async function getAllFiscalYears() {

    try {
        const data: {
            FYEARID: number,
            FYEAR: string
        }[] = await pisprisma.$queryRaw`SELECT * FROM ENG_FYEAR_PIS ORDER BY FYEARID DESC`

        return {
            data: data,
            error: ""
        }

    } catch (error) {
        return {
            data: [],
            error: catchErrorMessage(error)
        }
    }

}


export async function createUpdateMarks(marksData: unknown) {

    try {
        const zod = MarksValidation.safeParse(marksData)
        if (!zod.success) {

            let errorMessage = "";

            zod.error.issues.forEach((issue) => {
                errorMessage = errorMessage + "[" + issue.path[0] + "]: " + issue.message + "."
            })
            return {
                error: errorMessage
            };
        }

        const exist: {
            MARKSID: number
        }[] = await pisprisma.$queryRaw`SELECT MARKSID FROM PE_MARKS WHERE FYEARID = ${zod.data.fyearid} AND STAFFID=${zod.data.staffid}`

        const hod_tot = zod.data.hod_q1 + zod.data.hod_q2 + zod.data.hod_q3 + zod.data.hod_q4 + zod.data.hod_q5 +
            zod.data.hod_q6 + zod.data.hod_q7 + zod.data.hod_q8 + zod.data.hod_q9 + zod.data.hod_q10

        const sup_tot = zod.data.sup_q1 + zod.data.sup_q2 + zod.data.sup_q3 + zod.data.sup_q4 + zod.data.sup_q5

        console.log(exist)

        if (exist && exist[0]) {
            await pisprisma.$queryRaw`UPDATE PE_MARKS 
                    SET
                        STAFFID = ${zod.data.staffid},
                        FYEARID = ${zod.data.fyearid},
                        HOD_Q1 = ${zod.data.hod_q1},
                        HOD_Q2 = ${zod.data.hod_q2},
                        HOD_Q3 = ${zod.data.hod_q3},
                        HOD_Q4 = ${zod.data.hod_q4},
                        HOD_Q5 = ${zod.data.hod_q5},
                        HOD_Q6 = ${zod.data.hod_q6},
                        HOD_Q7 = ${zod.data.hod_q7},
                        HOD_Q8 = ${zod.data.hod_q8},
                        HOD_Q9 = ${zod.data.hod_q9},
                        HOD_Q10 = ${zod.data.hod_q10},
                        TOTAL_HOD = ${hod_tot},
                        SUP_Q1 = ${zod.data.sup_q1},
                        SUP_Q2 = ${zod.data.sup_q2},
                        SUP_Q3 = ${zod.data.sup_q3},
                        SUP_Q4 = ${zod.data.sup_q4},
                        SUP_Q5 = ${zod.data.sup_q5},
                        TOTAL_SUP = ${sup_tot}
                    WHERE MARKSID = ${exist[0].MARKSID}`
        } else {
            await pisprisma.$queryRaw`INSERT INTO PE_MARKS 
                    (
                        STAFFID,FYEARID,HOD_Q1,HOD_Q2,HOD_Q3,HOD_Q4,HOD_Q5,HOD_Q6,HOD_Q7,HOD_Q8,
                        HOD_Q9,HOD_Q10,TOTAL_HOD,SUP_Q1,SUP_Q2,SUP_Q3,SUP_Q4,SUP_Q5,TOTAL_SUP                    
                    )
                    VALUES(
                        ${zod.data.staffid},${zod.data.fyearid},${zod.data.hod_q1},${zod.data.hod_q2},
                        ${zod.data.hod_q3},${zod.data.hod_q4},${zod.data.hod_q5},${zod.data.hod_q6},
                        ${zod.data.hod_q7},${zod.data.hod_q8},${zod.data.hod_q9},${zod.data.hod_q10}, 
                        ${hod_tot},
                        ${zod.data.sup_q1},${zod.data.sup_q2},${zod.data.sup_q3},${zod.data.sup_q4},${zod.data.sup_q5},
                        ${sup_tot}
                    )`
        }

        revalidatePath("/evaluation/marks")
        return

    } catch (error) {
        return {
            data: [],
            error: catchErrorMessage(error)
        }
    }

}

