import LeaveEvalTable from "@/components/table/evaluation/LeaveEvalTable"
import { getAllFiscalYears, getCriterias } from "@/lib/actions/performance/evaluation.actions"

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

    const criterias: CRITERIA = await getCriterias("LEAVE")

    return (
        <>
            <h3 className="widgettitle">Attendance Record</h3>
            <LeaveEvalTable years={years.data} criterias={criterias.data} />
        </>
    )

}