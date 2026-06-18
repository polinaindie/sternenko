import type { Meta, StoryObj } from "@storybook/react-vite"
import { BellIcon, TriangleAlertIcon } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/alert"

const meta = {
  title: "Components/Alert",
  component: Alert,
  tags: ["autodocs"],
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Alert className="w-80">
      <BellIcon />
      <AlertTitle>Heads up</AlertTitle>
      <AlertDescription>This is an informational alert.</AlertDescription>
    </Alert>
  ),
}

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive" className="w-80">
      <TriangleAlertIcon />
      <AlertTitle>Something went wrong</AlertTitle>
      <AlertDescription>Please try again later.</AlertDescription>
    </Alert>
  ),
}
