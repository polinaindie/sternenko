import type { Meta, StoryObj } from "@storybook/react-vite"

import { ScrollArea } from "@workspace/ui/components/scroll-area"

const TAGS = Array.from({ length: 30 }, (_, i) => `Item ${i + 1}`)

const meta = {
  title: "Components/Scroll Area",
  component: ScrollArea,
  tags: ["autodocs"],
  render: () => (
    <ScrollArea className="h-48 w-56 rounded-lg border p-3">
      <div className="flex flex-col gap-2 text-sm">
        {TAGS.map((tag) => (
          <div key={tag}>{tag}</div>
        ))}
      </div>
    </ScrollArea>
  ),
} satisfies Meta<typeof ScrollArea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
