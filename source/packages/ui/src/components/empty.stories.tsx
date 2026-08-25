import type { Meta, StoryObj } from "@storybook/react-vite"
import { InboxIcon } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/empty"

const meta = {
  title: "Components/Empty",
  component: Empty,
  tags: ["autodocs"],
  render: () => (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <InboxIcon />
        </EmptyMedia>
        <EmptyTitle>No messages</EmptyTitle>
        <EmptyDescription>
          You don&apos;t have any messages yet. Start a conversation to see
          them here.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm">Send message</Button>
      </EmptyContent>
    </Empty>
  ),
} satisfies Meta<typeof Empty>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
