import { getWeights, updateWeight } from "@/lib/actions/performance/evalsetup.actions";
import { Button, Card, CardBody, CardHeader, Input, Select, SelectItem } from "@nextui-org/react";
import { revalidatePath } from "next/cache";

export default async function Page() {

    const weights: {
        data: {
            HOD_WEIGHT: number
            SUP_WEIGHT: number
        }[]
        error: string
    } = await getWeights()

    if (weights?.error) {
        alert(weights.error)
        return
    }

    const formSubmit = async (formData: FormData) => {
        "use server"
        const hod_weight = parseInt(formData.get("hod_weight") as unknown as string)
        const sup_weight = parseInt(formData.get("sup_weight") as unknown as string)

        // serverside function call 
        await updateWeight(sup_weight, hod_weight)

        revalidatePath("/evaluation/setup/weight")
    }

    return (
        <>
            <h1 className="widgettitle">Weight Setup</h1>

            <Card className="max-w-md mx-auto">
                <CardBody>

                    <form
                        action={formSubmit}
                        className="flex flex-col justify-start gap-5" >

                        <Input
                            label="Level 1 Weight"
                            variant="bordered"
                            name="sup_weight"
                            type="number"
                            size="sm"
                            isRequired
                            defaultValue={`${weights.data[0].SUP_WEIGHT}`}
                        />

                        <Input
                            label="Level 2 Weight"
                            variant="bordered"
                            name="hod_weight"
                            type="number"
                            size="sm"
                            isRequired
                            defaultValue={`${weights.data[0].HOD_WEIGHT}`}
                        />
                        <Button type="submit" color="success" >
                            Update
                        </Button>
                    </form>
                </CardBody>
            </Card>


        </>
    )
}
