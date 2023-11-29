import FinalTable from "@/components/table/evaluation/FinalTable"
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
            <h3 className="widgettitle">Final Evaluation</h3>
            <FinalTable years={years.data} />
        </>
    )
}