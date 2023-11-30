import { Accordion, AccordionItem } from "@nextui-org/react";

export default function Page() {

    return (
        <Accordion variant="splitted">
            <AccordionItem key="1" aria-label="Accordion 1" title="Accordion 1">
                AAA
            </AccordionItem>
            <AccordionItem key="2" aria-label="Accordion 2" title="Accordion 2">
                BBB
            </AccordionItem>
            <AccordionItem key="3" aria-label="Accordion 3" title="Accordion 3">
                CCC
            </AccordionItem>
        </Accordion>
    )
}