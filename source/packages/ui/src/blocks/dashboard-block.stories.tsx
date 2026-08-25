import type { Meta, StoryObj } from "@storybook/react-vite"

import { DashboardBlock } from "@workspace/ui/blocks/dashboard-block"

const meta = {
  title: "Examples/Dashboard",
  parameters: { layout: "fullscreen" },
  render: () => <DashboardBlock />,
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
