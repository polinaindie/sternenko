import type { Meta, StoryObj } from "@storybook/react-vite"

import { AspectRatio } from "@workspace/ui/components/aspect-ratio"

const meta = {
  title: "Components/Aspect Ratio",
  component: AspectRatio,
  tags: ["autodocs"],
} satisfies Meta<typeof AspectRatio>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="w-72">
      <AspectRatio
        ratio={16 / 9}
        className="bg-muted text-muted-foreground flex items-center justify-center rounded-lg text-sm"
      >
        16 / 9
      </AspectRatio>
    </div>
  ),
}
