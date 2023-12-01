"use client"
import { Accordion, AccordionItem, Button, Card, CardBody, CardHeader, Divider, User } from "@nextui-org/react";
import { DeleteIcon } from "../icons/icons";
import { InchargeValidation } from "@/lib/validations/incharge";
import toast from "react-hot-toast";
import { removeIncharge } from "@/lib/actions/config/incharge.actions";
type Props = {
    incharges: {
        INCHARGEID: number
        INCHARGENAME: string
        STAFFS: STAFF[]
    }[]
}
type STAFF = {
    STAFFID: number
    STAFFNAME: string
    DEPARTMENT: string
}

export default function InchargeCard({ incharges }: Props) {


    // Remove Staff
    const handleRemove = async (staffid: number, inchargeid: number) => {

        const newData = {
            inchargeid: parseInt(inchargeid as unknown as string),
            staffid: parseInt(staffid as unknown as string)
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
        const response = await removeIncharge(zod.data)
        if (response?.error) {
            toast.error(response.error)
            return
        }

        toast.success("Data Updated")

    }

    return (
        <Accordion
            variant="splitted"
            isCompact
            className="col-span-6 max-sm:col-span-12 w-full">
            {
                (incharges) ? (
                    incharges.map((incharge) => {
                        return (
                            <AccordionItem
                                key={incharge.INCHARGEID}
                                aria-label={incharge.INCHARGENAME}
                                title={incharge.INCHARGENAME}
                                className="font-semibold"
                            >
                                <div className="flex gap-1 flex-wrap">

                                    {(incharge.STAFFS) ? (
                                        incharge.STAFFS.map((staff) => {
                                            return (
                                                <Card className="p-1 px-2 m-1 flex flex-row justify-between gap-1 items-center" key={staff.STAFFID}>
                                                    <User
                                                        description={staff.DEPARTMENT}
                                                        name={staff.STAFFNAME}
                                                    />
                                                    <Button
                                                        isIconOnly
                                                        color="danger"
                                                        variant="light"
                                                        aria-label="Remove"
                                                        size="sm"
                                                        onClick={() => handleRemove(staff.STAFFID, incharge.INCHARGEID)}
                                                    >
                                                        <DeleteIcon />
                                                    </Button>
                                                </Card>
                                            )
                                        })
                                    ) : (
                                        <>...</>
                                    )}
                                </div>

                            </AccordionItem>

                        )
                    })
                ) : (
                    <p>No Incharges</p>
                )
            }
        </Accordion>
    )

}