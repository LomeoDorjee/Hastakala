import { getAllIncharges } from "@/lib/actions/config/incharge.actions"

import InchargeCard from "@/components/cards/InchargeCard"
import { getAllStaffs } from "@/lib/actions/pis/staffs.actions"
import InchargeForm from "@/components/forms/InchargeForm"
import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react"


export default async function Page() {

    const incharges: {
        data: {
            INCHARGEID: number
            INCHARGENAME: string
            STAFFS: {
                STAFFID: number
                STAFFNAME: string
                DEPARTMENT: string
            }[]
        }[]
        error: string
    } = await getAllIncharges()

    const staffs: {
        data: {
            STAFFID: number,
            STAFFNAME: string,
            STAFFCODE: string,
            DEPARTMENT: string,
            DESIGNATION: string
            GENDER: string
        }[]
        error: string
    } = await getAllStaffs()

    return (
        <>
            <h1 className="widgettitle">Incharge Mapping</h1>
            <div className="grid grid-cols-12 gap-4 grid-rows-1">
                <Card className="col-span-8 max-sm:col-span-12 ">
                    <CardHeader className="font-bold text-pink-800">
                        <p className="text-center w-full">INCHARGE LIST</p>
                    </CardHeader>
                    <Divider />
                    <CardBody>
                        <InchargeCard incharges={incharges.data} />
                    </CardBody>
                </Card>
                <Card className="col-span-4 max-sm:col-span-12">
                    <CardHeader className="font-bold text-primary">
                        <p className="text-center w-full">ADD INCHARGE</p>
                    </CardHeader>
                    <Divider />
                    <CardBody>
                        <InchargeForm staffs={staffs.data} />
                    </CardBody>
                </Card>
            </div>

        </>
    )
}
