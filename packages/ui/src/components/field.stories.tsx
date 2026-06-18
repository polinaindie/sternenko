import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"

const meta = {
  title: "Components/Field",
  component: Field,
  tags: ["autodocs"],
  render: () => (
    <FieldGroup className="w-72">
      <Field>
        <FieldLabel htmlFor="name">Full name</FieldLabel>
        <Input id="name" placeholder="Ada Lovelace" />
        <FieldDescription>As it appears on your account.</FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input id="email" type="email" placeholder="you@example.com" />
      </Field>
    </FieldGroup>
  ),
} satisfies Meta<typeof Field>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
