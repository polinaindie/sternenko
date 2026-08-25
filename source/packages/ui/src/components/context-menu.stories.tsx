import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@workspace/ui/components/context-menu"

const meta = {
  title: "Components/Context Menu",
  component: ContextMenu,
  tags: ["autodocs"],
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-32 w-72 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
        Right click here
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Back</ContextMenuItem>
        <ContextMenuItem>Forward</ContextMenuItem>
        <ContextMenuItem>Reload</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>Save as…</ContextMenuItem>
        <ContextMenuItem>Print</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
} satisfies Meta<typeof ContextMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
