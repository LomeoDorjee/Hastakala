import AttendanceTable from "@/components/table/AttendanceTable"
// import { fetchDeviceLog, fetchStaffs } from "@/lib/actions/pis/attendance.actions"


export default async function Page() {

    return (
        <>
            <h4 className="widgettitle">Attendance Device Log</h4>
            <AttendanceTable />
        </>
    )

}