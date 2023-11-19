"use client"
import { Card, CardBody, CardHeader, Divider, Snippet } from '@nextui-org/react'
import { useSearchParams } from 'next/navigation'

export default function TransferDetailHeader() {

    const searchParams = useSearchParams()

    const search = searchParams.get('search')

    return (
        <>

            <Card className="py-4">
                <CardHeader className='flex gap-2 justify-between pt-0'>
                    <div className="flex justify-start items-center">
                        <p className=''>Product Code:</p>
                        <Snippet symbol="" variant="bordered" className='border-0 py-0 text-xl'>{searchParams.get("productcode")}</Snippet>
                    </div>
                    <div className="flex justify-start items-center">
                        <p className=''>Product Name:</p>
                        <Snippet symbol="" variant="bordered" className='border-0 py-0 text-xl'>{searchParams.get("productname")}</Snippet>
                    </div>
                </CardHeader>
                <Divider />
                <CardBody className="overflow-visible py-2 flex flex-col gap-2 pb-0">
                    <p>Remarks: {searchParams.get("remarks")}</p>
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