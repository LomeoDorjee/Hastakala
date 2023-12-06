import {Card, CardFooter, Image, Button, Link} from "@nextui-org/react";
export default function Page() {
    
    return (
        <div className="gap-10 grid grid-cols-12 pt-10">
            <Card
                isFooterBlurred
                radius="lg"
                className="border-none col-span-6 sm:col-span-4"
            >
                <Image
                    alt="Personal Information System"
                    className="object-cover"
                    height={350}
                    src="/assets/svg/device-log.svg"
                    width={350}
                />
                <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                    <p className="text-tiny">Attendance Device Logs.</p>
                    <Link href="/pis/attendance" className="text-tiny rounded-full px-4 py-2 bg-primary text-dark" color="primary">
                        View
                    </Link>
                </CardFooter>
            </Card>
            <Card
                isFooterBlurred
                radius="lg"
                className="border-none col-span-6 sm:col-span-4"
            >
                <Image
                    alt="Staff List"
                    className="object-cover"
                    height={350}
                    src="/assets/svg/users.svg"
                    width={350}
                />
                <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                    <p className="text-tiny">Staff List.</p>
                    <Link href="/pis/staffs" className="text-tiny rounded-full px-4 py-2 bg-primary text-dark" color="primary">
                        View
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}