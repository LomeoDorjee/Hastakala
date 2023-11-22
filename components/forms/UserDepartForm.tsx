import { Dispatch, SetStateAction, useCallback, useRef } from "react"
import { DepartmentValidation } from "@/lib/validations/department"

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Switch, Select, SelectItem } from "@nextui-org/react"
import { useFormStatus } from "react-dom"
import toast from "react-hot-toast"
import { updateUserDepartment } from "@/lib/actions/config/user.actions"
import { usePathname } from 'next/navigation'

type Props = {
    onOpen: () => void
    onOpenChange: () => void
    isOpen: boolean
    onClose: () => void
    // departmentName: string
    // departmentId: number
    // setDepartmentName: (value: SetStateAction<string>) => void
    // isSelected: boolean
    // setIsSelected: Dispatch<SetStateAction<boolean>>
    departments: {
        depid: number
        depname: string 
    }[] | undefined
    ToEditUserId: string
    ToEditUserName: string
}

export default function UserDepartForm({
    onOpen, 
    isOpen, 
    onOpenChange, 
    onClose, 
    // departmentName, 
    // departmentId, 
    // setDepartmentName,
    // isSelected,
    // setIsSelected
    departments,
    ToEditUserId,
    ToEditUserName
}: Props) {

    const pathname = usePathname()

    const formSubmit = async (formData: FormData) => {
        
        const newDepId = parseInt(formData.get("departmentId") as string)
        
        const newUserDep = {
            depid: parseInt(formData.get("departmentId") as string),
            userid: ToEditUserId,
            pathname: pathname
        }
        
        // serverside function call 
        const response = await updateUserDepartment(newUserDep) 
        if ( response?.error ) {
            toast.error(response.error)
            return
        }

        if (response.status) toast.success(response.status)
        
        onClose()
    }

    // const handleValueChange = useCallback((value?: string) => {
    //     if (value) {
    //       setDepartmentName(value);
    //     } else {
    //       setDepartmentName("");
    //     }
    // }, []);

  return (
    <>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} backdrop="blur">
            <ModalContent>
            {(onClose) => (
                <>
                    <ModalHeader className="flex flex-col gap-1">User Department Action</ModalHeader>
                    <ModalBody>
                        <form
                            action={ formSubmit }      
                            className="flex flex-col justify-start gap-10" >
                            
                            <Input
                                readOnly
                                label="User"
                                variant="bordered"
                                name="UserName"
                                value={ToEditUserName}           
                            />  
                            <Select
                                autoFocus      
                                items={departments}
                                label="Department"
                                placeholder="Select a Department"
                                name="departmentId"
                                isRequired
                                >
                                {(department) => <SelectItem key={department.depid}>{department.depname}</SelectItem>}
                            </Select> 
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
