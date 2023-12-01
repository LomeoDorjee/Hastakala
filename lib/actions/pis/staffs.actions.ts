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

export async function getStaffDetail(staffid: number) {

    try {
        const data: {
            STAFFID: number,
            STAFFNAME: string,
            STAFFCODE: string,
            DEPARTMENT: string,
            DESIGNATION: string
            GENDER: string
            ISSUPPORT: boolean
        }[] = await pisprisma.$queryRaw`SELECT S.STAFFNAME, S.STAFFCODE, S.STAFFID, S.GENDER, S.ISSUPPORT,
		(SELECT DEPARTMENTNAME FROM PISDEPARTMENT WHERE DEPARTMENTID = S.DEPARTMENTID)DEPARTMENT, 
		(SELECT POSITIONNAME FROM STAFFPOSITION  WHERE POSITIONID = S.POSITIONID) DESIGNATION
		FROM STAFF S
        WHERE STAFFID = ${staffid}`

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

export async function updateSupportStaff(isSupport: boolean, staffid: number) {

    try {
        await pisprisma.$queryRaw`UPDATE STAFF SET ISSUPPORT=${isSupport} WHERE STAFFID=${staffid}`
        return {
            status: "Is Support Staff Updated"
        }
    } catch (e) {
        return {
            status: catchErrorMessage(e)
        }
    }

}