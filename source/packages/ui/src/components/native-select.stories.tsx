import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  NativeSelect,
  NativeSelectOption,
} from "@workspace/ui/components/native-select"

const meta = {
  title: "Components/Native Select",
  component: NativeSelect,
  tags: ["autodocs"],
  render: () => (
    <NativeSelect defaultValue="apple">
      <NativeSelectOption value="apple">Apple</NativeSelectOption>
      <NativeSelectOption value="banana">Banana</NativeSelectOption>
      <NativeSelectOption value="orange">Orange</NativeSelectOption>
    </NativeSelect>
  ),
} satisfies Meta<typeof NativeSelect>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Small: Story = {
  render: () => (
    <NativeSelect size="sm" defaultValue="sm">
      <NativeSelectOption value="sm">Small</NativeSelectOption>
      <NativeSelectOption value="md">Medium</NativeSelectOption>
    </NativeSelect>
  ),
}
