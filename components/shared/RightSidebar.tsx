"use client"
import { sidebarLinks } from '@/constants'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { SignOutButton, SignedIn, UserButton, useAuth } from '@clerk/nextjs'
import { Tooltip, Link, Dropdown, DropdownTrigger, Button, DropdownMenu, DropdownItem } from '@nextui-org/react'
import { ChevronDownIcon } from '../icons/icons'

function RightSidebar() {
    const router = useRouter()
    const pathname = usePathname()
    const { userId } = useAuth()

    return (
        <section className='sticky right-0 top-0 z-20 flex h-screen w-fit flex-col justify-center items-center overflow-auto border-l border-slate-950 pb-5 pt-5 max-md:hidden custom-scrollbar'>
            <div className="flex w-full flex-1 flex-col gap-3 px-2 justify-center items-center">
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
                                    <div className={`flex gap-0 justify-start rounded-lg p-2 pr-0 hover:shadow-xl ${isActive && 'shadow-xl border-b-2 border-l-2 border-pink-800'} `}>

                                        <Link href={link.route}>
                                            <Image
                                                src={link.imgURL}
                                                alt={link.label}
                                                width={24}
                                                height={24}
                                            />
                                        </Link>
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
                                                                <DropdownItem key={dd.label} href={dd.route} startContent={
                                                                    <Image
                                                                        src={dd.imgURL}
                                                                        alt={dd.label}
                                                                        width={16}
                                                                        height={16}
                                                                    />
                                                                }
                                                                    showDivider={dd.showDivider}
                                                                >
                                                                    {dd.label}
                                                                </DropdownItem>
                                                            )
                                                        }) : (
                                                            <></>
                                                        )
                                                }
                                            </DropdownMenu>

                                        </Dropdown>

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
            <Tooltip
                content="Home"
                placement='left-end'
                offset={-7}
                color='foreground'
                showArrow={true}
            >
                <Link href="/" className={`flex gap-0 items-center justify-center rounded-lg p-4 pb-0 w-full hover:shadow-xl ${pathname === "/" && 'shadow-xl border-b-2  border-pink-800 pb-2'} `}>
                    <Image src="/assets/svg/logo.svg" alt="logo" width={30} height={30} />
                </Link>
            </Tooltip>

        </section>
    )
}

export default RightSidebar