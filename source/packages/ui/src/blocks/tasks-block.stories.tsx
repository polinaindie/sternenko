import type { Meta, StoryObj } from "@storybook/react-vite"

import { TasksBlock } from "@workspace/ui/blocks/tasks-block"

const meta = {
  title: "Examples/Tasks",
  parameters: { layout: "fullscreen" },
  render: () => <TasksBlock />,
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
