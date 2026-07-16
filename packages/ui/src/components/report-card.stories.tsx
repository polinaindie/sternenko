import type { Meta, StoryObj } from "@storybook/react-vite"

import { ReportCard } from "@workspace/ui/components/report-card"

const meta = {
  title: "Report/Report Card",
  component: ReportCard,
  tags: ["autodocs"],
  argTypes: {
    tone: {
      control: "inline-radio",
      options: ["accent", "contrast", "card", "muted", "outline"],
    },
    size: { control: "inline-radio", options: ["default", "lg"] },
  },
} satisfies Meta<typeof ReportCard>

export default meta
type Story = StoryObj<typeof meta>

export const Accent: Story = {
  args: {
    tone: "accent",
    children: (
      <p className="text-sm uppercase">Жовтий акцент-блок звіту</p>
    ),
    className: "w-72",
  },
}

export const Tones: Story = {
  render: () => (
    <div className="grid w-full max-w-3xl grid-cols-2 gap-3 md:grid-cols-3">
      {(["accent", "contrast", "card", "muted", "outline"] as const).map(
        (tone) => (
          <ReportCard key={tone} tone={tone}>
            <p className="text-sm uppercase">{tone}</p>
          </ReportCard>
        )
      )}
    </div>
  ),
}
