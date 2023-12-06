"use server"
import { revalidatePath } from "next/cache"
import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/db/main_db"
import { catchErrorMessage } from "@/lib/utils"
import { existsSync } from "fs"
import fs from "fs/promises"

import path from "path"
import { ProductValidation } from "@/lib/validations/product"
import { currentUser } from "@clerk/nextjs"

export async function getAllProducts(isactive = false) {

    try {

        const data: {
            productid: number
            productcode: string
            productname: string
            isactive: boolean
            imgpath: string
        }[] = await prisma.$queryRaw`SELECT P.*, (SELECT TOP(1) "PATH" FROM IMAGES WHERE p.productid = masterid AND TYPE = 'PRODUCT' ORDER BY ID DESC ) imgpath FROM PRODUCT P ${isactive ? Prisma.sql` WHERE ISACTIVE = 1` : Prisma.empty}`

        return {
            data: data,
            error: ""
        }

    } catch (e: unknown) {
        return {
            data: [],
            error: catchErrorMessage(e)
        }
    }
}


export async function createUpdateProduct(proData: unknown) {

    try {

        const user = await currentUser()

        const zod = ProductValidation.safeParse(proData)
        if (!zod.success) {

            let errorMessage = "";

            zod.error.issues.forEach((issue) => {
                errorMessage = errorMessage + "[" + issue.path[0] + "]: " + issue.message + "."
            })
            return {
                error: errorMessage
            };
        }
        if (zod.data.productid && zod.data.productid > 0) {
            await prisma.$queryRaw`UPDATE PRODUCT SET PRODUCTCODE = ${zod.data.productcode}, ISACTIVE = ${zod.data.isactive}, PRODUCTNAME = ${zod.data.productname} WHERE PRODUCTID = ${zod.data.productid}`
        } else {
            await prisma.$queryRaw`INSERT INTO PRODUCT (PRODUCTCODE, PRODUCTNAME, ISACTIVE, CREATEDBY) VALUES(${zod.data.productcode},${zod.data.productname},${zod.data.isactive},${user?.id})`
        }

        revalidatePath("/config/product")

        return {
            status: "success"
        }

    } catch (e: unknown) {
        return {
            error: catchErrorMessage(e)
        }
    }
}

export async function uploadProductImage(formData: FormData) {

    try {

        const file = formData.get("image") as unknown as File
        const productid = formData.get("productid") as unknown as number

        if (!file) return {
            error: "No File Found"
        }

        if (!process.env.PRODUCT_IMG_UPLOAD_PATH) return {
            error: "Image Path Not Set"
        }

        const UPLOAD_PATH = path.join(process.cwd(), "/public" + process.env.PRODUCT_IMG_UPLOAD_PATH)

        const fileName = Date.now().toString() + "_" + file.name

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes)

        if (!existsSync(UPLOAD_PATH)) {
            await fs.mkdir(UPLOAD_PATH, { recursive: true })
        }

        const acutalPath = path.join(UPLOAD_PATH, fileName)
        const savePath = process.env.PRODUCT_IMG_UPLOAD_PATH + '/' + fileName
        await fs.writeFile(acutalPath, buffer)

        await prisma.$queryRaw`INSERT INTO IMAGES (MASTERID, PATH, TYPE) VALUES (${productid},${savePath}, 'PRODUCT')`

        revalidatePath(`/config/product/upload/${productid}`)

        return {
            status: "success"
        }

    } catch (e: unknown) {
        return {
            error: catchErrorMessage(e)
        }
    }
}

export async function getProductImages(productid: number) {

    try {

        console.log("---------" + productid)
        const images: {
            masterid: number
            path: string
        }[] = await prisma.$queryRaw`SELECT * FROM IMAGES WHERE TYPE='PRODUCT' AND MASTERID = ${productid}`

        return {
            data: images
        }

    } catch (error: unknown) {
        return {
            error: catchErrorMessage(error)
        }
    }
}
