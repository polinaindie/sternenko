import type { Meta, StoryObj } from "@storybook/react-vite"

import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

const meta = {
  title: "Components/Card",
  component: Card,
  tags: ["autodocs"],
  render: () => (
    <Card className="w-72">
      <CardHeader>
        <CardTitle>Upgrade plan</CardTitle>
        <CardDescription>Unlock advanced features.</CardDescription>
      </CardHeader>
      <CardContent className="text-muted-foreground text-sm">
        Billed monthly, cancel anytime.
      </CardContent>
      <CardFooter>
        <Button>Upgrade</Button>
      </CardFooter>
    </Card>
  ),
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
