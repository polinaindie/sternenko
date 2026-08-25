import type { Meta, StoryObj } from "@storybook/react-vite"

import { Textarea } from "@workspace/ui/components/textarea"

const meta = {
  title: "Components/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  args: { placeholder: "Tell us what you think…" },
  render: (args) => <Textarea {...args} className="w-72" />,
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
