import CriteriaForm from "@/components/forms/CriteriaForm";
import { getWeights, updateWeight } from "@/lib/actions/performance/evalsetup.actions";
import { getCriterias } from "@/lib/actions/performance/evaluation.actions";

export default async function Page() {

    const criterias: {
        data: {
            CRITERIAID: number
            CVALUE: number
            CNAME: string
            CTYPE: string
        }[]
        error: string
    } = await getCriterias("ALL")

    if (criterias.error) {
        console.log(criterias.error)
        return
    }

    return (
        <>
            <h1 className="widgettitle">Criteria Setup</h1>
            <CriteriaForm criterias={criterias.data} />
        </>
    )
}
