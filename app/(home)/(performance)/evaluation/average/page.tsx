import AverageTable from "@/components/table/evaluation/AverageTable"
import { getAllFiscalYears } from "@/lib/actions/performance/evaluation.actions"
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

export default async function Page() {

    const years: YEARS = await getAllFiscalYears()

    const currentuser = await currentUser()
    if (!currentuser) redirect("/")

    const sessionUser: {
        data: sessionUser[]
        error: string
    } = await getUserDetail(currentuser.id, 1)

    return (
        <>
            <h3 className="widgettitle">Performance Average</h3>
            <AverageTable years={years.data} sessionUser={sessionUser.data[0]} />
        </>
    )
}