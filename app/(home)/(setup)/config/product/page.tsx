import ProductTable from "@/components/table/ProductTable"
import { getAllProducts } from "@/lib/actions/config/products.actions"

type ProductData = {
    data?: {
        productid: number
        productcode: string
        productname: string
        isactive: boolean
    }[] | undefined
    error?: string | undefined
}

export default async function Page() {

    const { data, error }: ProductData = await getAllProducts()

    if (error) {
        console.log(error)
        return
    }

    return (
        <>
            <h3 className="widgettitle">Product List</h3>
            <ProductTable products={data} />
        </>
    )

}