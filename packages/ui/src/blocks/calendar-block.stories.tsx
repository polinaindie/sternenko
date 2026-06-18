import type { Meta, StoryObj } from "@storybook/react-vite"

import { CalendarBlock } from "@workspace/ui/blocks/calendar-block"

const meta = {
  title: "Blocks/Calendar",
  parameters: { layout: "fullscreen" },
  render: () => <CalendarBlock />,
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
