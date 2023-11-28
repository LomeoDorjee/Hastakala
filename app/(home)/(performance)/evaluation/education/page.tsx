import EducationTable from "@/components/table/evaluation/EducationTable"
import { getAllFiscalYears } from "@/lib/actions/performance/evaluation.actions"

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
            <h3 className="widgettitle">Education Record</h3>
            <EducationTable years={years.data} />
        </>
    )

}