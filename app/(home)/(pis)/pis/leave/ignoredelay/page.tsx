import IgnoredDelayTable from "@/components/table/IgnoredDelayTable"
import { IGNOREDDELAY_YM, getIgnoredDelayYearMonths } from "@/lib/actions/pis/leave.actions"
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"

type STAFF = {
    STAFFID: number,
    STAFFNAME: string,
    STAFFCODE: string,
    DEPARTMENT: string,
    DESIGNATION: string
    GENDER: string
}

type StaffData = {
    data: STAFF[]
    error: string
}

export default async function Page() {

    const currentuser = await currentUser()
    if (!currentuser) redirect("/")


    const yearmonth: {
        data: IGNOREDDELAY_YM[]
        status: string
    } = await getIgnoredDelayYearMonths()

    return (
        <>
            <h3 className="widgettitle">Remove Ignored Delays</h3>
            <IgnoredDelayTable yearmonth={yearmonth.data} />
        </>
    )

}