import AdminavgTable from "@/components/table/evaluation/AdminavgTable"
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
            <h3 className="widgettitle">Administration Total</h3>
            <AdminavgTable years={years.data} />
        </>
    )

}