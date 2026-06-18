import type { Meta, StoryObj } from "@storybook/react-vite"
import { SearchIcon } from "lucide-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@workspace/ui/components/input-group"

const meta = {
  title: "Components/Input Group",
  component: InputGroup,
  tags: ["autodocs"],
  render: () => (
    <InputGroup className="w-64">
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
      <InputGroupInput placeholder="Search…" />
    </InputGroup>
  ),
} satisfies Meta<typeof InputGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
