import UserTable from "@/components/table/UserTable"
import { getAllDepartment } from "@/lib/actions/config/department.actions"
import { getAllUsers } from "@/lib/actions/user.actions"
import { clerkClient } from "@clerk/nextjs"
import { User } from "@nextui-org/react"

export default async function Page() {

    const users = await getAllUsers()

    const departments = await getAllDepartment()

    return (
        <>
            <h3 className="text-bold text-2xl uppercase text-center mb-4 border-b-2 rounded-lg border-pink-800">User List</h3>
            <UserTable users={users.data} departments={ departments.data } />
        </>
    )

}