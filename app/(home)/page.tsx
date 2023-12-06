import { Card, CardHeader, CardBody, CardFooter, Button, Link, Image } from "@nextui-org/react"
import { SignInButton, SignUpButton, SignedIn, SignedOut, currentUser } from "@clerk/nextjs"
import { getUserDetail, onBoardUser, sessionUser } from "@/lib/actions/config/user.actions"

export default async function Home() {

    const currentuser = await currentUser()

    if (currentuser) {
        const user: {
            data: sessionUser[]
            error: string
        } = await getUserDetail(currentuser.id, 1)

        if (!user.data[0].onboarded) {
            const userData = {
                userid: currentuser.id,
                username: (currentuser.username) ? currentuser.username : "NoUserName"
            }
            await onBoardUser(userData)
        }
    }


    return (
        <>
            <SignedOut>
                <div className="relative overflow-hidden p-5 pb-0">
                    <div className="hidden lg:block w-full h-5/6 absolute right-3 top-10">
                        <div className="bg-[url('/assets/svg/logo.svg')] bg-contain z-20 w-full h-full bg-no-repeat bg-auto bg-right"></div>
                    </div>
                    <section id="hero" className="relative">
                        <div className="bg-[url('/assets/svg/logo.svg')] absolute z-20 w-full h-full bg-no-repeat bg-top -top-12 md:-top-16 lg:hidden bg-contain"></div>
                        <div className="container h-screen -mt-5 relative z-20 ">
                            <div className="h-full flex flex-col justify-end pb-0 lg:w-6/12 lg:justify-center">
                                <div className="h-1/2 flex flex-col justify-center items-center text-center lg:items-start lg:text-left">
                                    <h1 className="text-6xl lg:text-7xl text-primary-dark-blue pb-5 tracking-wide">
                                        Association for Craft Producers
                                    </h1>
                                    <p className="text-neutral-grayish-blue text-xs lg:text-base leading-5 mb-7 indent-8">
                                        A Fair Trade Organization in Nepal that supports low-income artisans with design, marketing, and technical services, blending traditional craft with modern design and offer a flexible program for creative collaboration.
                                    </p>
                                    <div className="flex gap-2">
                                        <Link href='https://www.acp.org.np/'
                                            target="_blank"
                                            className="bg-pink-900 text-white px-4 py-2 rounded-lg hover:bg-pink-600"
                                            showAnchorIcon
                                        >Official Website</Link>
                                        <Link
                                            href="/sign-in"
                                            className="bg-transparent hover:bg-pink-900 text-white-900 font-bold py-2 px-4 rounded-lg border-2 border-pink-900">
                                            Login
                                        </Link>
                                        <Link
                                            href="/sign-up"
                                            className="bg-transparent hover:bg-pink-900 text-light-900 font-bold py-2 px-4 rounded-lg border-2 border-pink-900">
                                            Register
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div >
            </SignedOut >
            <SignedIn>
                <div className="max-w-[1200px] gap-10 grid grid-cols-12 pt-8">


                    <Card className="col-span-6 sm:col-span-6 h-[250px]">
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

                    <Card className="col-span-6 sm:col-span-6 h-[250px]">
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

                    <Card className="col-span-6 sm:col-span-6 h-[250px]">
                        <Link href="/evaluation" color="warning">
                            <CardHeader className="absolute z-10 top-1 flex-col !items-start">
                                <p className="text-4xl uppercase font-bold">Evaluation</p>
                                <h4 className="font-medium text-large">Performance Evaluation</h4>
                            </CardHeader>
                            <Image
                                removeWrapper
                                alt="Card background"
                                className="z-0 w-full h-full object-cover"
                                src="/assets/svg/scale.svg"
                                isZoomed
                            />
                        </Link>
                    </Card>

                    <Card className="col-span-6 sm:col-span-6 h-[250px]">
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

                </div>

            </SignedIn>
        </>
    );
}