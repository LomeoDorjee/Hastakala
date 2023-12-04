import MarksTable from "@/components/table/evaluation/MarksTable"
import { getUserDetail, sessionUser } from "@/lib/actions/config/user.actions"
import { getAllFiscalYears } from "@/lib/actions/performance/evaluation.actions"
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
            <h3 className="widgettitle">Evaluation Marks</h3>
            <MarksTable years={years.data} sessionUser={sessionUser.data[0]} />
        </>
    )

}