"use server"
import { attprisma } from "@/lib/db/att_db"
import { pisprisma } from "@/lib/db/pis_db"
import { catchErrorMessage } from "@/lib/utils"

export async function getAllStaffs() {

    try {
        const data: {
            STAFFID: number,
            STAFFNAME: string,
            STAFFCODE: string,
            DEPARTMENT: string,
            DESIGNATION: string
            GENDER: string
        }[] = await pisprisma.$queryRaw`SELECT S.STAFFNAME, S.STAFFCODE, S.STAFFID, S.GENDER,
		(SELECT DEPARTMENTNAME FROM PISDEPARTMENT WHERE DEPARTMENTID = S.DEPARTMENTID)DEPARTMENT, 
		(SELECT POSITIONNAME FROM STAFFPOSITION  WHERE POSITIONID = S.POSITIONID) DESIGNATION
		FROM STAFF S
        WHERE JOBSTATUSID = 1 `

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