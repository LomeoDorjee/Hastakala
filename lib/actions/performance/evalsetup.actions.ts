"use server"
import { pisprisma } from "@/lib/db/pis_db"
import { catchErrorMessage } from "@/lib/utils"
import { revalidatePath } from "next/cache"


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



export async function updateCriterias(formData: FormData) {

    try {

        await pisprisma.$queryRaw`UPDATE PE_CRITERIAS SET CVALUE = ${formData.get("1")} WHERE CRITERIAID = 1`
        await pisprisma.$queryRaw`UPDATE PE_CRITERIAS SET CVALUE = ${formData.get("2")} WHERE CRITERIAID = 2`
        await pisprisma.$queryRaw`UPDATE PE_CRITERIAS SET CVALUE = ${formData.get("3")} WHERE CRITERIAID = 3`
        await pisprisma.$queryRaw`UPDATE PE_CRITERIAS SET CVALUE = ${formData.get("4")} WHERE CRITERIAID = 4`
        await pisprisma.$queryRaw`UPDATE PE_CRITERIAS SET CVALUE = ${formData.get("5")} WHERE CRITERIAID = 5`
        await pisprisma.$queryRaw`UPDATE PE_CRITERIAS SET CVALUE = ${formData.get("6")} WHERE CRITERIAID = 6`
        await pisprisma.$queryRaw`UPDATE PE_CRITERIAS SET CVALUE = ${formData.get("7")} WHERE CRITERIAID = 7`
        await pisprisma.$queryRaw`UPDATE PE_CRITERIAS SET CVALUE = ${formData.get("8")} WHERE CRITERIAID = 8`
        await pisprisma.$queryRaw`UPDATE PE_CRITERIAS SET CVALUE = ${formData.get("9")} WHERE CRITERIAID = 9`
        await pisprisma.$queryRaw`UPDATE PE_CRITERIAS SET CVALUE = ${formData.get("10")} WHERE CRITERIAID = 10`
        await pisprisma.$queryRaw`UPDATE PE_CRITERIAS SET CVALUE = ${formData.get("11")} WHERE CRITERIAID = 11`

        revalidatePath("/evaluation/setup/criterias")

        return {
            error: ""
        }

    } catch (error: unknown) {
        return {
            error: catchErrorMessage(error)
        }
    }

}


export async function getEligibilities() {

    try {
        const data: {
            ELIGIBLEID: number
            ETYPE: string
            VALUE: number
        }[] = await pisprisma.$queryRaw`SELECT * FROM PE_ELIGIBILITY`

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

export async function updateEligibilities(formData: FormData) {

    try {

        await pisprisma.$queryRaw`UPDATE PE_ELIGIBILITY SET VALUE = ${formData.get("1")} WHERE ELIGIBLEID = 1`
        await pisprisma.$queryRaw`UPDATE PE_ELIGIBILITY SET VALUE = ${formData.get("2")} WHERE ELIGIBLEID = 2`

        revalidatePath("/evaluation/setup/eligibility")

        return {
            error: ""
        }

    } catch (error: unknown) {
        return {
            error: catchErrorMessage(error)
        }
    }

}