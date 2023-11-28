import AppreciationTable from "@/components/table/evaluation/AppreciationTable"
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

    const criterias: CRITERIA = await getCriterias("APPRECIATION")

    return (
        <>
            <h3 className="widgettitle">Appreciation Record</h3>
            <AppreciationTable years={years.data} criterias={criterias.data} />
        </>
    )

}