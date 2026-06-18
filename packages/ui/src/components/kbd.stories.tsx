import type { Meta, StoryObj } from "@storybook/react-vite"

import { Kbd, KbdGroup } from "@workspace/ui/components/kbd"

const meta = {
  title: "Components/Kbd",
  component: Kbd,
  tags: ["autodocs"],
  render: () => (
    <div className="flex flex-col gap-4">
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
      <p className="text-sm text-muted-foreground">
        Press <Kbd>Esc</Kbd> to close
      </p>
    </div>
  ),
} satisfies Meta<typeof Kbd>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
