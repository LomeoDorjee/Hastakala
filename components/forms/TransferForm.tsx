"use client"

import { Card, CardHeader, CardBody, Button, Input, Divider, Select, SelectItem, Avatar, Checkbox, Link } from "@nextui-org/react"
import { useFormStatus } from "react-dom"
import toast from "react-hot-toast"
import { TransferValidation } from "@/lib/validations/transfer"
import { createNewTransfer } from "@/lib/actions/transfer/transfer.actions"
import { redirect } from "next/navigation"

type Props = {
    products: {
        productid: number
        productname: string
        productcode: string
        imgpath: string
    }[] | undefined
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

export default function TransferForm({
    products,
    users,
    sessionUserId,
    sessionUserName
}: Props) {

    const formSubmit = async (formData: FormData) => {

        const newTransfer = {
            depname: formData.get("departmentName"),
            productid: parseInt(formData.get("product") as string),
            fromuserid: sessionUserId,
            touserid: formData.get("toTransferUser"),
            remarks: formData.get("Remarks"),
            status: "ISSUE"
        }

        // Validation
        const zod = TransferValidation.safeParse(newTransfer)
        if (!zod.success) {

            let errorMessage = "";

            zod.error.issues.forEach((issue) => {
                errorMessage = errorMessage + "[" + issue.path[0] + "]: " + issue.message + "."
            })
            toast.error(errorMessage)
            return;
        }

        // serverside function call
        const response = await createNewTransfer(zod.data)
        if (response?.error) {
            toast.error(response.error)
            return
        }

        toast.success("Data Saved")

        if (formData.get("backToList") == "1") {
            redirect("/transfer")
        }
        redirect("/transfer/new")
    }

    return (
        <Card className="">
            <CardHeader className="flex gap-1 justify-between">
                <h4 className="text-xl px-2 ">
                    New Transfer 
                </h4>
                <Link
                    isExternal
                    href="/config/product"
                    showAnchorIcon
                >
                    Products
                </Link>
            </CardHeader>
            <Divider />
            <CardBody>
                <form
                    action={formSubmit}
                    // onSubmit={handleSubmit}
                    className="flex flex-col justify-start gap-5" >

                    <Select
                        autoFocus
                        items={products}
                        label="Product"
                        placeholder="Select a product to begin Transfer"
                        name="product"
                        isRequired
                        variant="bordered"
                    >
                        {(product) => <SelectItem key={product.productid} textValue={product.productname}>
                            <div className="flex gap-2 items-center">
                                <Avatar alt={product.productname} className="flex-shrink-0" size="sm" src={product.imgpath} />
                                <div className="flex flex-col">
                                    <span className="text-small">{product.productname}</span>
                                    <span className="text-tiny text-default-400">{product.productcode}</span>
                                </div>
                            </div>
                        </SelectItem>}
                    </Select>

                    <div className="flex gap-5">
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
                    </div>

                    <Input
                        label="Remarks"
                        variant="bordered"
                        placeholder="Enter Remarks"
                        name="Remarks"
                    />

                    <div className="flex gap-5 justify-center">
                        <SubmitButton />
                        <Checkbox
                            defaultSelected
                            color="warning"
                            className="w-full"
                            name="backToList"
                            value="1"
                        >Back to Transfer List</Checkbox>
                        <Button
                            href="/transfer"
                            as={Link}
                            color="danger"
                            variant="solid"
                        >
                            Back
                        </Button>
                    </div>
                </form>
            </CardBody>
            <Divider />
        </Card>
    );
}


function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" color="secondary" isDisabled={pending} className="w-full">
            {pending ? "Transferring" : "Start Transfer"}
        </Button>
    )
}
