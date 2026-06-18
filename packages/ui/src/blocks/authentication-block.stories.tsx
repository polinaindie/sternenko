import type { Meta, StoryObj } from "@storybook/react-vite"

import { AuthenticationBlock } from "@workspace/ui/blocks/authentication-block"

const meta = {
  title: "Examples/Authentication",
  parameters: { layout: "fullscreen" },
  render: () => <AuthenticationBlock />,
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
