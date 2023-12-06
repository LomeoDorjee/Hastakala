"use client"
import { sidebarLinks } from '@/constants'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { SignOutButton, SignedIn, useAuth } from '@clerk/nextjs'
import { Tooltip, Link } from '@nextui-org/react'

function LeftSidebar() {
    const router = useRouter()
    const pathname = usePathname()
    const { userId } = useAuth()

    return (
        <section className='sticky left-0 top-0 z-20 flex h-screen w-fit flex-col justify-between overflow-auto border-r border-slate-950 pb-5 pt-20 max-md:hidden custom-scrollbar'>
            <div className="flex w-full flex-1 flex-col gap-5 px-3">
                {
                    sidebarLinks.map((link) => {
                        // check Active Link
                        const isActive = (
                            pathname.includes(link.route) && link.route.length > 1
                        ) || pathname === link.route

                        if (link.route === '/profile')
                            link.route = `/profile/${userId}`
                        return (
                            <Tooltip content={link.label} placement='right-end' offset={-7} color='foreground' showArrow={true}>
                                <Link
                                    href={link.route}
                                    className={`relative flex justify-start gap-4 rounded-lg p-4 hover:shadow-xl ${isActive && 'shadow-xl border-b-2 border-l-2 border-pink-700'} `}
                                    key={link.label}
                                >
                                    <Image
                                        src={link.imgURL}
                                        alt={link.label}
                                        width={24}
                                        height={24}
                                        className='dark'
                                    />
                                </Link>
                            </Tooltip>
                        )
                    })
                }
            </div>

            {/* <div className="mt-10 px-5"> */}
            {/* <SignedIn> */}
            {/* <SignOutButton signOutCallback={() => {
                        router.push('/sign-in')
                    }}> */}
            {/* <div className="flex cursor-pointer gap-4 p-4 items-center justify-between">
                            <Image src="/assets/svg/logout.svg"
                                alt='logout'
                                width={24}
                                height={24}
                            />
                        </div>
                    </SignOutButton>
                </SignedIn>
            </div >  */}
        </section>
    )
}

export default LeftSidebar