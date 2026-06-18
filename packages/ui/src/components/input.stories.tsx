import type { Meta, StoryObj } from "@storybook/react-vite"

import { Input } from "@workspace/ui/components/input"

const meta = {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
  args: { placeholder: "you@example.com" },
  render: (args) => <Input {...args} className="w-64" />,
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Disabled: Story = { args: { disabled: true, value: "Disabled" } }
