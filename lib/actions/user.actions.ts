"use server"

import { prisma } from "@/lib/db/main_db"
import { clerkClient } from "@clerk/nextjs"
import { catchErrorMessage } from "../utils"


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
    
        // await prisma.user.upsert({
        //     where: {
        //         userid: userid
        //     },
        //     update: {
        //         username,
        //         onboarded: true,
        //     },
        //     create: {
        //         userid,
        //         username,
        //         onboarded: true
        //     }
        // })

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

type userDepProps = {
    depid: number
    userid: string
}

export async function updateUserDepartment(userDep: userDepProps) {
    
    try {

        await prisma.$queryRaw`UPDATE "USER" SET DEPID = ${userDep.depid} WHERE USERID=${userDep.userid}`

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
            data: users
        }
    } catch (error: unknown) {
        return {
            error: catchErrorMessage(error)
        }
    }

}

// export async function searchUsers({
//     userId,
//     searchString = "",
//     pageNumber = 1,
//     pageSize = 20,
//     sortBy = "desc"
// }: {
//     userId: string
//     searchString?: string,
//     pageNumber?: number,
//     pageSize?: number,
//     sortBy?: string
// }){

//     try {

//         const skipAmount = (pageNumber - 1) * pageSize;

//         const regex = new RegExp(searchString, "i")

//         let query: any = {
//             where: {
//                 NOT: {
//                     id: userId
//                 },
//             },
//             orderBy: {
//                 name: sortBy
//             },
//             skip: skipAmount,
//             take: pageSize,
//         }

//         if (searchString.trim() !== '') {
            
//             query.where.OR = [
//                 { username: { $regex: regex } },
//                 { name: {$regex: regex} }
//             ]

//         }

//         const data = await prisma.user.findMany(query)

//         const totalCount = await prisma.user.findMany();

//         const isNext = totalCount.length > skipAmount + data.length

//         return {data, isNext}

//     } catch (error: any) {
//         throw new Error(`Failed to update user: ${error.message}`)
//     }
// }