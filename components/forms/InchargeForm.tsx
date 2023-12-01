"use client"
import { createUpdateIncharge } from "@/lib/actions/config/incharge.actions"
import { InchargeValidation } from "@/lib/validations/incharge"
import { Button, Autocomplete, AutocompleteItem } from "@nextui-org/react"
import { useState } from "react"
import { useFormStatus } from "react-dom"
import toast from "react-hot-toast"
import { PlusIcon } from "../icons/icons"
import { redirect } from "next/navigation"

type Props = {
    staffs: STAFF[]
}

type STAFF = {
    STAFFID: number,
    STAFFNAME: string,
    STAFFCODE: string,
    DEPARTMENT: string,
    DESIGNATION: string
    GENDER: string
}

export default function InchargeForm({
    staffs,
}: Props) {

    const [staffid, setStaffid] = useState<React.Key>(0);
    const [inchargeid, setInchargeid] = useState<React.Key>(0);

    const formSubmit = async (formData: FormData) => {

        const newData = {
            inchargeid: parseInt(inchargeid as unknown as string),
            staffid: parseInt(staffid as unknown as string)
        }

        if (staffid == 0) {
            toast.error("Please select another staff")
            return;
        }

        // Validation
        const zod = InchargeValidation.safeParse(newData)
        if (!zod.success) {

            let errorMessage = "";

            zod.error.issues.forEach((issue) => {
                errorMessage = errorMessage + "[" + issue.path[0] + "]: " + issue.message + "."
            })
            toast.error(errorMessage)
            return;
        }

        // serverside function call 
        const response = await createUpdateIncharge(zod.data)
        if (response?.error) {
            toast.error(response.error)
            return
        }

        toast.success("Data Saved")

        redirect("/config/incharge")

    }

    return (
        <>
            <form
                action={formSubmit}
                className="flex flex-col justify-start gap-5" >

                <Autocomplete
                    defaultItems={staffs}
                    onSelectionChange={setInchargeid}
                    label="Incharge"
                    placeholder="Select Incharge"
                    className="min-w-xs"
                    isRequired
                    variant="flat"
                    color="primary"
                >
                    {(staff) => <AutocompleteItem key={staff.STAFFID}>{staff.STAFFNAME + " - " + staff.DEPARTMENT}</AutocompleteItem>}
                </Autocomplete>

                <Autocomplete
                    defaultItems={staffs}
                    onSelectionChange={setStaffid}
                    label="Staff"
                    placeholder="Select a Staff"
                    className="min-w-xs"
                    isRequired
                    variant="flat"
                    color="primary"
                >
                    {(staff) => <AutocompleteItem key={staff.STAFFID}>{staff.STAFFNAME + " - " + staff.DESIGNATION}</AutocompleteItem>}
                </Autocomplete>
                {/* <Select
                    label="Incharge"
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
                </Select> */}
                {/* <input type="hidden" value={departmentId} name="departmentId" />      */}
                <SubmitButton />
            </form>
        </>
    )
}

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" color="primary" isDisabled={pending} variant="light">
            {pending ? "..." : `Submit`}
        </Button>
    )
}
