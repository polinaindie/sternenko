import type { Meta, StoryObj } from "@storybook/react-vite"

import { FeaturedBlock } from "@workspace/ui/blocks/featured-block"

const meta = {
  title: "Blocks/Featured",
  parameters: { layout: "fullscreen" },
  render: () => <FeaturedBlock />,
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
