import ProductTable from "@/components/table/ProductTable"
import { getAllProducts } from "@/lib/actions/config/products.actions"
import toast from "react-hot-toast"

type ProductData = {
    data: {
        productid: number
        productcode: string
        productname: string
        isactive: boolean
    }[]
    error: string
}

export default async function Page() {

    const { data, error }: ProductData = await getAllProducts()

    if (error) {
        toast.error(error)
        return
    }

    return (
        <>
            <h3 className="widgettitle">Product List</h3>
            <ProductTable products={data} />
        </>
    )

}