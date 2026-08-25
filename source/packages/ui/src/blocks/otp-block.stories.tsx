import type { Meta, StoryObj } from "@storybook/react-vite"

import { OtpBlock } from "@workspace/ui/blocks/otp-block"

const meta = {
  title: "Blocks/OTP",
  parameters: { layout: "fullscreen" },
  render: () => <OtpBlock />,
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
