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
            <h3 className="text-bold text-2xl uppercase text-center mb-4 border-b-2 rounded-lg border-pink-800">Product List</h3>
            <ProductTable products={data} />
        </>
    )

}