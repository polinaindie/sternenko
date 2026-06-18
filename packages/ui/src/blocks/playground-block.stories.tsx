import type { Meta, StoryObj } from "@storybook/react-vite"

import { PlaygroundBlock } from "@workspace/ui/blocks/playground-block"

const meta = {
  title: "Examples/Playground",
  parameters: { layout: "fullscreen" },
  render: () => <PlaygroundBlock />,
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
