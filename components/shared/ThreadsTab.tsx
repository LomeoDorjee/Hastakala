// import { fetchUserThread } from "@/lib/actions/thread.actions"
// import { redirect } from "next/navigation"
// import ThreadCard from "@/components/cards/ThreadCard"

// interface Params{
//     currentUserId: string
//     accountId: string
//     accountType: string
// }

// export default async function ThreadsTab({
//     currentUserId,
//     accountId,
//     accountType,
// }: Params) {

//     let result = await fetchUserThread(accountId)
//     if( !result ) redirect('/')

//     return (
//         <section className="mt-9 flex flex-col gap-10">
//             {
//                 result.map((res: any) => {
//                     return (
//                         <ThreadCard
//                             key={ res.id }
//                             id={ res.id }
//                             currentUserId={currentUserId}
//                             content={ res.text }
//                             author={
//                                 {
//                                     name: res.author.name,
//                                     image: res.author.image,
//                                     id: res.author.id,
//                                     email: res.author.email,
//                                     username: res.author.username,
//                                     bio: res.author.bio,
//                                     onboarded: res.author.onboarded
//                                 }
//                              }
//                             communityId={ res.communityId }
//                             createdAt={ res.createdAt }
//                         />
//                     )
//                 })
//             }
//         </section>
//     )    
// }