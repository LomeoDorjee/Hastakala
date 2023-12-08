import StaffCard from "@/components/cards/StaffCard"
import { getAllUsers, getUserDetail, sessionUser } from "@/lib/actions/config/user.actions";
import { getStaffDetail } from "@/lib/actions/pis/staffs.actions";


export default async function Page({ params }: { params: { staffid: number } }) {

    const staff: {
        data: {
            STAFFID: number
            STAFFNAME: string
            STAFFCODE: string
            DEPARTMENT: string
            DESIGNATION: string
            GENDER: string
            ISSUPPORT: boolean
        }[]
        error: string
    } = await getStaffDetail(params.staffid);

    const users: {
        data: {
            userid: string
            username: string
            depname: string | null
            fullname: string
            image: string
        }[]
        error: string
    } = await getAllUsers()

    const userdetail: {
        data: sessionUser[]
        error: string
    } = await getUserDetail("", params.staffid)



    return (
        <>
            <h3 className="widgettitle">Staff Detail</h3>
            <StaffCard staff={staff.data[0]} users={users.data} userdetail={userdetail.data[0]} />
        </>
    )

}