import DepartmentTable from "@/components/table/DepartmentTable"
import { getAllDepartment } from "@/lib/actions/config/department.actions"

export default async function Page() {

    const data = await getAllDepartment();
    console.log(data)

    return (
        <>
            <h1 className="widgettitle">Department List</h1>
            <DepartmentTable departments={ data.data } />
        </>
    )

}