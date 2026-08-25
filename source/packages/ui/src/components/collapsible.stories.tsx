import type { Meta, StoryObj } from "@storybook/react-vite"

import { Button } from "@workspace/ui/components/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/collapsible"

const meta = {
  title: "Components/Collapsible",
  component: Collapsible,
  tags: ["autodocs"],
  render: () => (
    <Collapsible className="w-72">
      <CollapsibleTrigger asChild>
        <Button variant="outline">Toggle details</Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="text-muted-foreground pt-2 text-sm">
        Hidden content that expands and collapses.
      </CollapsibleContent>
    </Collapsible>
  ),
} satisfies Meta<typeof Collapsible>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
