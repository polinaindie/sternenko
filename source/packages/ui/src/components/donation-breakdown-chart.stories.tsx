import type { Meta, StoryObj } from "@storybook/react-vite"

import { DonationBreakdownChart } from "@workspace/ui/components/donation-breakdown-chart"

const meta = {
  title: "Report/Donation Breakdown Chart",
  component: DonationBreakdownChart,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof DonationBreakdownChart>

export default meta
type Story = StoryObj<typeof meta>

const issuanceProjects = [
  { id: "Поточний", percent: 46, label: "Поточний", valueLabel: "36", valueCaption: "запитів", color: "#829474" },
  { id: "Небесний", percent: 21, label: "Небесний", valueLabel: "16", valueCaption: "запитів", color: "#59CBE7" },
  { id: "Секретний", percent: 17, label: "Секретний", valueLabel: "13", valueCaption: "запитів", color: "#FE6A34" },
  { id: "РеДрон", percent: 8, label: "РеДрон", valueLabel: "6", valueCaption: "запитів", color: "#DCDCDC" },
  { id: "Шахедоріз", percent: 8, label: "Шахедоріз", valueLabel: "6", valueCaption: "запитів", color: "#FFD62E" },
] as const

export const IssuanceClosedRequests: Story = {
  args: {
    summary: { value: 77, label: "закритих запитів загалом" },
    items: issuanceProjects.map((project) => ({
      id: project.id,
      percent: project.percent,
      label: project.label,
      valueLabel: project.valueLabel,
      valueCaption: project.valueCaption,
      renderFill: (clamped) => (
        <div
          className="absolute inset-x-0 bottom-0"
          style={{ height: `${clamped}%`, backgroundColor: project.color }}
        />
      ),
    })),
  },
}

export const DonationAmountBuckets: Story = {
  args: {
    summary: { value: "12 408", label: "надходжень" },
    items: [
      { id: "lt100", percent: 47, label: "< 100" },
      { id: "100-500", percent: 40, label: "100 - 500" },
      { id: "500-1000", percent: 7, label: "500 - 1000" },
      { id: "1000-5000", percent: 5, label: "1000 - 5000" },
      { id: "gt5000", percent: 1, label: "5000 <" },
    ],
    palette: "donations",
  },
}
