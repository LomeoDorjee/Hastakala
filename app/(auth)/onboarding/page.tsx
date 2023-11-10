import { fetchUserInfo, onBoardUser } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs"
import { Spinner } from "@nextui-org/react"
import { redirect } from "next/navigation"

async function Page() {
    
    const currentuser = await currentUser()
    if (!currentuser) return

    const user = await fetchUserInfo(currentuser.id)

    const userData = {
        userid: currentuser.id,
        username: (currentuser.username) ? currentuser.username : "NoUserName"
    }

    if (!user.onboarded) {
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