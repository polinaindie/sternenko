import type { Meta, StoryObj } from "@storybook/react-vite"

import { ReportDateStamp } from "@workspace/ui/components/report-date-stamp"

const meta = {
  title: "Report/Date Stamp",
  component: ReportDateStamp,
  tags: ["autodocs"],
} satisfies Meta<typeof ReportDateStamp>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    period: "Травень 2026",
  },
}

export const OnDarkCanvas: Story = {
  args: { period: "Травень 2026" },
  render: () => (
    <div className="bg-foreground text-background rounded-[var(--radius-report-lg)] p-8">
      <ReportDateStamp period="Травень 2026" />
    </div>
  ),
}
