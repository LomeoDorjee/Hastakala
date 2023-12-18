"use client"
import { updateEligibilities } from "@/lib/actions/performance/evalsetup.actions";
import { Button, Card, CardBody, CardHeader, Input, Select, SelectItem, Spinner } from "@nextui-org/react";
import { useFormStatus } from "react-dom";
import toast from "react-hot-toast";

type Props = {
    eligibilities: {
        ELIGIBLEID: number
        ETYPE: string
        VALUE: number
    }[]
}
export default function EligibilityForm({ eligibilities }: Props) {


    const formSubmit = async (formData: FormData) => {

        // serverside function call 
        const response = await updateEligibilities(formData)
        if (response?.error) {
            toast.error(response.error)
            return
        }

        toast.success("Eligibilities Updated")
    }

    return (
        <Card className="max-w-md mx-auto px-2 py-4">
            <CardBody>

                <form
                    action={formSubmit}
                    className="flex flex-wrap justify-center items-center gap-5" >

                    {
                        (eligibilities) ? eligibilities.map((eligibility) => {
                            return (
                                <Input
                                    label={eligibility.ETYPE}
                                    variant="underlined"
                                    name={eligibility.ELIGIBLEID as unknown as string}
                                    type="number"
                                    size="sm"
                                    isRequired
                                    defaultValue={`${eligibility.VALUE}`}
                                    key={eligibility.ETYPE}
                                    labelPlacement="outside"
                                    className="max-w-lg"
                                />
                            )
                        }) : (<></>)
                    }

                    <SubmitButton />
                </form>
            </CardBody>
        </Card>
    )
}

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" color="success" className="w-full max-w-sm" isDisabled={pending}>
            {pending ? <Spinner /> : "Update"}
        </Button>
    )
}