import TransferTable from "@/components/table/TransferTable";
import { getAllTransfers } from "@/lib/actions/transfer/transfer.actions";

type TransferData = {
    data?: {
        productname: string
        fromuser: string
        touser: string
        status: string
        transferid: number
        productid: number
        fromuserid: string
        touserid: string
    }[] | undefined
    error?: string
}

export default async function Page() {

    const transfers: TransferData = await getAllTransfers()

    if (transfers?.error) {
        console.log(transfers?.error)
        return
    }

    return (
        <>
            <h1 className="text-lg border-b-2 border-pink-800 rounded-lg text-center mb-3 p-2">Product Transfer List</h1>
            <TransferTable transfers={transfers.data} />
        </>
    )
}