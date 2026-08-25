import type { Meta, StoryObj } from "@storybook/react-vite"

import { SignupBlock } from "@workspace/ui/blocks/signup-block"

const meta = {
  title: "Blocks/Signup",
  parameters: { layout: "fullscreen" },
  render: () => <SignupBlock />,
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
