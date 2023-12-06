import DepartmentTable from "@/components/table/DepartmentTable"
import { getAllDepartment } from "@/lib/actions/config/department.actions"

export default async function Page() {

    const data = await getAllDepartment();

    return (
        <>
            <h1 className="widgettitle">Department List</h1>
            <DepartmentTable departments={ data.data } />
        </>
    )

}