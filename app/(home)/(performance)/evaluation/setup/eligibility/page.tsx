import CriteriaForm from "@/components/forms/CriteriaForm";
import EligibilityForm from "@/components/forms/EligibilityForm";
import { getEligibilities, getWeights, updateWeight } from "@/lib/actions/performance/evalsetup.actions";
import { getCriterias } from "@/lib/actions/performance/evaluation.actions";

export default async function Page() {

    const eligibilities: {
        data: {
            ELIGIBLEID: number
            ETYPE: string
            VALUE: number
        }[]
        error: string
    } = await getEligibilities()

    if (eligibilities.error) {
        console.log(eligibilities.error)
        return
    }

    return (
        <>
            <h1 className="widgettitle">Eligibility Setup</h1>
            <EligibilityForm eligibilities={eligibilities.data} />
        </>
    )
}
