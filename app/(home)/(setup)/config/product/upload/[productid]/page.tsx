import ProductImage from "@/components/forms/ProductImage";
import { getProductImages } from "@/lib/actions/config/products.actions";
import { Card, Image, Skeleton } from "@nextui-org/react";
import NextImage from "next/image";

export default async function Page({ params }: { params: { productid: number } }) {

    const images: {
        data?: {
            masterid: number
            path: string
        }[] | undefined
        error?: string | undefined
    } = await getProductImages(params.productid)

    console.table(images)


    return (
        <>
            <h3 className="text-bold text-2xl uppercase text-center mb-4 border-b-2 rounded-lg border-pink-800">Product Images</h3>
            <ProductImage productid={params.productid} />
            <div className="grid grid-cols-4 gap-4 py-4">
                {
                    (images.data?.length) ? (
                        images.data.map((image) => (
                            <Image
                                as={NextImage}
                                src={`${image.path}`}
                                alt={`product_image${image.masterid}`}
                                width={240}
                                height={240}
                                isZoomed
                            />
                        ))
                    ) : (
                        <Card className="w-full space-y-5 p-4" radius="lg">
                            <Skeleton className="rounded-lg">
                                <div className="h-24 rounded-lg bg-default-300"></div>
                            </Skeleton>
                        </Card>
                    )
                }
            </div>
        </>
    )

}