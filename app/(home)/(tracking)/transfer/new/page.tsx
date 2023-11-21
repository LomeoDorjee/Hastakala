// pages/transfers/new.tsx
import React from 'react';
import TransferForm from '@/components/forms/TransferForm';
import { getAllProducts } from '@/lib/actions/config/products.actions';
import { getAllUsers } from '@/lib/actions/config/user.actions';
import { currentUser } from '@clerk/nextjs';

type ProductList = {
    data?: {
        productid: number
        productname: string
        productcode: string
        imgpath: string
    }[] | undefined
    error?: string
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

const Page = async () => {

    const sessionUser = await currentUser()
    if (!sessionUser) return
    if (!sessionUser.username) return

    // only active products
    const isactive = true
    const products: ProductList = await getAllProducts(isactive)
    const users: UserList = await getAllUsers()


    if (products?.error) {
        console.log(products.error)
        return
    }

    return (
        <div>
            <TransferForm products={products?.data} users={users?.data} sessionUserId={sessionUser.id} sessionUserName={sessionUser.username} />
        </div>
    );
};

export default Page;
