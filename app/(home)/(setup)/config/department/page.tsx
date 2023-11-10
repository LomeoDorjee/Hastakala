import DepartmentTable from "@/components/table/DepartmentTable"
import { getAllDepartment } from "@/lib/actions/config/department.actions"

export default async function Page() {

    const data = await getAllDepartment();
    console.log(data)

    return (
        <>
            <h1 className="text-bold text-center mb-3 pb-2 uppercase text-2xl border-b-3 border-pink-800 rounded-lg">Department List</h1>
            <DepartmentTable departments={ data.data } />
        </>
    )

}