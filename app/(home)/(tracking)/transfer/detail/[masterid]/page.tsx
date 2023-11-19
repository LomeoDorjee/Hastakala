import { RightColorArrowIcon } from "@/components/icons/icons"
import TransferDetailHeader from "@/components/transferSections/TransferDetailHeader"
import { getTransferDetail } from "@/lib/actions/transfer/transfer.actions"
import { Card, CardBody, CardHeader, Chip, Code, Divider, Tab, Tabs } from "@nextui-org/react"

type HistoryData = {
    data?: {
        transferdetailid: number
        transferdate: string
        fromuserid: string
        fromusername: string
        fromuserdep: string
        touserid: string
        tousername: string
        touserdep: string
        status: string
    }[] | undefined
    error?: string | undefined
}

export default async function Page({ params }: {
    params: {
        masterid: number
    }
}) {

    const history: HistoryData = await getTransferDetail(params.masterid)

    if (history.error) {
        console.log(history.error)
        return
    }

    return (
        <>
            <h2 className="m-2 text-center text-2xl text-pink-800">Transfer Details</h2>

            <TransferDetailHeader />


            {/* History Detail */}

            <div className="grid grid-cols-2 gap-2 pt-2">

                {
                    (history?.data) ? (
                        history.data.map((his) => (
                            <div className="my-2 ">
                                <div className="flex flex-col gap-1">
                                    <Chip variant="bordered" className="rounded-lg bg-default">{his.transferdate}</Chip>
                                    <Card className="flex flex-row justify-between gap-4 my-2 p-2 my-0 items-center" key={his.transferdetailid}>

                                        <Card className="p-4" >
                                            <CardBody className="overflow-visible py-2">
                                                <h4 className="font-bold text-large">{his.fromusername}</h4>
                                                <p className="text-tiny uppercase font-bold">{his.fromuserdep}</p>
                                            </CardBody>
                                        </Card>

                                        {
                                            (his.status && his.status == "ISSUE") ? (
                                                <div className="flex flex-col gap-2 items-center justify-center">
                                                    <RightColorArrowIcon color="#f31260" />
                                                    <Code color="warning">ISSUED</Code>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col gap-2 items-center justify-center">
                                                    <RightColorArrowIcon color="#18c964" />
                                                    <Code color="success">RECEIVED</Code>
                                                </div>
                                            )
                                        }

                                        <Card className="p-4" >
                                            <CardBody className="overflow-visible py-2">
                                                <h4 className="font-bold text-large">{his.tousername}</h4>
                                                <p className="text-tiny uppercase font-bold">{his.touserdep}</p>
                                            </CardBody>
                                        </Card>
                                    </Card>
                                </div>
                            </div>
                        ))
                    ) : (
                        <></>
                    )
                }

            </div>

        </>
    )
}