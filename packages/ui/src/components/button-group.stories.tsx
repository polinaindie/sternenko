import type { Meta, StoryObj } from "@storybook/react-vite"
import { PlusIcon } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@workspace/ui/components/button-group"

const meta = {
  title: "Components/Button Group",
  component: ButtonGroup,
  tags: ["autodocs"],
  render: () => (
    <ButtonGroup>
      <Button variant="outline">Archive</Button>
      <ButtonGroupSeparator />
      <Button variant="outline">Report</Button>
      <ButtonGroupSeparator />
      <Button variant="outline">Snooze</Button>
    </ButtonGroup>
  ),
} satisfies Meta<typeof ButtonGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithText: Story = {
  render: () => (
    <ButtonGroup>
      <ButtonGroupText>Label</ButtonGroupText>
      <Button variant="outline" size="icon">
        <PlusIcon />
      </Button>
    </ButtonGroup>
  ),
}
