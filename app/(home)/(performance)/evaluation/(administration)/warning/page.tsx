import WarningTable from "@/components/table/evaluation/WarningTable"
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

    const criterias: CRITERIA = await getCriterias("WARNING")

    return (
        <>
            <h3 className="widgettitle">Warning Record</h3>
            <WarningTable years={years.data} criterias={criterias.data} />
        </>
    )

}