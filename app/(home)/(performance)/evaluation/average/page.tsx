import AverageTable from "@/components/table/evaluation/AverageTable"
import { getAllFiscalYears, getAverageMarks } from "@/lib/actions/performance/evaluation.actions"

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
            <h3 className="widgettitle">Performance Average</h3>
            <AverageTable years={years.data} />
        </>
    )
}