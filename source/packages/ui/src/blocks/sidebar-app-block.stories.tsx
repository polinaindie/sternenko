import type { Meta, StoryObj } from "@storybook/react-vite"

import { SidebarAppBlock } from "@workspace/ui/blocks/sidebar-app-block"

const meta = {
  title: "Blocks/Sidebar",
  parameters: { layout: "fullscreen" },
  render: () => <SidebarAppBlock />,
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
