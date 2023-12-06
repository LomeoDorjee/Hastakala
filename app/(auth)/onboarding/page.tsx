import { getUserDetail, onBoardUser } from "@/lib/actions/config/user.actions"
import { currentUser } from "@clerk/nextjs"
import { Spinner } from "@nextui-org/react"
import { redirect } from "next/navigation"

async function Page() {
    
    const currentuser = await currentUser()
    if (!currentuser) return

    const user: {
        data: {
            userid: string
            username: string
            onboarded: boolean
            depid: number
            staffid: number
            usertype: string
        }[]
        error: string
    } = await getUserDetail(currentuser.id, 1)


    if (!user.data[0].onboarded) {
        const userData = {
            userid: currentuser.id,
            username: (currentuser.username) ? currentuser.username : "NoUserName"
        }
        await onBoardUser(userData)
    }

    redirect("/")
    
    return (
        <main className="max-auto flex flex-col justify-center p-10 max-w-3xl">
            <Spinner label="Checking User" color="secondary" labelColor="secondary"/>
        </main>
    )
}

export default Page