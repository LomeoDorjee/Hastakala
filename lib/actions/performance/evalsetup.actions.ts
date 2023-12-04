"use server"
import { pisprisma } from "@/lib/db/pis_db"
import { catchErrorMessage } from "@/lib/utils"
import { Prisma } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { sessionUser } from "../config/user.actions"


export async function updateWeight(sup_weight: number, hod_weight: number) {

    try {

        await pisprisma.$queryRaw`UPDATE PE_WEIGHT SET HOD_WEIGHT = ${hod_weight}, SUP_WEIGHT=${sup_weight} WHERE 1 = 1`

        return {
            status: "Weight Updated",
            error: ""
        }

    } catch (error: unknown) {
        return {
            status: "",
            error: catchErrorMessage(error)
        }
    }

}


export async function getWeights() {

    try {

        const data: {
            HOD_WEIGHT: number
            SUP_WEIGHT: number
        }[] = await pisprisma.$queryRaw`SELECT * FROM PE_WEIGHT`

        return {
            data: data,
            error: ""
        }

    } catch (error: unknown) {
        return {
            data: [],
            error: catchErrorMessage(error)
        }
    }

}
