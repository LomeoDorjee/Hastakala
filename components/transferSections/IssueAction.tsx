"use client"

import { IssueValidation } from "@/lib/validations/transfer";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, Select, SelectItem, Link, Checkbox, Avatar } from "@nextui-org/react";
import { useFormStatus } from "react-dom";
import toast from "react-hot-toast";
import { useSearchParams } from 'next/navigation'
import { createUpdateIssue } from "@/lib/actions/transfer/transfer.actions";

type IssueProps = {
    masterid: number
    users: {
        userid: string
        username: string
        depname: string | null
        fullname: string
        image: string
    }[] | undefined
    sessionUserId: string
    sessionUserName: string

}

export default function IssueAction({ masterid, users, sessionUserId, sessionUserName }: IssueProps) {

    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    const searchParams = useSearchParams()

    const handleIssue = async (formData: FormData) => {

        const newIssue = {
            masterid: parseInt(masterid as unknown as string),
            fromuserid: sessionUserId,
            touserid: formData.get("toTransferUser"),
            remarks: formData.get("Remarks"),
        }


        // Validation
        const zod = IssueValidation.safeParse(newIssue)
        if (!zod.success) {

            let errorMessage = "";

            zod.error.issues.forEach((issue) => {
                errorMessage = errorMessage + "[" + issue.path[0] + "]: " + issue.message + "."
            })
            toast.error(errorMessage)
            return;
        }

        // serverside function call 
        const response = await createUpdateIssue(zod.data)
        if (response?.error) {
            toast.error(response.error)
            return
        }

        if (response.status) toast.success(response.status)

        onClose()
    }

    return (
        <>
            <Button onPress={onOpen} variant="light" color="secondary">Issue</Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} backdrop="blur">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Issue Product</ModalHeader>
                            <ModalBody>
                                <form
                                    action={handleIssue}
                                    className="flex flex-col justify-start gap-5" >

                                    <Input
                                        label="Product"
                                        variant="bordered"
                                        value={searchParams.get("productname") as string}
                                        readOnly
                                        isDisabled
                                    />

                                    <Input
                                        readOnly
                                        label="Transfering From"
                                        variant="bordered"
                                        value={sessionUserName}
                                        disabled
                                    />

                                    <Select
                                        autoFocus
                                        items={users}
                                        label="Transfer To"
                                        placeholder="Select a user to Transfer to"
                                        name="toTransferUser"
                                        isRequired
                                        disabledKeys={[sessionUserId]}
                                        variant="bordered"
                                    >
                                        {
                                            (user) => {
                                                return (
                                                    <SelectItem key={user.userid} textValue={user.fullname + " - " + user.depname}>
                                                        <div className="flex gap-2 items-center">
                                                            <Avatar alt={user.fullname} className="flex-shrink-0" size="sm" src={user.image} />
                                                            <div className="flex flex-col">
                                                                <span className="text-small">{user.fullname}</span>
                                                                <span className="text-tiny text-default-400">{user.depname}</span>
                                                            </div>
                                                        </div>
                                                    </SelectItem>
                                                )
                                            }
                                        }
                                    </Select>

                                    <Input
                                        label="Remarks"
                                        variant="bordered"
                                        placeholder="Enter Remarks"
                                        name="Remarks"
                                    />

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
        <Button type="submit" color="success" isDisabled={pending}>
            {pending ? "..." : "Submit"}
        </Button>
    )
}

