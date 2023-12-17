import { Card, Divider, Skeleton, Spinner } from "@nextui-org/react";

export default function Loading() {
    return (
        <>
            <div className="fixed z-50 bottom-4 right-28">
                <Spinner color="secondary" size="lg" />
            </div>
            <h3 className="widgettitle">
                <Skeleton className="w-2/5 rounded-lg p-2">
                    <div className="h-4 w-full rounded-lg bg-default-300"></div>
                </Skeleton>
            </h3>
            <Skeleton className="rounded-lg my-5">
                <div className="h-12 rounded-lg bg-default-300"></div>
            </Skeleton>

            <Card className="space-y-5 p-4" radius="lg">
                <div className="space-y-3 p-4">
                    <Skeleton className="w-1/5 rounded-lg">
                        <div className="h-8 w-1/5 rounded-lg bg-default-200"></div>
                    </Skeleton>
                    <Skeleton className="w-1/2 rounded-lg">
                        <div className="h-8 w-1/2 rounded-lg bg-default-300"></div>
                    </Skeleton>
                    <Skeleton className="w-2/5 rounded-lg">
                        <div className="h-8 w-2/5 rounded-lg bg-default-300"></div>
                    </Skeleton>
                    <Skeleton className="w-1/3 rounded-lg">
                        <div className="h-8 w-1/3 rounded-lg bg-default-200"></div>
                    </Skeleton>
                    <Skeleton className="w-2/5 rounded-lg">
                        <div className="h-8 w-2/5 rounded-lg bg-default-200"></div>
                    </Skeleton>
                    <Skeleton className="w-3/5 rounded-lg">
                        <div className="h-8 w-3/5 rounded-lg bg-default-300"></div>
                    </Skeleton>
                    <Skeleton className="w-4/5 rounded-lg">
                        <div className="h-8 w-4/5 rounded-lg bg-default-200"></div>
                    </Skeleton>
                    <Skeleton className="w-full rounded-lg">
                        <div className="h-8 w-full rounded-lg bg-default-200"></div>
                    </Skeleton>
                </div>
            </Card>
        </>
    )
}