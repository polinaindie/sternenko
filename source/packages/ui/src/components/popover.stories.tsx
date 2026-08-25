import type { Meta, StoryObj } from "@storybook/react-vite"

import { Button } from "@workspace/ui/components/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover"

const meta = {
  title: "Components/Popover",
  component: Popover,
  tags: ["autodocs"],
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <p className="font-medium">Quick settings</p>
        <p className="text-muted-foreground">
          Popovers reuse the popover and ring tokens.
        </p>
      </PopoverContent>
    </Popover>
  ),
} satisfies Meta<typeof Popover>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
