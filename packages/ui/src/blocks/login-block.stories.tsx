import type { Meta, StoryObj } from "@storybook/react-vite"

import { LoginBlock } from "@workspace/ui/blocks/login-block"

const meta = {
  title: "Blocks/Login",
  parameters: { layout: "fullscreen" },
  render: () => <LoginBlock />,
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
