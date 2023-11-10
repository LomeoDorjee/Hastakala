"use server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/db/main_db";
import { DepartmentValidation } from "@/lib/validations/department";
import { catchErrorMessage } from "@/lib/utils";

export async function getAllDepartment() {
    try {
        
        const data = await prisma.department.findMany({
            // orderBy: {
            //     depname: "asc"
            // },
        })

        return {
            data: data
        }

    } catch (e) {
        return {
            error: catchErrorMessage(e)
        }
    }
}

export async function createDepartment(depData: unknown) {
    
    try {
        const zod = DepartmentValidation.safeParse(depData)
        if (!zod.success) {
                
            let errorMessage = "";

            zod.error.issues.forEach((issue) => {
                errorMessage = errorMessage +"["+ issue.path[0] + "]: " + issue.message + "."
            })
            return {
                error: errorMessage
            };
        }
        if (zod.data.depid && zod.data.depid > 0) {
            await prisma.$queryRaw`UPDATE DEPARTMENT SET DEPNAME = ${zod.data.depname}, ISACTIVE = ${zod.data.isactive} WHERE DEPID = ${zod.data.depid}`
        } else {
            await prisma.$queryRaw`INSERT INTO DEPARTMENT (DEPNAME, ISACTIVE) VALUES(${zod.data.depname},${zod.data.isactive})`
        }

        revalidatePath("/config/department")
        return 
        
    } catch (e: unknown) {
        console.log(e)
        return {
            error: catchErrorMessage(e)
        }
    }
}

export async function deleteDepartment(depid: number) {
    
    try {
        
        await prisma.$queryRaw`DELETE FROM DEPARTMENT WHERE DEPID = ${depid}`

        revalidatePath("/config/department")
        return 
        
    } catch (e: unknown) {
        console.log(e)
        return {
            error: catchErrorMessage(e)
        }
    }
}
