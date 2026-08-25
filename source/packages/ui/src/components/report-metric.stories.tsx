import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  CurrencyMetric,
  DisplayMetric,
} from "@workspace/ui/components/report-metric"
import { ReportCard } from "@workspace/ui/components/report-card"

const meta = {
  title: "Report/Metric",
  component: DisplayMetric,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "default", "lg"] },
    align: { control: "inline-radio", options: ["start", "end"] },
  },
} satisfies Meta<typeof DisplayMetric>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    value: 371,
    label: "БПЛА збито за місяць",
    size: "lg",
  },
}

export const Grouping: Story = {
  args: {
    value: 225366619,
    label: "Сума надходжень, ₴",
    size: "default",
  },
}

export const OnAccentCard: Story = {
  args: { value: 0 },
  render: () => (
    <ReportCard className="w-80" size="lg">
      <DisplayMetric value={2861} label="БПЛА збито за весь час" size="lg" />
    </ReportCard>
  ),
}

export const Currency: Story = {
  args: { value: 0 },
  render: () => (
    <div className="flex flex-wrap items-end gap-10">
      <CurrencyMetric amount={7200000} currency="$" compact size="lg" label="збитки окупантів" />
      <CurrencyMetric amount={210572345} currency="₴" label="на суму" />
    </div>
  ),
}
