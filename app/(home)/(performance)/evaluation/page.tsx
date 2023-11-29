import { Card, CardFooter, Image, Button, Link } from "@nextui-org/react";
export default function Page() {

    return (
        <div className="max-w-[1200px] gap-5 grid grid-cols-12 mt-5">
            <Card
                isFooterBlurred
                radius="lg"
                className="border-none col-span-6 sm:col-span-3"
            >
                <Image
                    alt="Staffs"
                    className="object-contain"
                    height={300}
                    src="/assets/svg/users.svg"
                    width={300}
                />
                <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                    <p className="text-tiny">Staff List.</p>
                    <Link href="/pis/staffs" className="text-tiny rounded-full px-4 py-2 bg-primary text-dark" color="primary">
                        View
                    </Link>
                </CardFooter>
            </Card>
            <Card
                isFooterBlurred
                radius="lg"
                className="border-none col-span-6 sm:col-span-3"
            >
                <Image
                    alt="Marks"
                    className="object-contain"
                    height={300}
                    src="/assets/svg/marks.svg"
                    width={300}
                />
                <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                    <p className="text-tiny">Marks Record.</p>
                    <Link href="/evaluation/marks" className="text-tiny rounded-full px-4 py-2 bg-primary text-dark" color="primary">
                        View
                    </Link>
                </CardFooter>
            </Card>
            <Card
                isFooterBlurred
                radius="lg"
                className="border-none col-span-6 sm:col-span-3"
            >
                <Image
                    alt="Appraisal"
                    className="object-contain"
                    height={300}
                    src="/assets/svg/appraisal.svg"
                    width={300}
                />
                <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                    <p className="text-tiny">Appraisals.</p>
                    <Link href="/evaluation/appraisal" className="text-tiny rounded-full px-4 py-2 bg-primary text-dark" color="primary">
                        View
                    </Link>
                </CardFooter>
            </Card>
            <Card
                isFooterBlurred
                radius="lg"
                className="border-none col-span-6 sm:col-span-3"
            >
                <Image
                    alt="Service"
                    className="object-contain"
                    height={300}
                    src="/assets/svg/service.svg"
                    width={300}
                />
                <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                    <p className="text-tiny">Service Report.</p>
                    <Link href="/evaluation/service" className="text-tiny rounded-full px-4 py-2 bg-primary text-dark" color="primary">
                        View
                    </Link>
                </CardFooter>
            </Card>
            <Card
                isFooterBlurred
                radius="lg"
                className="border-none col-span-6 sm:col-span-3"
            >
                <Image
                    alt="Report"
                    className="object-contain"
                    height={300}
                    src="/assets/svg/report.svg"
                    width={300}
                />
                <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                    <p className="text-tiny">Final Report.</p>
                    <Link href="/evaluation/final" className="text-tiny rounded-full px-4 py-2 bg-primary text-dark" color="primary">
                        View
                    </Link>
                </CardFooter>
            </Card>
            <Card
                isFooterBlurred
                radius="lg"
                className="border-none col-span-6 sm:col-span-3"
            >
                <Image
                    alt="Personal Information System"
                    className="object-cover"
                    src="/assets/svg/development.svg"
                    height={300}
                    width={300}
                />
                <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                    <p className="text-tiny">Other Report.</p>
                    <Button className="text-tiny bg-black/20" variant="flat" color="default" radius="lg" size="sm" isDisabled>
                        Under Development
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}