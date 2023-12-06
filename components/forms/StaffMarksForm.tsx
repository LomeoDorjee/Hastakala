import { Dispatch, SetStateAction, useCallback, useRef } from "react"

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Switch, Divider, Chip, Select, SelectItem } from "@nextui-org/react"
import { useFormStatus } from "react-dom"
import toast from "react-hot-toast"
import { MarksValidation } from "@/lib/validations/evaluation"
import { createUpdateMarks } from "@/lib/actions/performance/evaluation.actions"
import { sessionUser } from "@/lib/actions/config/user.actions"


type YEARS = {
    FYEARID: number
    FYEAR: string
}

type Props = {
    onOpen: () => void
    onOpenChange: () => void
    isOpen: boolean
    onClose: () => void
    staffName: string
    staffid: number
    selectedYear: string
    years: YEARS[]
    hod_q1: number
    hod_q2: number
    hod_q3: number
    hod_q4: number
    hod_q5: number
    sup_q6: number
    sup_q7: number
    sup_q8: number
    sup_q9: number
    sup_q10: number
    sup_q1: number
    sup_q2: number
    sup_q3: number
    sup_q4: number
    sup_q5: number
    sessionUser: sessionUser
    fetchData: (yearid: number) => Promise<void>
}

export default function StaffMarksForm({
    onOpen,
    isOpen,
    onOpenChange,
    onClose,
    staffName,
    staffid,
    selectedYear,
    years,
    hod_q1,
    hod_q2,
    hod_q3,
    hod_q4,
    hod_q5,
    sup_q6,
    sup_q7,
    sup_q8,
    sup_q9,
    sup_q10,
    sup_q1,
    sup_q2,
    sup_q3,
    sup_q4,
    sup_q5,
    sessionUser,
    fetchData
}: Props) {

    const formSubmit = async (formData: FormData) => {

        let newData = {
            staffid: staffid,
            fyearid: parseInt(formData.get("fyearid") as string) as number,
            hod_q1: parseInt(formData.get('hod_q1') as string) as number,
            hod_q2: parseInt(formData.get('hod_q2') as string) as number,
            hod_q3: parseInt(formData.get('hod_q3') as string) as number,
            hod_q4: parseInt(formData.get('hod_q4') as string) as number,
            hod_q5: parseInt(formData.get('hod_q5') as string) as number,
            sup_q1: parseInt(formData.get('sup_q1') as string) as number,
            sup_q2: parseInt(formData.get('sup_q2') as string) as number,
            sup_q3: parseInt(formData.get('sup_q3') as string) as number,
            sup_q4: parseInt(formData.get('sup_q4') as string) as number,
            sup_q5: parseInt(formData.get('sup_q5') as string) as number,
            sup_q6: parseInt(formData.get('sup_q6') as string) as number,
            sup_q7: parseInt(formData.get('sup_q7') as string) as number,
            sup_q8: parseInt(formData.get('sup_q8') as string) as number,
            sup_q9: parseInt(formData.get('sup_q9') as string) as number,
            sup_q10: parseInt(formData.get('sup_q10') as string) as number,
        }

        // Validation
        const zod = MarksValidation.safeParse(newData)
        if (!zod.success) {

            let errorMessage = "";

            zod.error.issues.forEach((issue) => {
                errorMessage = errorMessage + "[" + issue.path[0] + "]: " + issue.message + "."
            })
            toast.error(errorMessage)
            return;
        }

        // serverside function call 
        const response = await createUpdateMarks(zod.data, sessionUser)
        if (response?.error) {
            toast.error(response.error)
            return
        }

        fetchData(selectedYear as unknown as number)

        toast.success("Data Saved")
        onClose()
    }


    function HodQuestion() {
        let lines = [];
        for (let i = 1; i <= 5; i++) {
            let val: string = eval('hod_q' + i)
            lines.push(
                <Input
                    key={`inp_${i}`}
                    label={`Q${i} `}
                    placeholder={`Question ${i} Marks`}
                    variant="bordered"
                    name={`hod_q${i}`}
                    type="number"
                    isRequired
                    max={10}
                    defaultValue={val}
                />
            );
        }
        return lines;
    }


    function SupQuestion() {
        let lines = [];
        for (let i = 1; i <= 10; i++) {
            let val: string = eval('sup_q' + i)
            lines.push(
                <Input
                    key={`inp_${i}`}
                    label={`Q${i} `}
                    placeholder={`Question ${i} Marks`}
                    variant="bordered"
                    max={5}
                    name={`sup_q${i}`}
                    type="number"
                    isRequired
                    defaultValue={val}
                />
            );
        }
        return lines;
    }

    return (
        <>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} backdrop="blur" size="4xl">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Department Actions</ModalHeader>
                            <ModalBody>
                                <form
                                    action={formSubmit}
                                    className="flex flex-col justify-start gap-3" >

                                    <div className="flex gap-2">
                                        <Input
                                            label="Staff"
                                            variant="flat"
                                            isReadOnly
                                            value={staffName}
                                        />
                                        <Select
                                            label="Fiscal Year"
                                            className="max-w-xs"
                                            variant="bordered"
                                            placeholder="Select Fiscal Year"
                                            defaultSelectedKeys={[selectedYear]}
                                            name="fyearid"
                                        >
                                            {years.map((year) => (
                                                <SelectItem key={year.FYEARID} value={year.FYEAR}>
                                                    {year.FYEAR}
                                                </SelectItem>
                                            ))}
                                        </Select>
                                    </div>

                                    <Divider />


                                    <Chip color="success">Level 1</Chip>
                                    <div className="grid grid-cols-5 max-sm:grid-cols-2 gap-2">
                                        <SupQuestion />
                                    </div>
                                    <Divider />

                                    <Chip color="success">Level 2</Chip>
                                    <div className="grid grid-cols-5 max-sm:grid-cols-2 gap-2">
                                        <HodQuestion />
                                    </div>

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