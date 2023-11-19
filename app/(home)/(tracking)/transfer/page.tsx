import TransferTable from "@/components/table/TransferTable";
import { getAllTransfers } from "@/lib/actions/transfer/transfer.actions";

type TransferData = {
    data?: {
        transfermasterid: number
        productid: number
        productname: string
        productcode: string
        remarks: string
        startbyuser: string
        startbyuserid: string
        startdate: string
        status: string
    }[] | undefined
    error?: string
}

export default async function Page() {

    const { data, error }: TransferData = await getAllTransfers()

    if (error) {
        console.log(error)
        return
    }

    return (
        <>
            <h1 className="text-lg border-b-2 border-pink-800 rounded-lg text-center mb-3 p-2">Product Transfer List</h1>
            <TransferTable transfers={data} />
        </>
    )
}