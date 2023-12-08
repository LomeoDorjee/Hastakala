"use client"
import { sidebarLinks } from '@/constants'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { SignOutButton, SignedIn, useAuth } from '@clerk/nextjs'
import { Tooltip, Link, Dropdown, DropdownTrigger, Button, DropdownMenu, DropdownItem } from '@nextui-org/react'
import { ChevronDownIcon } from '../icons/icons'

function LeftSidebar() {
    const router = useRouter()
    const pathname = usePathname()
    const { userId } = useAuth()

    return (
        <section className='sticky left-0 top-0 z-20 flex h-screen w-fit flex-col justify-between overflow-auto border-r border-slate-950 pb-5 pt-20 max-md:hidden custom-scrollbar'>
            <div className="flex w-full flex-1 flex-col gap-3 px-2">
                {
                    sidebarLinks.map((link) => {
                        // check Active Link
                        const isActive = (
                            pathname.includes(link.route) && link.route.length > 1
                        ) || pathname === link.route

                        if (link.route === '/profile')
                            link.route = `/profile/${userId}`

                        if (link.isDropDown) {

                            return (
                                <Tooltip
                                    content={link.label}
                                    placement='right-end'
                                    offset={-7}
                                    color='foreground'
                                    showArrow={true}
                                    key={link.label}
                                >
                                    <div className={`flex gap-0 justify-start rounded-lg p-2 pl-0 hover:shadow-xl ${isActive && 'shadow-xl border-b-2 border-l-2 border-pink-800'} `}>

                                        <Dropdown>
                                            <DropdownTrigger>
                                                <Button
                                                    variant='light'
                                                    className=''
                                                    size='sm'
                                                    isIconOnly
                                                >
                                                    <ChevronDownIcon />
                                                </Button>
                                            </DropdownTrigger>
                                            <DropdownMenu aria-label="Link Actions" variant='flat'>
                                                {
                                                    (link.items.length > 0) ?
                                                        link?.items.map((dd) => {
                                                            return (
                                                                <DropdownItem key={dd.label} href={dd.route}>
                                                                    {dd.label}
                                                                </DropdownItem>
                                                            )
                                                        }) : (
                                                            <></>
                                                        )
                                                }
                                            </DropdownMenu>

                                        </Dropdown>

                                        <Link href={link.route}>
                                            <Image
                                                src={link.imgURL}
                                                alt={link.label}
                                                width={24}
                                                height={24}
                                            />
                                        </Link>

                                    </div>

                                </Tooltip>
                            )
                        } else {
                            return (
                                <Tooltip
                                    content={link.label}
                                    placement='right-end'
                                    offset={-7}
                                    color='foreground'
                                    showArrow={true}
                                    key={link.label}>
                                    <Link
                                        href={link.route}
                                        className={`relative flex justify-start gap-4 rounded-lg p-4 hover:shadow-xl ${isActive && 'shadow-xl border-b-2 border-l-2 border-pink-800'} `}
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
                        }
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