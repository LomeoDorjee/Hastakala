import { prisma } from "@/lib/db/main_db"
import { catchErrorMessage } from "@/lib/utils"

export async function getAllTransfers() {

    try {
        const data: {
            productname: string
            fromuser: string
            touser: string
            status: string
            transferid: number
            productid: number
            fromuserid: string
            touserid: string
        }[] = await prisma.$queryRaw`SELECT 
        (SELECT PRODUCTNAME FROM PRODUCT WHERE PRODUCTID = T.PRODUCTID) productname,
        (SELECT USERNAME FROM "USER" WHERE USERID = T.FROMUSERID) fromuser,
        (SELECT USERNAME FROM "USER" WHERE USERID = T.TOUSERID) touser,
        T.*
        FROM TRANSFER T`

        return {
            data: data
        }

    } catch (e: unknown) {
        return {
            error: catchErrorMessage(e)
        }
    }



}