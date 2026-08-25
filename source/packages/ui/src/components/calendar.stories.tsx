import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { Calendar } from "@workspace/ui/components/calendar"

function CalendarDemo() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-lg border"
    />
  )
}

const meta = {
  title: "Components/Calendar",
  component: Calendar,
  tags: ["autodocs"],
  render: () => <CalendarDemo />,
} satisfies Meta<typeof Calendar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
