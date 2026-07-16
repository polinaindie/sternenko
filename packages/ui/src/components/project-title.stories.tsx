import type { Meta, StoryObj } from "@storybook/react-vite"

import { ProjectTitle } from "@workspace/ui/components/project-title"
import { ReportCard } from "@workspace/ui/components/report-card"

const meta = {
  title: "Report/Project Title",
  component: ProjectTitle,
  tags: ["autodocs"],
} satisfies Meta<typeof ProjectTitle>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: "Шахедоріз",
  },
}

export const WithIcon: Story = {
  args: {
    children: "Небесний русоріз",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M3 12h18M12 3v18M5 5l14 14M19 5L5 19" />
      </svg>
    ),
  },
}

export const OnAccentCard: Story = {
  render: () => (
    <ReportCard className="w-fit" size="lg">
      <ProjectTitle>Поточний русоріз</ProjectTitle>
    </ReportCard>
  ),
}
