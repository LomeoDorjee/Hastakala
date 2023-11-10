// "use client"
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
// import { topbarLinks } from '@/constants'
import { usePathname, useRouter } from 'next/navigation'

function Topbar() {

    // const pathname = usePathname()

    return (
        <nav className='fixed top-0 z-30 flex w-full items-center justify-between p-4'>
            <Link href="/" className='flex items-center gap-4'>
                <Image src="/assets/logo.svg" alt="logo" width={28} height={28} />
                <p className='font-bold text-light-1 max-xs:hidden'>{process.env.NEXT_PUBLIC_APP_NAME}</p>
            </Link>

            {/* <div className="flex flex-row gap-2">
            {
                    topbarLinks.map((link) => {
                        // check Active Link
                        const isActive = (
                            pathname.includes(link.route) && link.route.length > 1
                        ) || pathname === link.route

                        return (
                            <Link
                                href={link.route}
                                className={`relative flex justify-start gap-4 rounded-lg p-4 ${isActive && 'border-b-2 border-pink-800'} `}
                                key={link.label}
                            >
                                <Image
                                    src={link.imgURL}
                                    alt={link.label}
                                    width={24}
                                    height={24}
                                />
                                <p className='text-light-1 max-lg:hidden'>
                                    {link.label}
                                </p>
                                
                            </Link>
                        )
                    })
                }
            </div> */}
            
            <div className="flex items-center gap-1">

                {/* <div className="block md:hidden">
                    <SignedIn>
                        <SignOutButton>
                            <div className="flex cursor-pointer">
                                <Image src="/assets/logout.svg"
                                    alt='logout'
                                    width={24}  
                                    height={24}
                                />  
                            </div>
                        </SignOutButton>
                    </SignedIn>
                </div> */}

                <div className="block">
                    <SignedIn>
                        <UserButton />
                    </SignedIn>

                    <SignedOut>
                        <div className="inline-flex gap-2">
                            <Link
                                href="/sign-in"
                                className="bg-transparent hover:bg-pink-800 text-white-800 font-bold py-2 px-4 rounded-full border-2 border-pink-800">
                                Login
                            </Link>
                            <Link
                                href="/sign-up"
                                className="bg-transparent hover:bg-pink-800 text-light-800 font-bold py-2 px-4 rounded-full border-2 border-pink-800">
                                Register
                            </Link>
                        </div>
                    </SignedOut>
                </div>
                
            </div>
            
        </nav>
    )
}

export default Topbar