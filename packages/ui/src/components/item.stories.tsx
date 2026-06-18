import type { Meta, StoryObj } from "@storybook/react-vite"
import { BadgeCheckIcon, ChevronRightIcon } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@workspace/ui/components/item"

const meta = {
  title: "Components/Item",
  component: Item,
  tags: ["autodocs"],
  render: () => (
    <ItemGroup className="max-w-md">
      <Item variant="outline">
        <ItemMedia variant="icon">
          <BadgeCheckIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Your order has been shipped</ItemTitle>
          <ItemDescription>
            Track your package or contact support for help.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm" variant="outline">
            View
          </Button>
        </ItemActions>
      </Item>
      <Item variant="outline" size="sm">
        <ItemContent>
          <ItemTitle>Payment method</ItemTitle>
          <ItemDescription>Visa ending in 4242</ItemDescription>
        </ItemContent>
        <ItemActions>
          <ChevronRightIcon className="size-4 text-muted-foreground" />
        </ItemActions>
      </Item>
    </ItemGroup>
  ),
} satisfies Meta<typeof Item>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
