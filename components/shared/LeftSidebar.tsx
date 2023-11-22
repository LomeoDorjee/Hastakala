"use client"
import { sidebarLinks } from '@/constants'
import Link from "next/link"
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { SignOutButton, SignedIn, useAuth } from '@clerk/nextjs'

function LeftSidebar() {
    const router = useRouter()
    const pathname = usePathname()
    const { userId } = useAuth()

    return (
        <section className='sticky left-0 top-0 z-20 flex h-screen w-fit flex-col justify-between overflow-auto border-r border-r-dark-4 pb-5 pt-20 max-md:hidden custom-scrollbar'>
            <div className="flex w-full flex-1 flex-col gap-6 px-6">
                {
                    sidebarLinks.map((link) => {
                        // check Active Link
                        const isActive = (
                            pathname.includes(link.route) && link.route.length > 1
                        ) || pathname === link.route

                        if (link.route === '/profile')
                            link.route = `/profile/${userId}`
                        return (
                            <Link
                                href={link.route}
                                className={`relative flex justify-start gap-4 rounded-lg p-4 hover:shadow-inner ${isActive && 'shadow-xl border-b-2 border-l-2 border-pink-700'} `}
                                key={link.label}
                            >
                                <Image
                                    src={link.imgURL}
                                    alt={link.label}
                                    width={24}
                                    height={24}
                                    className='dark'
                                />
                                <p className='text-light-1 max-lg:hidden'>
                                    {link.label}
                                </p>
                                
                            </Link>
                        )
                    })
                }
            </div>

            <div className="mt-10 px-5">
                <SignedIn>
                    <SignOutButton signOutCallback={() => {
                        router.push('/sign-in')
                    }}>
                        <div className="flex cursor-pointer gap-4 p-4">
                            <Image src="/assets/svg/logout.svg"
                                alt='logout'
                                width={24}
                                height={24}
                            />
                            <p className='text-light-2 max-lg:hidden'>Logout</p>
                        </div>
                    </SignOutButton>
                </SignedIn>
            </div>
        </section>
    )
}

export default LeftSidebar