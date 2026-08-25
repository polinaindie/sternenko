import type { Meta, StoryObj } from "@storybook/react-vite"

import { Label } from "@workspace/ui/components/label"
import { RadioGroup, RadioGroupItem } from "@workspace/ui/components/radio-group"

const meta = {
  title: "Components/Radio Group",
  component: RadioGroup,
  tags: ["autodocs"],
  render: () => (
    <RadioGroup defaultValue="all" className="w-56 gap-2">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="all" id="r-all" />
        <Label htmlFor="r-all" className="font-normal">
          All notifications
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="mentions" id="r-mentions" />
        <Label htmlFor="r-mentions" className="font-normal">
          Mentions only
        </Label>
      </div>
    </RadioGroup>
  ),
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
