import { Dispatch, SetStateAction, useCallback } from "react"

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Switch, Select, SelectItem } from "@nextui-org/react"
import { useFormStatus } from "react-dom"
import toast from "react-hot-toast"
import { AppraisalValidation } from "@/lib/validations/evaluation"
import { createUpdateAppraisal } from "@/lib/actions/performance/evaluation.actions"

type Props = {
    onOpen: () => void
    onOpenChange: () => void
    isOpen: boolean
    onClose: () => void
    staffid: number
    staffname: string
    toSelectFyearid: string
    years: {
        FYEARID: number
        FYEAR: string
    }[]
    fetchData: () => Promise<void>
}

export default function AppraisalForm({
    onOpen,
    isOpen,
    onOpenChange,
    onClose,
    staffid,
    staffname,
    toSelectFyearid,
    years,
    fetchData
}: Props) {

    const formSubmit = async (formData: FormData) => {

        const newData = {
            staffid: staffid as unknown as number,
            fyearid: parseInt(formData.get("fyearid") as unknown as string),
        }

        // Validation
        const zod = AppraisalValidation.safeParse(newData)
        if (!zod.success) {

            let errorMessage = "";

            zod.error.issues.forEach((issue) => {
                errorMessage = errorMessage + "[" + issue.path[0] + "]: " + issue.message + "."
            })
            toast.error(errorMessage)
            return;
        }

        // serverside function call 
        const response = await createUpdateAppraisal(zod.data)
        if (response?.error) {
            toast.error(response.error)
            return
        }

        toast.success("Data Saved")
        fetchData()
        onClose()
    }

    return (
        <>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} backdrop="blur">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Appraisal Actions</ModalHeader>
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
                                        defaultSelectedKeys={[toSelectFyearid]}
                                    >
                                        {years.map((year) => (
                                            <SelectItem key={year.FYEARID} value={year.FYEAR}>
                                                {year.FYEAR}
                                            </SelectItem>
                                        ))}
                                    </Select>
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
