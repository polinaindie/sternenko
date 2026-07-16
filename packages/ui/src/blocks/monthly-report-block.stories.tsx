import type { Meta, StoryObj } from "@storybook/react-vite"

import { MonthlyReportBlock } from "@workspace/ui/blocks/monthly-report-block"

const meta = {
  title: "Blocks/Monthly Report",
  component: MonthlyReportBlock,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof MonthlyReportBlock>

export default meta
type Story = StoryObj<typeof meta>

export const Shahedoriz: Story = {
  args: {
    period: "Травень 2026",
    project: "Шахедоріз",
    hero: { value: 371, label: "БПЛА збито за місяць" },
    secondary: [
      { value: 22, label: "запити закрили за місяць" },
      { value: 2861, label: "БПЛА збито за весь час" },
    ],
    loss: { amount: 7200000, currency: "$" },
  },
}

export const SkyCutter: Story = {
  args: {
    period: "Травень 2026",
    project: "Небесний русоріз",
    palette: "nebesnyi",
    hero: { value: 694, label: "БПЛА збито за місяць" },
    secondary: [
      { value: 48, label: "запитів закрили за місяць" },
      { value: 11353, label: "БПЛА збито за весь час" },
    ],
    loss: { amount: 13400000, currency: "$" },
  },
}

export const Potochnyi: Story = {
  args: {
    period: "Травень 2026",
    project: "Поточний русоріз",
    palette: "potochnyi",
    hero: { value: 2319, label: "цілей уражено за місяць" },
    secondary: [
      { value: 50, label: "од. важкої бронетехніки" },
      { value: 709, label: "од. авто / мототехніки" },
    ],
    loss: { amount: 28600000, currency: "$" },
  },
}
