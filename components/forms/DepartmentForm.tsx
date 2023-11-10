import { Dispatch, SetStateAction, useCallback, useRef } from "react"
import { DepartmentValidation } from "@/lib/validations/department"

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Switch } from "@nextui-org/react"
import { useFormStatus } from "react-dom"
import toast from "react-hot-toast"
import { createDepartment } from "@/lib/actions/config/department.actions"

type Props = {
    onOpen: () => void
    onOpenChange: () => void
    isOpen: boolean
    onClose: () => void
    departmentName: string
    departmentId: number
    setDepartmentName: (value: SetStateAction<string>) => void
    isSelected: boolean
    setIsSelected: Dispatch<SetStateAction<boolean>>
}

export default function DepartmentForm({
    onOpen, 
    isOpen, 
    onOpenChange, 
    onClose, 
    departmentName, 
    departmentId, 
    setDepartmentName,
    isSelected,
    setIsSelected
}: Props) {

    const formSubmit = async (formData: FormData) => {
        
        const newDep = {
            depname: formData.get("departmentName"),
            // depid: parseInt(formData.get("departmentId") as string)
            depid: departmentId,
            isactive: isSelected
        }

        // Validation
        const zod = DepartmentValidation.safeParse(newDep)
        if (!zod.success) {
            
            let errorMessage = "";

            zod.error.issues.forEach((issue) => {
                errorMessage = errorMessage +"["+ issue.path[0] + "]: " + issue.message + "."
            })
            toast.error(errorMessage)
            return;
        }
        
        // serverside function call 
        const response = await createDepartment(zod.data) 
        if ( response?.error ) {
            toast.error(response.error)
            return
        }

        toast.success("Data Saved")
        onClose()
    }

    const handleValueChange = useCallback((value?: string) => {
        if (value) {
          setDepartmentName(value);
        } else {
          setDepartmentName("");
        }
    }, []);

  return (
    <>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} backdrop="blur">
            <ModalContent>
            {(onClose) => (
                <>
                    <ModalHeader className="flex flex-col gap-1">Department Actions</ModalHeader>
                    <ModalBody>
                        <form
                            action={ formSubmit }      
                            // onSubmit={handleSubmit}
                            className="flex flex-col justify-start gap-10" >
                            
                            <Input
                                autoFocus
                                label="Department"
                                // placeholder="Enter Department Name"
                                variant="bordered"
                                name="departmentName"
                                value={departmentName}     
                                onValueChange={handleValueChange}      
                            />  
                            <Switch isSelected={isSelected} onValueChange={setIsSelected} color="success">Is Active?</Switch>
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
        { pending ? "...": "Submit" } 
    </Button>   
    )
}
