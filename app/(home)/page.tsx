import {Card, CardHeader, CardBody, CardFooter, Image, Button, Link} from "@nextui-org/react"
import { SignedIn } from "@clerk/nextjs"

export default async function Home() {

    return (
        <div className="max-w-[1200px] gap-5 grid grid-cols-12 pt-10">

            <SignedIn>
                <Card className="col-span-6 sm:col-span-4 h-[250px]">
                    <Link href="/pis" color="secondary">
                        <CardHeader className="absolute z-10 top-1 flex-col !items-start">
                            <p className="text-4xl uppercase font-bold">PIS</p>
                            <h4 className="font-medium text-large">Personal Information System</h4>
                        </CardHeader>
                        <Image
                            removeWrapper
                            alt="Card background"
                            className="z-0 w-full h-full object-cover"
                            src="/assets/svg/pis-main.svg"
                            isZoomed
                        />
                    </Link>
                </Card>

                <Card className="col-span-6 sm:col-span-4 h-[250px]">
                    <Link href="/transfer" color="warning">
                        <CardHeader className="absolute z-10 top-1 flex-col !items-start">
                            <p className="text-4xl uppercase font-bold">Tracking</p>
                            <h4 className="font-medium text-large">Product Issue & Transfer Tracking</h4>
                        </CardHeader>
                        <Image
                            removeWrapper
                            alt="Card background"
                            className="z-0 w-full h-full object-cover"
                            src="/assets/svg/tracking.svg"
                            isZoomed
                        />
                    </Link>
                </Card>

                <Card className="col-span-6 sm:col-span-4 h-[250px]">
                    <Link href="/config" color="danger">
                        <CardHeader className="absolute z-10 top-1 flex-col !items-start">
                            <p className="text-4xl uppercase font-bold">Setup</p>
                            <h4 className="font-medium text-large">Configure Items</h4>
                        </CardHeader>
                        <Image
                            removeWrapper
                            alt="Card background"
                            className="z-0 w-full h-full object-contain"
                            src="/assets/svg/gear.svg"
                            isZoomed
                        />
                    </Link>
                </Card>
            </SignedIn>
            <Card isFooterBlurred className="w-full h-[250px] col-span-12 sm:col-span-12 mt-5">
                <CardHeader className="absolute z-10 top-1 flex-col items-start">
                    <p className="text-md">The Association for Craft Producers is a Fair Trade Organization in Nepal that supports low-income artisans with design, marketing, and technical services. We blend traditional craft with modern design and offer a flexible program for creative collaboration. ACP provides various benefits and programs for their producers' welfare and conservation of the environment.</p>
                    <h4 className="font-medium text-xl">Crafting a Better Future for Nepalese Artisans</h4>
                </CardHeader>
                <Image
                    removeWrapper
                    alt="Card background"
                    className="z-0 w-full h-full object-cover"
                    src="/assets/images/main-bg.jpg"
                />
                <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                    <div className="flex flex-grow gap-2 items-center">
                        <div className="flex flex-col">
                            <p className="text-tiny uppercase font-bold">Official Website</p>
                            <h4 className="font-medium text-large">Association for Craft Producers</h4>
                        </div>
                    </div>
                    <Link href='https://www.acp.org.np/' target="_blank" className="rounded-full bg-pink-800 px-3 py-1 text-white">Visit</Link>
                </CardFooter>
            </Card>

        </div>
    );
}