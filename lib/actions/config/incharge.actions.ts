"use server"
import { pisprisma } from "@/lib/db/pis_db";
import { catchErrorMessage } from "@/lib/utils";
import { InchargeValidation } from "@/lib/validations/incharge";
import { revalidatePath } from "next/cache"

export async function getAllIncharges() {
    try {

        const record: {
            UNDERID: number
            STAFFID: number
            STAFFNAME: string
            STAFFDEPARTMENT: string
            INCHARGE: string
        }[] = await pisprisma.$queryRaw`SELECT I.*, 
                (
                    SELECT STAFFNAME FROM STAFF 
                    WHERE STAFFID = I.UNDERID
                ) INCHARGE, 
                (
                    SELECT STAFFNAME FROM STAFF 
                    WHERE STAFFID = I.STAFFID
                ) STAFFNAME,
                (
                    SELECT (
                        SELECT DEPARTMENTNAME 
                        FROM PISDEPARTMENT
                        WHERE DEPARTMENTID = S.DEPARTMENTID
                    ) FROM STAFF S
                    WHERE S.STAFFID = I.STAFFID
                ) STAFFDEPARTMENT
                FROM PE_INCHARGE I ORDER BY UNDERID `

        let data: {
            [key: number]: {
                INCHARGEID: number
                INCHARGENAME: string
                STAFFS: {
                    STAFFID: number
                    STAFFNAME: string
                    DEPARTMENT: string
                }[]
            }
        } = []

        record.forEach(rec => {
            if (data[rec.UNDERID]) {
                data[rec.UNDERID]["STAFFS"].push({
                    STAFFID: rec.STAFFID,
                    STAFFNAME: rec.STAFFNAME,
                    DEPARTMENT: rec.STAFFDEPARTMENT
                })
            } else {
                data[rec.UNDERID] = {
                    INCHARGEID: rec.UNDERID,
                    INCHARGENAME: rec.INCHARGE,
                    STAFFS: []
                }
                data[rec.UNDERID].STAFFS.push({
                    STAFFID: rec.STAFFID,
                    STAFFNAME: rec.STAFFNAME,
                    DEPARTMENT: rec.STAFFDEPARTMENT
                })
            }
        })

        return {
            data: Object.values(data),
            error: ""
        }

    } catch (e) {
        return {
            data: [],
            error: catchErrorMessage(e)
        }
    }
}

export async function createUpdateIncharge(formData: unknown) {

    try {
        const zod = InchargeValidation.safeParse(formData)
        if (!zod.success) {

            let errorMessage = "";

            zod.error.issues.forEach((issue) => {
                errorMessage = errorMessage + "[" + issue.path[0] + "]: " + issue.message + "."
            })
            return {
                error: errorMessage
            };
        }

        await pisprisma.$queryRaw`MERGE PE_INCHARGE AS tgt  
            USING (
                SELECT ${zod.data.inchargeid}, ${zod.data.staffid}
            ) AS SRC (UNDERID, STAFFID)  
            ON (TGT.STAFFID = SRC.STAFFID AND TGT.UNDERID = SRC.UNDERID)
            WHEN NOT MATCHED THEN   
                INSERT (UNDERID, STAFFID) 
                VALUES (SRC.UNDERID, SRC.STAFFID);`

        revalidatePath("/config/incharge")
        return

    } catch (error) {
        return {
            data: [],
            error: catchErrorMessage(error)
        }
    }

}


export async function removeIncharge(formData: unknown) {

    try {
        const zod = InchargeValidation.safeParse(formData)
        if (!zod.success) {

            let errorMessage = "";

            zod.error.issues.forEach((issue) => {
                errorMessage = errorMessage + "[" + issue.path[0] + "]: " + issue.message + "."
            })
            return {
                error: errorMessage
            };
        }

        await pisprisma.$queryRaw`DELETE FROM PE_INCHARGE 
            WHERE STAFFID = ${zod.data.staffid} 
            AND UNDERID = ${zod.data.inchargeid}`

        revalidatePath("/config/incharge")
        return

    } catch (error) {
        return {
            data: [],
            error: catchErrorMessage(error)
        }
    }

}