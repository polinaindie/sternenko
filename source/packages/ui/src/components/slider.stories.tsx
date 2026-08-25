import type { Meta, StoryObj } from "@storybook/react-vite"

import { Slider } from "@workspace/ui/components/slider"

const meta = {
  title: "Components/Slider",
  component: Slider,
  tags: ["autodocs"],
  render: () => <Slider defaultValue={[40]} max={100} step={1} className="w-64" />,
} satisfies Meta<typeof Slider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
