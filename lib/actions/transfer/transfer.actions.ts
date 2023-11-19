"use server"
import { prisma } from "@/lib/db/main_db"
import { catchErrorMessage } from "@/lib/utils"

export async function getAllTransfers() {

    try {
        const data: {
            transfermasterid: number
            productid: number
            productname: string
            startbyuser: string
            startbyuserid: string
            startdate: string
            status: string
        }[] = await prisma.$queryRaw`SELECT 
        (SELECT PRODUCTNAME FROM PRODUCT WHERE PRODUCTID = T.PRODUCTID) productname,
        (SELECT USERNAME FROM "USER" WHERE USERID = T.STARTBYUSERID) startbyuser,
        T.*
        FROM TRANSFERMASTER T`

        return {
            data: data
        }

    } catch (e: unknown) {
        return {
            error: catchErrorMessage(e)
        }
    }

}

type TransferProps = {
    productid: number
    fromuserid: string
    touserid: string
    remarks: string
    status: string
}

export async function createNewTransfer({
    productid,
    fromuserid,
    touserid,
    remarks,
    status
}: TransferProps) {

    try {

        const startDate = new Date().toISOString().slice(0, 10);

        await prisma.$queryRaw`INSERT INTO TRANSFERMASTER (PRODUCTID, STARTDATE, STARTBYUSERID, STATUS)
        VALUES (${productid},${startDate},${fromuserid},${status})`

        const master: {
            TRANSFERMASTERID: number
        }[] = await prisma.$queryRaw`SELECT TOP(1) TRANSFERMASTERID FROM TRANSFERMASTER WHERE 
        PRODUCTID = ${productid} AND STARTDATE = ${startDate} AND STARTBYUSERID = ${fromuserid} 
        ORDER BY TRANSFERMASTERID DESC`

        const masterid = master[0].TRANSFERMASTERID;

        await prisma.$queryRaw`INSERT INTO TRANSFERDETAIL 
            (TRANSFERMASTERID, TRANSFERDATE, FROMUSERID, TOUSERID, STATUS, REMARKS )
            VALUES (${masterid},${startDate},${fromuserid},${touserid},${status},${remarks})`

        return {
            status: "success"
        }

    } catch (e: unknown) {
        return {
            error: catchErrorMessage(e)
        }
    }

}