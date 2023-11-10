import AttendanceTable from "@/components/table/AttendanceTable"
// import { fetchDeviceLog, fetchStaffs } from "@/lib/actions/pis/attendance.actions"


export default async function Page() {

    return (
        <>
            <h4 className="text-bold p-1 -mt-8 mb-3 text-center text-xl uppercase border-b-2 border-pink-800 rounded-lg">Attendance Device Log</h4>
            <AttendanceTable />
        </>
    )

}