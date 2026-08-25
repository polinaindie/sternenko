import type { Meta, StoryObj } from "@storybook/react-vite"

import { Checkbox } from "@workspace/ui/components/checkbox"
import { Label } from "@workspace/ui/components/label"

const meta = {
  title: "Components/Label",
  component: Label,
  tags: ["autodocs"],
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="accept" defaultChecked />
      <Label htmlFor="accept">Accept terms and conditions</Label>
    </div>
  ),
}
