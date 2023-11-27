import StaffTable from "@/components/table/StaffTable"
import { getAllStaffs } from "@/lib/actions/pis/staffs.actions"

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

    return (
        <>
            <h3 className="widgettitle">Staff List</h3>
            <StaffTable staffs={staffs.data} />
        </>
    )

}