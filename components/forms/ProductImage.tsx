"use client"
import { uploadProductImage } from "@/lib/actions/config/products.actions"
import { Button } from "@nextui-org/react"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { UploadIcon } from "../icons/icons"

type ImageProps = {
    productid: number
}

export default function ProductImage({ productid }: ImageProps) {

    const [uploading, setUploading] = useState(false)
    const [selectedImage, setSelectedImage] = useState("")
    const [selectedFile, setSelectedFile] = useState<File>()

    const query = useSearchParams()

    const handleSelect = async () => {

        if (!selectedFile) {
            return
        }

        setUploading(true)

        const formdata = new FormData()
        formdata.append('image', selectedFile)
        formdata.append('productid', productid.toString())

        const response = await uploadProductImage(formdata)
        if (response?.error) {
            toast.error(response.error)
            setUploading(false)
            return
        }
        setSelectedFile(undefined)
        toast.success("Image Uploaded")
        setUploading(false)
    }

    useEffect(() => {
        handleSelect()
    }, [selectedFile])

    return (
        <>
            <div className="imageSection flex gap-4">
                <form
                    // action={formSubmit}
                    className="w-full"
                >
                    <div className="flex items-center justify-start w-full">
                        <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">

                            <div className="flex flex-col items-center justify-center pt-1 pb-1">
                                <UploadIcon />

                                {(selectedFile) ? (
                                    <Image
                                        src={selectedImage} alt="Uploading"
                                        width={100}
                                        height={100}
                                    />
                                ) : (
                                    <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                        <span className="font-semibold">Click to upload</span>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG</p>
                                    </div>
                                )}

                            </div>
                            <input
                                type="file"
                                accept='image/*'
                                name="productimage"
                                className="hidden"
                                onChange={({ target }) => {
                                    if (target.files) {
                                        const file = target.files[0]
                                        setSelectedImage(URL.createObjectURL(file))
                                        setSelectedFile(file)
                                    }
                                }}

                            />
                        </label>
                    </div>
                </form>
            </div>
        </>
    )

}