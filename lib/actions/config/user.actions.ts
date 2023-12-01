"use server"

import { prisma } from "@/lib/db/main_db"
import { clerkClient } from "@clerk/nextjs"
import { catchErrorMessage } from "../../utils"
import { revalidatePath } from "next/cache"


type UserProp = {
    userid: string
    username: string
    depid?: number
    onboared?: boolean
}

export async function onBoardUser({
    userid,
    username,
}: UserProp){

    try {

        await prisma.$queryRaw`INSERT INTO "USER" VALUES (${userid},${username},1,NULL)`
        
        return {
            status: "success"
        }
        

    } catch (error: unknown) {
        return {
            status: catchErrorMessage(error)
        }
    }
}


export async function fetchUserInfo(userId: string) {
    
    try {
        const data: {
            onboarded: boolean
        }[] = await prisma.$queryRaw`SELECT ONBOARDED FROM "USER" WHERE USERID = ${userId}`

        return {
            onboarded: data.length
        }
    } catch (error) {
        return {
            error: catchErrorMessage(error)
        }
    }

}


export async function getUserDetail(userId: string, staffid: number) {

    try {
        let data: {
            userid: string
            username: string
            onboarded: string
            depid: number
            staffid: number
            usertype: string
        }[] = []

        if (userId != "") {
            data = await prisma.$queryRaw`SELECT * FROM "USER" WHERE USERID = ${userId}`
        } else {
            data = await prisma.$queryRaw`SELECT * FROM "USER" WHERE STAFFID = ${staffid}`
        }

        return {
            data: data,
            error: ""
        }
    } catch (error) {
        return {
            data: [],
            error: catchErrorMessage(error)
        }
    }

}

type userDepProps = {
    depid: number
    userid: string
    pathname: string
}

export async function updateUserDepartment(userDep: userDepProps) {
    
    try {

        await prisma.$queryRaw`UPDATE "USER" SET DEPID = ${userDep.depid} WHERE USERID=${userDep.userid}`

        revalidatePath(userDep.pathname)

        return {
            status: "User's Department has been updated"
        }
    } catch (error) {
        return {
            error: catchErrorMessage(error)
        }
    }

}

type userKeyValue = {
    [key: string]: string | null
}
export async function getAllUsers() {

    try {
        
        const clerkUsers = await clerkClient.users.getUserList()
    
        const dbUsers: {
            USERID: string
            DEPNAME: string
        }[] = await prisma.$queryRaw`SELECT USERID, (SELECT DEPNAME FROM DEPARTMENT WHERE DEPID = U.DEPID) DEPNAME FROM "USER" U`
    
        let userDep: userKeyValue = {}
    
        dbUsers.forEach(element => {
            userDep[element.USERID] = element.DEPNAME
        });
    
        let users: {
            userid: string
            username: string
            depname: string | null
            fullname: string
            image: string
        }[] = []
    
        clerkUsers.forEach(e => {
            users.push({
                userid: e.id,
                username: (e.username)?e.username:"NoUserName",
                depname: (userDep[e.id]) ? userDep[e.id] : "Unassigned",
                fullname: (e.firstName) ? e.firstName + " "+e.lastName: "NA",
                image: (e.imageUrl) ? e.imageUrl: "NA",
            })
        })
        
        return {
            data: users,
            error: ""
        }
    } catch (error: unknown) {
        return {
            data: [],
            error: catchErrorMessage(error)
        }
    }

}

export async function mapUserToStaff(userid: string, staffid: number) {

    try {
        await prisma.$queryRaw`UPDATE "USER" SET STAFFID=${staffid} WHERE USERID=${userid}`
        return {
            status: "Mapping Success"
        }
    } catch (e) {
        return {
            status: catchErrorMessage(e)
        }
    }

}

export async function mapUserType(usertype: string, staffid: number) {

    try {
        await prisma.$queryRaw`UPDATE "USER" SET USERTYPE=${usertype} WHERE STAFFID=${staffid}`
        return {
            status: "User Type Updated"
        }
    } catch (e) {
        return {
            status: catchErrorMessage(e)
        }
    }

}