import TransferTable from "@/components/table/TransferTable";
import { getAllTransfers } from "@/lib/actions/transfer/transfer.actions";
import toast from "react-hot-toast";

type TransferData = {
    data: {
        transfermasterid: number
        productid: number
        productname: string
        productcode: string
        startbyuser: string
        startbyuserid: string
        startdate: string
        status: string
    }[]
    error: string
}

export default async function Page() {

    const { data, error }: TransferData = await getAllTransfers()

    if (error) {
        toast.error(error)
        return
    }

    return (
        <>
            <h1 className="widgettitle">Product Transfer List</h1>
            <TransferTable transfers={data} />
        </>
    )
}