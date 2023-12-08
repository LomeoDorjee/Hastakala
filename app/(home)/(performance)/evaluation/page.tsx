import { Card, CardFooter, Image, Button, Link, CardBody, CardHeader, Divider } from "@nextui-org/react";
export default function Page() {

    return (
        <div className="gap-5 grid grid-cols-12 pt-10">
            <Card
                isFooterBlurred
                radius="lg"
                className="border-none col-span-6 sm:col-span-4 flex items-center"
            >
                <Image
                    alt="Staffs"
                    className="object-contain"
                    height={150}
                    src="/assets/svg/users.svg"
                    width={150}
                />
                <CardFooter className="justify-start before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small z-10">
                    <Link href="/pis/staffs" className="rounded-sm px-4 py-2 w-full font-bold" color="foreground">
                        Staff List
                    </Link>
                    <Link href="/pis/staffs" isExternal showAnchorIcon color="warning"></Link>
                </CardFooter>
            </Card>
            <Card
                isFooterBlurred
                radius="lg"
                className="border-none col-span-6 sm:col-span-4 flex items-center"
            >
                <Image
                    alt="Marks"
                    className="object-contain"
                    height={150}
                    src="/assets/svg/marks.svg"
                    width={150}
                />
                <CardFooter className="justify-start before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small z-10">
                    <Link href="/evaluation/marks" className="rounded-sm px-4 py-2 w-full font-bold" color="foreground">
                        Marks Record
                    </Link>
                    <Link href="/evaluation/marks" isExternal showAnchorIcon color="warning"></Link>
                </CardFooter>
            </Card>
            <Card
                isFooterBlurred
                radius="lg"
                className="border-none col-span-6 sm:col-span-4 flex items-center"
            >
                <Image
                    alt="Average"
                    className="object-contain"
                    height={150}
                    src="/assets/svg/average.svg"
                    width={150}
                />
                <CardFooter className="justify-start before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small z-10">
                    <Link href="/evaluation/average" className="rounded-sm px-4 py-2 w-full font-bold" color="foreground">
                        Marks Average Analysis
                    </Link>
                    <Link href="/evaluation/average" isExternal showAnchorIcon color="warning"></Link>
                </CardFooter>
            </Card>
            <Card
                isFooterBlurred
                radius="lg"
                className="border-none col-span-6 sm:col-span-4 flex items-center"
            >
                <Image
                    alt="Service"
                    className="object-contain"
                    height={150}
                    src="/assets/svg/service.svg"
                    width={150}
                />
                <CardFooter className="justify-start before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small z-10">
                    <Link href="/evaluation/service" className="rounded-sm px-4 py-2 w-full font-bold" color="foreground">
                        Service Period
                    </Link>
                    <Link href="/evaluation/service" isExternal showAnchorIcon color="warning"></Link>
                </CardFooter>
            </Card>

            <Card
                isFooterBlurred
                radius="lg"
                className="border-none col-span-6 sm:col-span-4 flex items-center"
            >
                <Image
                    alt="Education"
                    className="object-contain"
                    height={150}
                    src="/assets/svg/education.svg"
                    width={150}
                />
                <CardFooter className="justify-start before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small z-10">
                    <Link href="/evaluation/education" className="rounded-sm px-4 py-2 w-full font-bold" color="foreground">
                        Education Record
                    </Link>
                    <Link href="/evaluation/education" isExternal showAnchorIcon color="warning"></Link>
                </CardFooter>
            </Card>


            <Card
                isFooterBlurred
                radius="lg"
                className="border-none col-span-6 sm:col-span-4 flex items-center"
            >
                <Image
                    alt="Report"
                    className="object-contain"
                    height={150}
                    src="/assets/svg/report.svg"
                    width={150}
                />
                <CardFooter className="justify-start before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small z-10">
                    <Link href="/evaluation/final" className="rounded-sm px-4 py-2 w-full font-bold" color="foreground">
                        Final Evaluation
                    </Link>
                    <Link href="/evaluation/final" isExternal showAnchorIcon color="warning"></Link>
                </CardFooter>
            </Card>

            <Card
                radius="lg"
                className="border-none col-span-12 sm:col-span-12"
            >
                <CardHeader className="w-full text-pink-700">
                    <p className="text-center w-full font-bold"> Administration</p>
                </CardHeader>
                <Divider />
                <CardBody className="grid gap-4 grid-cols-12">

                    <Card
                        isFooterBlurred
                        radius="lg"
                        className="border-none col-span-6 sm:col-span-3 flex items-center"
                    >
                        <Image
                            alt="Attendance"
                            className="object-contain"
                            height={100}
                            src="/assets/svg/attendance.svg"
                            width={100}
                        />
                        <CardFooter className="justify-start before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small z-10">
                            <Link href="/evaluation/leave" className="rounded-sm px-4 py-2 w-full font-bold" color="foreground">
                                Attendance Record
                            </Link>
                            <Link href="/evaluation/leave" isExternal showAnchorIcon color="warning"></Link>
                        </CardFooter>
                    </Card>

                    <Card
                        isFooterBlurred
                        radius="lg"
                        className="border-none col-span-6 sm:col-span-3 flex items-center"
                    >
                        <Image
                            alt="Appraisal"
                            className="object-contain"
                            height={100}
                            src="/assets/svg/appraisal.svg"
                            width={100}
                        />
                        <CardFooter className="justify-start before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small z-10">
                            <Link href="/evaluation/appraisal" className="rounded-sm px-4 py-2 w-full font-bold" color="foreground">
                                Promotion
                            </Link>
                            <Link href="/evaluation/appraisal" isExternal showAnchorIcon color="warning"></Link>
                        </CardFooter>
                    </Card>

                    <Card
                        isFooterBlurred
                        radius="lg"
                        className="border-none col-span-6 sm:col-span-3 flex items-center"
                    >
                        <Image
                            alt="Warning"
                            className="object-contain"
                            height={100}
                            src="/assets/svg/warning.svg"
                            width={100}
                        />
                        <CardFooter className="justify-start before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small z-10">
                            <Link href="/evaluation/warning" className="rounded-sm px-4 py-2 w-full font-bold" color="foreground">
                                Warnings
                            </Link>
                            <Link href="/evaluation/warning" isExternal showAnchorIcon color="warning"></Link>
                        </CardFooter>
                    </Card>

                    <Card
                        isFooterBlurred
                        radius="lg"
                        className="border-none col-span-6 sm:col-span-3 flex items-center"
                    >
                        <Image
                            alt="Admin Average"
                            className="object-contain"
                            height={100}
                            src="/assets/svg/scale.svg"
                            width={100}
                        />
                        <CardFooter className="justify-start before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small z-10">
                            <Link href="/evaluation/adminavg" className="rounded-sm px-4 py-2 w-full font-bold" color="foreground">
                                Average Analysis
                            </Link>
                            <Link href="/evaluation/adminavg" isExternal showAnchorIcon color="warning"></Link>
                </CardFooter>
            </Card>


                </CardBody>

            </Card>
        </div>
    )
}