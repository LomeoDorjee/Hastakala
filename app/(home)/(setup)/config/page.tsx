import { Card, CardFooter, Button, Link } from "@nextui-org/react";
import Image from "next/image";
export default function Page() {
    
    return (
        <div className="max-w-[1200px] gap-10 grid grid-cols-12">
            <Card
                isFooterBlurred
                radius="lg"
                className="border-none col-span-6 sm:col-span-4 text-center"
            >
                <Image
                    alt="Personal Information System"
                    className="object-cover"
                    src="/assets/svg/user.svg"
                    height={500}
                    width={300}
                />
                <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                    <p className="text-tiny text-black/80">Users.</p>
                    <Link href="/config/user" className="text-tiny text-white rounded-full px-4 py-2 bg-primary" color="primary">
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
                    alt="Others"
                    className="object-cover"
                    src="/assets/svg/department.svg"
                    fill
                />
                <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                    <p className="text-tiny text-black/80">Department.</p>
                    <Link href="/config/department" className="text-tiny text-white rounded-full px-4 py-2 bg-primary" color="primary">
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
                    alt="Others"
                    className="object-cover"
                    src="/assets/svg/product.svg"
                    fill
                />
                <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                    <p className="text-tiny text-black/80">Product.</p>
                    <Link href="/config/product" className="text-tiny text-white rounded-full px-4 py-2 bg-primary" color="primary">
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
                    alt="Others"
                    className="object-cover"
                    src="/assets/svg/development.svg"
                    fill
                />
                <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                    <p className="text-tiny text-white/80">Department.</p>
                    <Button className="text-tiny text-white bg-black/20" variant="flat" color="default" radius="lg" size="sm" isDisabled>
                        Under Development
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}