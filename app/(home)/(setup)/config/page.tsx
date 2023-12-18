import { Card, CardFooter, Button, Link } from "@nextui-org/react";
import Image from "next/image";
export default function Page() {
    
    return (
        <div className="gap-5 grid grid-cols-12 pt-5">
            <Card
                isFooterBlurred
                radius="lg"
                className="col-span-6 sm:col-span-3"
            >
                <Image
                    alt="Personal Information System"
                    className="object-cover"
                    src="/assets/svg/user.svg"
                    height={500}
                    width={300}
                />
                <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                    <p className="text-tiny text-white/80">Users.</p>
                    <Link href="/config/user" className="text-tiny text-white rounded-full px-4 py-2 bg-primary" color="primary">
                        View
                    </Link>
                </CardFooter>
            </Card>
            <Card
                isFooterBlurred
                radius="lg"
                className="col-span-6 sm:col-span-3"
            >
                <Image
                    alt="Others"
                    className="object-cover"
                    src="/assets/svg/department.svg"
                    fill
                />
                <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                    <p className="text-tiny text-white/80">Department.</p>
                    <Link href="/config/department" className="text-tiny text-white rounded-full px-4 py-2 bg-primary" color="primary">
                        View
                    </Link>
                </CardFooter>
            </Card>
            <Card
                isFooterBlurred
                radius="lg"
                className="col-span-6 sm:col-span-3"
            >
                <Image
                    alt="Others"
                    className="object-cover"
                    src="/assets/svg/product.svg"
                    fill
                />
                <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                    <p className="text-tiny text-white/80">Product.</p>
                    <Link href="/config/product" className="text-tiny text-white rounded-full px-4 py-2 bg-primary" color="primary">
                        View
                    </Link>
                </CardFooter>
            </Card>
            <Card
                isFooterBlurred
                radius="lg"
                className="col-span-6 sm:col-span-3"
            >
                <Image
                    alt="Weight"
                    className="object-cover"
                    src="/assets/svg/scale.svg"
                    height={500}
                    width={300}
                />
                <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                    <p className="text-tiny text-white/80">Marks Weight.</p>
                    <Link href="/evaluation/setup/weight" className="text-tiny text-white rounded-full px-4 py-2 bg-primary" color="primary">
                        View
                    </Link>
                </CardFooter>
            </Card>
            <Card
                isFooterBlurred
                radius="lg"
                className="col-span-6 sm:col-span-3"
            >
                <Image
                    alt="Weight"
                    className="object-cover"
                    src="/assets/svg/criterias.svg"
                    height={500}
                    width={300}
                />
                <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                    <p className="text-tiny text-white/80">Criteria Update.</p>
                    <Link href="/evaluation/setup/criterias" className="text-tiny text-white rounded-full px-4 py-2 bg-primary" color="primary">
                        View
                    </Link>
                </CardFooter>
            </Card>
            <Card
                isFooterBlurred
                radius="lg"
                className="col-span-6 sm:col-span-3"
            >
                <Image
                    alt="Weight"
                    className="object-cover"
                    src="/assets/svg/eligible.svg"
                    height={500}
                    width={300}
                />
                <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                    <p className="text-tiny text-white/80">Eligibility Update.</p>
                    <Link href="/evaluation/setup/eligibility" className="text-tiny text-white rounded-full px-4 py-2 bg-primary" color="primary">
                        View
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}