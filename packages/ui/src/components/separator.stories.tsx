import type { Meta, StoryObj } from "@storybook/react-vite"

import { Separator } from "@workspace/ui/components/separator"

const meta = {
  title: "Components/Separator",
  component: Separator,
  tags: ["autodocs"],
} satisfies Meta<typeof Separator>

export default meta
type Story = StoryObj<typeof meta>

export const Horizontal: Story = {
  render: () => (
    <div className="w-64 text-sm">
      <p>Top section</p>
      <Separator className="my-3" />
      <p>Bottom section</p>
    </div>
  ),
}

export const Vertical: Story = {
  render: () => (
    <div className="flex h-6 items-center gap-3 text-sm">
      <span>Docs</span>
      <Separator orientation="vertical" />
      <span>Guides</span>
      <Separator orientation="vertical" />
      <span>API</span>
    </div>
  ),
}
