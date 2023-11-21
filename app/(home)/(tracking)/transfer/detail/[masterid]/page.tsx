import { RightColorArrowIcon } from "@/components/icons/icons"
import IssueAction from "@/components/transferSections/IssueAction"
import TransferDetailHeader from "@/components/transferSections/TransferDetailHeader"
import { getAllUsers } from "@/lib/actions/config/user.actions"
import { getTransferDetail, receiveProduct } from "@/lib/actions/transfer/transfer.actions"
import { currentUser } from "@clerk/nextjs"
import { Button, Card, CardBody, CardFooter, CardHeader, Chip, Code, Divider, Link, Tab, Tabs, Tooltip } from "@nextui-org/react"

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
        remarks: string
    }[] | undefined
    error?: string | undefined
}

type UserList = {
    data?: {
        userid: string
        username: string
        depname: string | null
        fullname: string
        image: string
    }[] | undefined
    error?: string
}

export default async function Page({ params }: {
    params: {
        masterid: number
    }
}) {

    const sessionUser = await currentUser()
    if (!sessionUser) return
    if (!sessionUser.username) return

    const users: UserList = await getAllUsers()

    const history: HistoryData = await getTransferDetail(params.masterid)

    if (history.error) {
        console.log(history.error)
        return
    }

    const handleReceive = async () => {
        "use server"
        if (!history.data) {
            return
        }
        const detailid = history.data[0].transferdetailid
        await receiveProduct(detailid, params.masterid)

    }

    return (
        <>
            <div className="flex gap-2 justify-between">
                <h2 className="m-2 text-center text-2xl text-pink-800">Transfer Details</h2>

                <div className="flex gap-2 z-50">
                    {
                        (
                            history.data
                            && history.data[0].touserid == sessionUser.id
                            && history.data[0].status == "ISSUE"
                        ) ? (

                            <form action={handleReceive}>
                                <Button color="secondary" type="submit" variant="light">
                                    Receive
                                </Button>
                            </form>

                        ) : (
                            <></>
                        )
                    }

                    {
                        (
                            history.data
                            && history.data[0].touserid == sessionUser.id
                            && history.data[0].status == "RECEIVED"
                        ) ? (
                            <IssueAction users={users?.data} sessionUserId={sessionUser.id} sessionUserName={sessionUser.username} masterid={params.masterid} />

                        ) : (
                            <></>
                        )

                    }

                    <Button
                        showAnchorIcon
                        as={Link}
                        href="/transfer"
                        color="danger" variant="light" >
                        Back to List
                    </Button>
                </div>
            </div>

            <TransferDetailHeader />


            {/* History Detail */}

            <div className="grid grid-cols-2 gap-2 pt-6">

                {
                    (history?.data) ? (
                        history.data.map((his) => (

                            <Card className="flex flex-col gap-1" key={his.transferdetailid} isFooterBlurred>

                                <div className="flex justify-between px-5">

                                    <div className="py-1">
                                        <h4 className="font-bold text-md">{his.fromusername}</h4>
                                        <p className="text-tiny uppercase font-bold">{his.fromuserdep}</p>
                                    </div>

                                    {
                                        (his.status && his.status == "ISSUE") ? (
                                            <div className="flex justify-between items-center gap-4">
                                                <Code color="warning">ISSUED</Code>
                                                <RightColorArrowIcon color="#f31260" />
                                            </div>
                                        ) :
                                            (
                                                <div className="flex justify-between items-center gap-4">
                                                    <Code color="warning">ISSUED</Code>

                                                    <RightColorArrowIcon color="#18c964" />
                                                    <Code color="success">RECEIVED</Code>
                                                </div>
                                            )

                                    }

                                    <div className="py-1">
                                        <h4 className="font-bold text-large">{his.tousername}</h4>
                                        <p className="text-tiny uppercase font-bold">{his.touserdep}</p>
                                    </div>
                                </div>

                                <Divider />

                                <CardFooter className="py-1">
                                    <div className="flex flex-wrap gap-1 justify-start px-1">
                                        <Chip variant="flat">
                                            {his.transferdate}
                                        </Chip>
                                        <Tooltip content={his.remarks}>
                                            <Chip color="primary" variant="bordered" className="border-0">" {his.remarks} "</Chip>
                                        </Tooltip>
                                    </div>
                                </CardFooter>

                            </Card>

                        ))
                    ) : (
                        <></>
                    )
                }

            </div>





        </>
    )
}