import AppraisalTable from "@/components/table/evaluation/AppraisalTable"
import { getAllFiscalYears } from "@/lib/actions/performance/evaluation.actions"
import { getAllStaffs } from "@/lib/actions/pis/staffs.actions"

type YEARS = {
    data: {
        FYEARID: number
        FYEAR: string
    }[]
    error: string
}

export default async function Page() {

    const years: YEARS = await getAllFiscalYears()

    return (
        <>
            <h3 className="widgettitle">Last Appraisal Report</h3>
            <AppraisalTable years={years.data} />
        </>
    )
}