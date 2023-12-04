import StaffTable from "@/components/table/StaffTable"
import { getUserDetail } from "@/lib/actions/config/user.actions"
import { getAllStaffs } from "@/lib/actions/pis/staffs.actions"
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"

type STAFF = {
    STAFFID: number,
    STAFFNAME: string,
    STAFFCODE: string,
    DEPARTMENT: string,
    DESIGNATION: string
    GENDER: string
}

type StaffData = {
    data: STAFF[]
    error: string
}

export default async function Page() {

    const staffs: StaffData = await getAllStaffs()

    if (staffs.error != "") {
        console.log(staffs.error)
        return;
    }

    const currentuser = await currentUser()
    if (!currentuser) redirect("/")

    const sessionUser: {
        data: {
            userid: string
            username: string
            onboarded: boolean
            depid: number
            staffid: number
            usertype: string
        }[]
        error: string
    } = await getUserDetail(currentuser.id, 1)

    return (
        <>
            <h3 className="widgettitle">Staff List</h3>
            <StaffTable staffs={staffs.data} sessionUser={sessionUser.data[0]} />
        </>
    )

}