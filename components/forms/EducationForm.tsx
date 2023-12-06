import { Dispatch, SetStateAction, useCallback } from "react"

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Switch, Select, SelectItem, RadioGroup, Radio } from "@nextui-org/react"
import { useFormStatus } from "react-dom"
import toast from "react-hot-toast"
import { AppraisalValidation, EducationValidation } from "@/lib/validations/evaluation"
import { createUpdateAppraisal, createUpdateEducation } from "@/lib/actions/performance/evaluation.actions"

type Props = {
    onOpen: () => void
    onOpenChange: () => void
    isOpen: boolean
    onClose: () => void
    staffid: number
    staffname: string
    toSelectFyearid: string
    fetchData: (fyearid: number) => Promise<void>
    years: {
        FYEARID: number
        FYEAR: string
    }[]
}

export default function EducationForm({
    onOpen,
    isOpen,
    onOpenChange,
    onClose,
    staffid,
    staffname,
    toSelectFyearid,
    fetchData,
    years
}: Props) {

    console.log(toSelectFyearid)

    const formSubmit = async (formData: FormData) => {

        const newData = {
            staffid: staffid as unknown as number,
            fyearid: parseInt(toSelectFyearid as unknown as string),
            qualification: formData.get("qualification")
        }

        // Validation
        const zod = EducationValidation.safeParse(newData)
        if (!zod.success) {

            let errorMessage = "";

            zod.error.issues.forEach((issue) => {
                errorMessage = errorMessage + "[" + issue.path[0] + "]: " + issue.message + "."
            })
            toast.error(errorMessage)
            return;
        }

        // serverside function call 
        const response = await createUpdateEducation(zod.data)
        if (response?.error) {
            toast.error(response.error)
            return
        }

        toast.success("Data Saved")
        fetchData(toSelectFyearid as unknown as number)
        onClose()
    }

    return (
        <>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} backdrop="blur">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Education Actions</ModalHeader>
                            <ModalBody>
                                <form
                                    action={formSubmit}
                                    // onSubmit={handleSubmit}
                                    className="flex flex-col justify-start gap-10" >

                                    <Input
                                        isReadOnly
                                        label="Staff"
                                        variant="bordered"
                                        value={staffname}
                                    />
                                    <Select
                                        label="Fiscal Year"
                                        className="min-w-xs"
                                        name="fyearid"
                                        placeholder="Select Fiscal Year"
                                        defaultSelectedKeys={["" + toSelectFyearid]}
                                        isDisabled
                                    >
                                        {years.map((year) => (
                                            <SelectItem key={year.FYEARID} value={year.FYEAR}>
                                                {year.FYEAR}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                    <RadioGroup
                                        label="Education Qualification"
                                        orientation="horizontal"
                                        name="qualification"
                                        className="flex justify-between gap-2"
                                    >
                                        <Radio value="UNDER" name="qualification">Under</Radio>
                                        <Radio value="STANDARD" name="qualification">Standard</Radio>
                                        <Radio value="OVER" name="qualification">Over</Radio>
                                    </RadioGroup>
                                    {/* <input type="hidden" value={departmentId} name="departmentId" />      */}
                                    <SubmitButton />
                                </form>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}


function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" color="secondary" isDisabled={pending}>
            {pending ? "..." : "Submit"}
        </Button>
    )
}
