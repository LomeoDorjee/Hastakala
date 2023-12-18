"use client"
import { updateCriterias } from "@/lib/actions/performance/evalsetup.actions";
import { Button, Card, CardBody, CardHeader, Input, Select, SelectItem, Spinner } from "@nextui-org/react";
import { useFormStatus } from "react-dom";
import toast from "react-hot-toast";

type Props = {
    criterias: {
        CRITERIAID: number
        CVALUE: number
        CNAME: string
        CTYPE: string
    }[]
}
export default function CriteriaForm({ criterias }: Props) {


    const formSubmit = async (formData: FormData) => {

        // serverside function call 
        const response = await updateCriterias(formData)
        if (response?.error) {
            toast.error(response.error)
            return
        }

        toast.success("Criterias Updated")
    }

    return (
        <Card className="mx-auto px-2 py-4">
            <CardBody>

                <form
                    action={formSubmit}
                    className="flex flex-row flex-wrap justify-start items-center gap-5" >

                    {
                        (criterias) ? criterias.map((criteria) => {
                            return (
                                <Input
                                    label={criteria.CNAME}
                                    description={criteria.CTYPE}
                                    variant="underlined"
                                    name={criteria.CRITERIAID as unknown as string}
                                    type="number"
                                    size="sm"
                                    isRequired
                                    defaultValue={`${criteria.CVALUE}`}
                                    key={criteria.CNAME}
                                    labelPlacement="outside"
                                    className="max-w-sm"
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