import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"

const meta = {
  title: "Components/Select",
  component: Select,
  tags: ["autodocs"],
  render: () => (
    <Select>
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Choose a plan" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="free">Free</SelectItem>
        <SelectItem value="pro">Pro</SelectItem>
        <SelectItem value="enterprise">Enterprise</SelectItem>
      </SelectContent>
    </Select>
  ),
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
