import type { Meta, StoryObj } from "@storybook/react-vite"

import { Progress } from "@workspace/ui/components/progress"

const meta = {
  title: "Components/Progress",
  component: Progress,
  tags: ["autodocs"],
  args: { value: 62 },
  render: (args) => <Progress {...args} className="w-64" />,
} satisfies Meta<typeof Progress>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
