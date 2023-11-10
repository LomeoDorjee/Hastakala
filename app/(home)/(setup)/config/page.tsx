import {Card, CardFooter, Image, Button, Link} from "@nextui-org/react";
export default function Page() {
    
    return (
        <div className="max-w-[900px] gap-5 grid grid-cols-12 grid-rows-2 px-8">
            <Card
                isFooterBlurred
                radius="lg"
                className="border-none col-span-12 sm:col-span-6"
            >
                <Image
                    alt="Personal Information System"
                    className="object-cover"
                    height={300}
                    src="/assets/user.svg"
                    width={400}
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
                className="border-none col-span-12 sm:col-span-6"
            >
                <Image
                    alt="Personal Information System"
                    className="object-cover"
                    height={300}
                    src="/assets/svg/development.svg"
                    width={200}
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