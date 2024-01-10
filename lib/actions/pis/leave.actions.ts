"use server"
import { attprisma } from "@/lib/db/att_db"
import { pisprisma } from "@/lib/db/pis_db"
import { catchErrorMessage } from "@/lib/utils"


export type IGNOREDDELAY = {
    YearMonth: string
    Minutes: string
    IDateAD: string
    IDateVS: string
    StaffID: number
    STAFFNAME: string
    STAFFCODE: string
}

export type IGNOREDDELAY_YM = {
    YEARMONTH: string
}


export async function getIgnoredDelayYearMonths() {

    try {

        const data: IGNOREDDELAY_YM[] = await pisprisma.$queryRaw`SELECT DISTINCT TOP 12 YEARMONTH  AS YEARMONTH FROM IGNOREDDELAY ORDER BY YEARMONTH DESC`

        return {
            data: data,
            status: ""
        }

    } catch (e: unknown) {
        return {
            data: [],
            status: catchErrorMessage(e)
        }
    }
}

export async function getIgnoredDelayStaffs(yearmonth: string) {

    try {

        const data: IGNOREDDELAY[] = await pisprisma.$queryRaw`SELECT ID.*, (SELECT STAFFNAME FROM STAFF WHERE STAFFID = ID.STAFFID) STAFFNAME, (SELECT STAFFCODE FROM STAFF WHERE STAFFID = ID.STAFFID) STAFFCODE FROM IGNOREDDELAY ID WHERE YEARMONTH = ${yearmonth} ORDER BY STAFFID`

        return {
            data: data,
            status: ""
        }

    } catch (e: unknown) {
        return {
            data: [],
            status: catchErrorMessage(e)
        }
    }
}

export async function removeIgnoredDelay(staffid: number, yearmonth: string) {

    try {

        const data: IGNOREDDELAY[] = await pisprisma.$queryRaw`DELETE FROM IGNOREDDELAY WHERE YEARMONTH = ${yearmonth} AND STAFFID = ${staffid}`

        return {
            status: ""
        }

    } catch (e: unknown) {
        return {
            status: catchErrorMessage(e)
        }
    }
}

