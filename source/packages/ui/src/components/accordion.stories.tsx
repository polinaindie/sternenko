import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion"

const meta = {
  title: "Components/Accordion",
  render: () => (
    <Accordion type="single" collapsible className="w-72">
      <AccordionItem value="item-1">
        <AccordionTrigger>Product Information</AccordionTrigger>
        <AccordionContent>
          Details about the product, shipping and returns.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Shipping Details</AccordionTrigger>
        <AccordionContent>Ships in 2–3 business days.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
