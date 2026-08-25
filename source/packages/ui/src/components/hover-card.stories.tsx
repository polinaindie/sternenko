import type { Meta, StoryObj } from "@storybook/react-vite"

import { Button } from "@workspace/ui/components/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@workspace/ui/components/hover-card"

const meta = {
  title: "Components/Hover Card",
  component: HoverCard,
  tags: ["autodocs"],
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">@design-system</Button>
      </HoverCardTrigger>
      <HoverCardContent>
        <p className="font-medium">Design System</p>
        <p className="text-muted-foreground text-sm">
          One component library, re-skinned per brand via tokens.
        </p>
      </HoverCardContent>
    </HoverCard>
  ),
} satisfies Meta<typeof HoverCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
