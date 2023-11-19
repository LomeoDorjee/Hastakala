
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Switch, Select, SelectItem } from "@nextui-org/react"
import { useFormStatus } from "react-dom"
import toast from "react-hot-toast"
import { usePathname } from 'next/navigation'
import { Dispatch, SetStateAction, useCallback } from "react"
import { ProductValidation } from "@/lib/validations/product"
import { createUpdateProduct } from "@/lib/actions/config/products.actions"

type Props = {
    onOpen: () => void
    onOpenChange: () => void
    isOpen: boolean
    onClose: () => void
    ToEditProductId: number
    ToEditProductCode: string
    setToEditProductCode: (value: SetStateAction<string>) => void
    ToEditProductName: string
    setToEditProductName: (value: SetStateAction<string>) => void
    isSelected: boolean
    setIsSelected: Dispatch<SetStateAction<boolean>>
}

export default function ProductForm({
    onOpen,
    isOpen,
    onOpenChange,
    onClose,
    ToEditProductId,
    ToEditProductName,
    setToEditProductName,
    ToEditProductCode,
    setToEditProductCode,
    isSelected,
    setIsSelected
}: Props) {

    const pathname = usePathname()

    const handleNameChange = useCallback((value?: string) => {
        if (value) {
            setToEditProductName(value);
        } else {
            setToEditProductName("");
        }
    }, []);
    const handleCodeChange = useCallback((value?: string) => {
        if (value) {
            setToEditProductCode(value);
        } else {
            setToEditProductCode("");
        }
    }, []);

    const formSubmit = async (formData: FormData) => {

        const newProduct = {
            productid: ToEditProductId,
            productcode: formData.get("ProductCode"),
            productname: formData.get("ProductName"),
            isactive: isSelected
        }

        // Validation
        const zod = ProductValidation.safeParse(newProduct)
        if (!zod.success) {

            let errorMessage = "";

            zod.error.issues.forEach((issue) => {
                errorMessage = errorMessage + "[" + issue.path[0] + "]: " + issue.message + "."
            })
            toast.error(errorMessage)
            return;
        }

        // serverside function call 
        const response = await createUpdateProduct(zod.data)
        if (response?.error) {
            toast.error(response.error)
            return
        }

        if (response.status) toast.success(response.status)

        onClose()
    }

    return (
        <>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} backdrop="blur">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Product Actions</ModalHeader>
                            <ModalBody>
                                <form
                                    action={formSubmit}
                                    className="flex flex-col justify-start gap-10" >

                                    <Input
                                        label="Product Code"
                                        variant="bordered"
                                        name="ProductCode"
                                        value={ToEditProductCode}
                                        onValueChange={handleCodeChange}
                                        isRequired
                                    />
                                    <Input
                                        label="Product Name"
                                        variant="bordered"
                                        name="ProductName"
                                        value={ToEditProductName}
                                        onValueChange={handleNameChange}
                                        isRequired
                                    />
                                    <Switch isSelected={isSelected} onValueChange={setIsSelected} color="success">Is Active?</Switch>
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
