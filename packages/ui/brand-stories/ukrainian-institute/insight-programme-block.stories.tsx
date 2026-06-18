import type { Meta, StoryObj } from "@storybook/react-vite"

import { InsightProgrammeBlock } from "@workspace/ui/blocks/insight-programme-block"

const meta = {
  title: "Blocks/Insight Programme",
  tags: ["ukrainian-institute"],
  component: InsightProgrammeBlock,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof InsightProgrammeBlock>

export default meta
type Story = StoryObj<typeof meta>

export const FedirYakymenko: Story = {}
