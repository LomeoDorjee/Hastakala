"use client"
import { Card, CardBody, CardHeader, Chip, Divider, Link, Snippet, Tooltip } from '@nextui-org/react'
import { useSearchParams } from 'next/navigation'

export default function TransferDetailHeader() {

    const searchParams = useSearchParams()

    return (
        <>
            <Card className="py-4">
                <CardHeader className='flex gap-2 justify-between pt-0'>
                    <div className="flex justify-start items-center">
                        <p className=''>Product Code:</p>
                        <Tooltip content="Images">
                            <Link isBlock color="success" showAnchorIcon
                                href={`/config/product/upload/${searchParams.get("productid")}`}
                                target='_blank'>
                                {searchParams.get("productcode")}
                            </Link>
                        </Tooltip>
                    </div>
                    <div className="flex justify-start items-center">
                        <p className=''>Product Name:</p>
                        <Chip variant="bordered" className='border-0 py-0 text-xl'>{searchParams.get("productname")}</Chip>
                    </div>
                </CardHeader>
                <Divider />
                <CardBody className="overflow-visible pt-2 flex flex-col gap-2 pb-0">
                    <div className="flex justify-between">
                        <p>Status: <b>{searchParams.get("status")}</b></p>
                        <p>Start Date: <b>{searchParams.get("startdate")}</b></p>
                        <p>Created By: <b>{searchParams.get("startusername")}</b></p>
                    </div>
                </CardBody>
            </Card>
        </>
    )
}