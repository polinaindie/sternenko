import type { Meta, StoryObj } from "@storybook/react-vite"

import { MetricBar, MetricBarGroup, MetricBarHorizontal, MetricBarList } from "@workspace/ui/components/metric-bar"
import { ReportCard } from "@workspace/ui/components/report-card"

const meta = {
  title: "Report/Metric Bar",
  component: MetricBar,
  tags: ["autodocs"],
} satisfies Meta<typeof MetricBar>

export default meta
type Story = StoryObj<typeof meta>

export const Single: Story = {
  args: {
    percent: 47,
    label: "< 100",
    className: "w-20",
  },
}

export const Breakdown: Story = {
  args: { percent: 0 },
  render: () => (
    <div
      data-report-palette="donations"
      className="bg-foreground w-full max-w-xl p-4"
    >
      <ReportCard tone="accent">
        <MetricBarGroup>
          <MetricBar percent={47} label="< 100" />
          <MetricBar percent={40} label="100 - 500" />
          <MetricBar percent={7} label="500 - 1000" />
          <MetricBar percent={5} label="1000 - 5000" />
          <MetricBar percent={1} label="5000 <" />
        </MetricBarGroup>
      </ReportCard>
    </div>
  ),
}

export const WithValues: Story = {
  args: { percent: 0 },
  render: () => (
    <ReportCard tone="muted" className="w-full max-w-xl">
      <MetricBarGroup>
        <MetricBar percent={51} valueLabel="2 749" label="звичайних" />
        <MetricBar percent={14} valueLabel="770" label="зенітних" />
        <MetricBar percent={9} valueLabel="501" label="перехоплювачі" />
        <MetricBar percent={13} valueLabel="690" label="оптоволокно" />
        <MetricBar percent={12} valueLabel="637" label="інших" />
      </MetricBarGroup>
    </ReportCard>
  ),
}

export const SolidBreakdown: Story = {
  args: { percent: 0 },
  render: () => (
    <div
      data-report-palette="potochnyi"
      className="bg-foreground text-background w-full max-w-3xl p-4"
    >
      <MetricBarList variant="solid" className="gap-3">
        <MetricBarHorizontal
          percent={46}
          valueLabel="36"
          valueCaption="запитів"
          label="Поточний"
          fillColor="#829474"
          trackClassName="bg-foreground/10"
        />
        <MetricBarHorizontal
          percent={21}
          valueLabel="16"
          valueCaption="запитів"
          label="Небесний"
          fillColor="#59CBE7"
          trackClassName="bg-foreground/10"
        />
        <MetricBarHorizontal
          percent={17}
          valueLabel="13"
          valueCaption="запитів"
          label="Секретний"
          fillColor="#FE6A34"
          trackClassName="bg-foreground/10"
        />
        <MetricBarHorizontal
          percent={8}
          valueLabel="6"
          valueCaption="запитів"
          label="РеДрон"
          fillColor="#DCDCDC"
          trackClassName="bg-foreground/10"
        />
        <MetricBarHorizontal
          percent={8}
          valueLabel="6"
          valueCaption="запитів"
          label="Шахедоріз"
          fillColor="#FFD62E"
          trackClassName="bg-foreground/10"
        />
      </MetricBarList>
    </div>
  ),
}
