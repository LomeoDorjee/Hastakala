import ServiceTable from "@/components/table/evaluation/ServiceTable"
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
            <h3 className="widgettitle">Service Report</h3>
            <ServiceTable years={years.data} />
        </>
    )
}