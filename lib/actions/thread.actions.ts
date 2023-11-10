// "use server"

// import { prisma } from "@/lib/db"

// import { revalidatePath } from "next/cache"

// interface Params {
//     author: string,
//     text: string,
//     communityId: string | null,
//     path: string
// }

// export async function createThread({
//     author,
//     text,
//     communityId,
//     path
// }: Params): Promise<void>{

//     try {
//         const createdThread = await prisma.thread.create({
//             data: {
//                 text,
//                 authorId: author,
//                 // community: undefined,
//             }
//         })

//         // const updateUser = await prisma.user.update({
//         //     where: {
//         //         id: author,
//         //     },
//         //     data: {
//         //         threads: createdThread.id,
//         //     },
//         // })
        
//         revalidatePath(path)

//     } catch (error: any) {
//         throw new Error(`Failed to update user: ${error.message}`)
//     }
// }


// export async function fetchThreads(pageNumber = 1, pageSize = 10) {
    
//     try {

//         const skipAmount = (pageNumber - 1) * pageSize;

//         const data = await prisma.thread.findMany({
//             // where: {
//             //     authorId: userId
//             // },
//             orderBy: {
//                 id: "desc"
//             },
//             skip: skipAmount,
//             take: pageSize,
//             include: {
//                 author: true
//             }
//         })

//         const totalCount = await prisma.thread.findMany();

//         const isNext = totalCount.length > skipAmount + data.length

//         return {data, isNext}

//     } catch (error) {
//         throw error
//     }

// }


// export async function fetchThreadById(id: number) {
    
//     try {
//         return await prisma.thread.findUnique({
//             where: { id: Number(id) },
//             include: { author: true }
//         })

//     } catch (error) {
//         throw error
//     }

// }

// export async function fetchUserThread(userid: string) {
    
//     try {
//         return await prisma.thread.findMany({
//             where: { authorId: userid },
//             orderBy: { id: "desc" },
//             include: { author: true }
//         })

//     } catch (error) {
//         throw error
//     }

// }