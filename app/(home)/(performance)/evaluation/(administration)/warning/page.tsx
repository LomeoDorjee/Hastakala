import WarningTable from "@/components/table/evaluation/WarningTable"
import { getAllFiscalYears, getCriterias } from "@/lib/actions/performance/evaluation.actions"
import { getUserDetail, sessionUser } from "@/lib/actions/config/user.actions"
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"

type YEARS = {
    data: {
        FYEARID: number
        FYEAR: string
    }[]
    error: string
}

type CRITERIA = {
    data: {
        CNAME: string
        CVALUE: number
    }[]
    error: string
}

export default async function Page() {

    const years: YEARS = await getAllFiscalYears()

    const criterias: CRITERIA = await getCriterias("WARNING")

    const currentuser = await currentUser()
    if (!currentuser) redirect("/")

    const sessionUser: {
        data: sessionUser[]
        error: string
    } = await getUserDetail(currentuser.id, 1)

    return (
        <>
            <h3 className="widgettitle">Warning Record</h3>
            <WarningTable years={years.data} criterias={criterias.data} sessionUser={sessionUser.data[0]} />
        </>
    )

}