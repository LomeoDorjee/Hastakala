import { Accordion, AccordionItem } from "@nextui-org/react";

export default function Page() {

    return (
        <Accordion variant="splitted">
            <AccordionItem key="1" aria-label="Accordion 1" title="Accordion 1">
                a
            </AccordionItem>
            <AccordionItem key="2" aria-label="Accordion 2" title="Accordion 2">
                a
            </AccordionItem>
            <AccordionItem key="3" aria-label="Accordion 3" title="Accordion 3">
                a
            </AccordionItem>
        </Accordion>
    )
}