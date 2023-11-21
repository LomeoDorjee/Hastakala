"use server"
import { prisma } from "@/lib/db/main_db"
import { catchErrorMessage } from "@/lib/utils"
import { revalidatePath } from "next/cache"

export async function getAllTransfers() {

    try {
        const data: {
            transfermasterid: number
            productid: number
            productname: string
            productcode: string
            startbyuser: string
            startbyuserid: string
            startdate: string
            status: string
        }[] = await prisma.$queryRaw`SELECT 
        (SELECT PRODUCTNAME FROM PRODUCT WHERE PRODUCTID = T.PRODUCTID) productname,
        (SELECT PRODUCTCODE FROM PRODUCT WHERE PRODUCTID = T.PRODUCTID) productcode,
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


type TransferParams = {
    masterid: number
    fromuserid: string
    touserid: string
    remarks: string
}
export async function createUpdateIssue({
    masterid,
    fromuserid,
    touserid,
    remarks,
}: TransferParams) {

    try {

        const transferDate = new Date().toISOString().slice(0, 10);

        await prisma.$queryRaw`INSERT INTO TRANSFERDETAIL (TRANSFERMASTERID, TRANSFERDATE, FROMUSERID, TOUSERID, STATUS, REMARKS)
        VALUES (${masterid},${transferDate},${fromuserid},${touserid},'ISSUE',${remarks})`

        await prisma.$queryRaw`UPDATE TRANSFERMASTER SET STATUS = 'ISSUED' WHERE TRANSFERMASTERID = ${masterid}`

        revalidatePath(`/transfer/detail/${masterid}`)

        return {
            status: "success"
        }

    } catch (e: unknown) {
        return {
            error: catchErrorMessage(e)
        }
    }

}

export async function getTransferDetail(masterid: number) {

    try {

        const data: {
            transferdetailid: number
            transferdate: string
            fromuserid: string
            fromusername: string
            fromuserdep: string
            touserid: string
            tousername: string
            touserdep: string
            status: string
            remarks: string
        }[] = await prisma.$queryRaw`SELECT TD.*, 
        (SELECT USERNAME FROM "USER" WHERE USERID = TD.FROMUSERID) fromusername, 
        (SELECT 
            (SELECT DEPNAME FROM DEPARTMENT WHERE DEPID = UA.DEPID) 
        FROM "USER" UA WHERE USERID = TD.FROMUSERID) fromuserdep, 
        (SELECT USERNAME FROM "USER" WHERE USERID = TD.TOUSERID) tousername, 
        (SELECT 
            (SELECT DEPNAME FROM DEPARTMENT WHERE DEPID = UB.DEPID) 
        FROM "USER" UB WHERE USERID = TD.TOUSERID) touserdep
        FROM TRANSFERDETAIL TD
        WHERE TRANSFERMASTERID = ${masterid}
        ORDER BY TRANSFERDETAILID DESC`

        return {
            data: data
        }

    } catch (error: unknown) {
        return {
            error: catchErrorMessage(error)
        }
    }

}


export async function receiveProduct(detailid: number, masterid: number) {

    try {

        await prisma.$queryRaw`UPDATE TRANSFERDETAIL SET STATUS='RECEIVED' WHERE TRANSFERDETAILID = ${detailid}`

        await prisma.$queryRaw`UPDATE TRANSFERMASTER SET STATUS='RECEIVED' WHERE TRANSFERMASTERID = ${masterid}`

        revalidatePath(`/transfer/detail/${masterid}`)

    } catch (error: unknown) {
        return {
            error: catchErrorMessage(error)
        }
    }

}