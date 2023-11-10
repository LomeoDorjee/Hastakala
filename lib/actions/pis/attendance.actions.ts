"use server"
import { attprisma } from "@/lib/db/att_db"
import { pisprisma } from "@/lib/db/pis_db"
import { Convert24To12Hour } from "@/lib/utils"

interface staffKeyValue{
    [key: number]: string | null
}

export async function fetchDeviceLog(date: string) {
    
    try {
        const users = await pisprisma.sTAFF.findMany({
            select: {
                attendanceid: true,
                StaffName: true
            },
            where: {
                attendanceid: {
                    gt: 0,
                }
            }
        })

        let staffs: staffKeyValue = [];

        users.forEach(element => {
            if (element.attendanceid !== null) {
                staffs[element.attendanceid] = element.StaffName
            } 
        });

        const logs: {
            LOGID: number
            CODE: string
            CHECKTIME: string
            BADGENUMBER: number
        }[] = await attprisma.$queryRaw`
                    SELECT 
                        CASE SUBSTRING(U.BADGENUMBER,1,2) 
                        WHEN '10' THEN 'P1-'+SUBSTRING(U.BADGENUMBER,3,5) ELSE 'P2-'+SUBSTRING(U.BADGENUMBER,3,5) END CODE, 
                        C.CHECKTIME, C.LOGID,
                        U.BADGENUMBER
                    FROM CHECKINOUT C 
                    INNER JOIN USERINFO U ON U.USERID = C.USERID
                    WHERE CAST(C.CHECKTIME AS DATE) = ${date}`
        
        let data: {
            LOGID: number
            CODE: string
            CHECKTIME: string
            BADGENUMBER: number
            STAFF: string | null
            TIME: string
        }[] = []
        
        logs.forEach(e => {
            const time = new Date(e.CHECKTIME);
            let toPush =
                data.push({
                    ...e,
                    STAFF: staffs[e.BADGENUMBER], 
                    TIME: Convert24To12Hour(time.toISOString().substring(11, 19))
                });
        });

        return data
        
    } catch (error) {
        throw error
    }

}

export async function fetchStaffs() {
    
    try {
        const data = await pisprisma.sTAFF.findMany({
            select: {
                attendanceid: true,
                StaffName: true
            },
            where: {
                attendanceid: {
                    gt: 0,
                }
            }
        })

        let staffs: staffKeyValue = [];

        data.forEach(element => {
            if (element.attendanceid !== null) {
                staffs[element.attendanceid] = element.StaffName
            } 
        });
        return JSON.stringify(staffs)
    } catch (error) {
        throw error
    }

}