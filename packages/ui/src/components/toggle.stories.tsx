import type { Meta, StoryObj } from "@storybook/react-vite"
import { BoldIcon } from "lucide-react"

import { Toggle } from "@workspace/ui/components/toggle"

const meta = {
  title: "Components/Toggle",
  component: Toggle,
  tags: ["autodocs"],
  render: () => (
    <Toggle aria-label="Toggle bold">
      <BoldIcon />
    </Toggle>
  ),
} satisfies Meta<typeof Toggle>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithText: Story = {
  render: () => <Toggle aria-label="Toggle bold">Bold</Toggle>,
}
