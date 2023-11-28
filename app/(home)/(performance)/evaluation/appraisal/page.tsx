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
type STAFFS = {
    data: {
        STAFFID: number,
        STAFFNAME: string,
        STAFFCODE: string,
        DEPARTMENT: string,
        DESIGNATION: string
        GENDER: string
    }[]
    error: string
}

export default async function Page() {

    const years: YEARS = await getAllFiscalYears()

    const staffs: STAFFS = await getAllStaffs()

    return (
        <>
            <h3 className="widgettitle">Last Appraisal Report</h3>
            <AppraisalTable years={years.data} staffs={staffs.data} />
        </>
    )
}