import {Card, CardHeader, CardBody, CardFooter, Image, Button, Link} from "@nextui-org/react"
import { currentUser } from "@clerk/nextjs"
import { fetchUserInfo } from "@/lib/actions/user.actions"
import { redirect } from "next/navigation"

export default async function Home() {

    return (
        <div className="max-w-[900px] gap-5 grid grid-cols-12 grid-rows-2 px-8">
            <Card className="col-span-12 sm:col-span-6 h-[250px]">
                <Link href="/">
                    <CardHeader className="absolute z-10 top-1 flex-col !items-start">
                        <p className="text-tiny uppercase font-bold">Home</p>
                        <h4 className="font-medium text-large">Association for Craft Producers</h4>
                    </CardHeader>
                    <Image
                        removeWrapper
                        alt="Card background"
                        className="z-0 w-full h-full object-cover"
                        src="/assets/images/main-logo.jpeg"
                    />
                </Link>  
            </Card>
            <Card className="col-span-12 sm:col-span-6 h-[250px]">
                <Link href="/pis">
                    <CardHeader className="absolute z-10 top-1 flex-col !items-start">
                        <p className="text-tiny uppercase font-bold">PIS</p>
                        <h4 className="font-medium text-large">Personal Information System</h4>
                    </CardHeader>
                    <Image
                        removeWrapper
                        alt="Card background"
                        className="z-0 w-full h-full object-cover"
                        src="/assets/svg/pis-main.svg"
                    />
                </Link>  
            </Card>
            <Card isFooterBlurred className="w-full h-[250px] col-span-12 sm:col-span-5">
                <CardHeader className="absolute z-10 top-1 flex-col items-start">
                    <p className="text-tiny uppercase font-bold">Other</p>
                    <h4 className="text-black font-medium text-xl text-white">Product Tracking</h4>
                </CardHeader>
                <Image
                    removeWrapper
                    alt="Card example background"
                    className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
                    src="/images/card-example-6.jpeg"
                />
                <CardFooter className="absolute bg-white/30 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
                    <div>
                    <p className="text-black text-tiny">Coming soon.</p>
                    <p className="text-black text-tiny">Additional Features.</p>
                    </div>
                    {/* <Button className="text-tiny" color="primary" radius="full" size="sm">
                    Notify Me
                    </Button> */}
                </CardFooter>
            </Card>
            <Card isFooterBlurred className="w-full h-[250px] col-span-12 sm:col-span-7">
                <CardHeader className="absolute z-10 top-1 flex-col items-start">
                    <p className="text-tiny">The Association for Craft Producers is a Fair Trade Organization in Nepal that supports low-income artisans with design, marketing, and technical services. We blend traditional craft with modern design and offer a flexible program for creative collaboration. ACP provides various benefits and programs for their producers' welfare and conservation of the environment.</p>
                    <h4 className="font-medium text-xl">Crafting a Better Future for Nepalese Artisans</h4>
                </CardHeader>
                <Image
                    removeWrapper
                    alt="Relaxing app background"
                    className="z-0 w-full h-full object-cover"
                    src="/images/card-example-5.jpeg"
                />
                <CardFooter className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
                    <div className="flex flex-grow gap-2 items-center">
                        <div className="flex flex-col">
                            <p className="text-tiny text-white/60">Official Website</p>
                            <p className="text-tiny text-white/60">Browse the Official site now.</p>
                        </div>
                    </div>
                    <Link href='https://www.acp.org.np/' target="_blank" className="rounded-full bg-pink-800 px-3 py-1 text-white">View</Link>
                </CardFooter>
            </Card>
    </div>
    );
}