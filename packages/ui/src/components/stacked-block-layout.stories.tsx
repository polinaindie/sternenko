import type { Meta, StoryObj } from "@storybook/react-vite"

import { MetricBarHorizontal, MetricBarList } from "@workspace/ui/components/metric-bar"
import { CurrencyMetric, DisplayMetric } from "@workspace/ui/components/report-metric"
import { ReportCard } from "@workspace/ui/components/report-card"
import {
  DEFAULT_BLOCK_COLOR,
  StackedBlockLayout,
} from "@workspace/ui/components/stacked-block-layout"

const demoBackground = "#E3E8DC"

const demoBlockClass = "flex h-full flex-col justify-end text-background"

const meta = {
  title: "Report/Stacked Block Layout",
  component: StackedBlockLayout,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div
        className="mx-auto w-full max-w-4xl rounded-2xl p-6"
        style={{ backgroundColor: demoBackground }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof StackedBlockLayout>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {} as never,
  render: () => (
    <StackedBlockLayout
      blockColor={DEFAULT_BLOCK_COLOR}
      backgroundColor={demoBackground}
      hero={
        <div className={`${demoBlockClass} min-h-[240px]`}>
          <p className="text-xs uppercase tracking-wide opacity-80">Hero block</p>
          <p className="text-4xl font-semibold">Large full-width surface</p>
        </div>
      }
      row1Left={
        <div className={demoBlockClass}>
          <p className="text-2xl font-semibold">Left · 37.5%</p>
        </div>
      }
      row1Right={
        <div className={demoBlockClass}>
          <p className="text-2xl font-semibold">Right column</p>
        </div>
      }
      row2Left={
        <div className={demoBlockClass}>
          <p className="text-2xl font-semibold">Second row left</p>
        </div>
      }
      row2Right={
        <div className={demoBlockClass}>
          <p className="text-2xl font-semibold">Second row right</p>
        </div>
      }
    />
  ),
}

export const HeroBottom: Story = {
  args: {} as never,
  render: () => (
    <StackedBlockLayout
      blockColor={DEFAULT_BLOCK_COLOR}
      backgroundColor={demoBackground}
      heroPosition="bottom"
      row1Left={
        <div className={demoBlockClass}>
          <p className="text-2xl font-semibold">Top left</p>
        </div>
      }
      row1Right={
        <div className={demoBlockClass}>
          <p className="text-2xl font-semibold">Top right</p>
        </div>
      }
      row2Left={
        <div className={demoBlockClass}>
          <p className="text-2xl font-semibold">Middle left</p>
        </div>
      }
      hero={
        <div className={`${demoBlockClass} min-h-[240px]`}>
          <p className="text-4xl font-semibold">Hero below</p>
        </div>
      }
    />
  ),
}

export const HeroWithThreeMetricsBelow: Story = {
  args: {} as never,
  render: () => (
    <StackedBlockLayout
      blockColor={DEFAULT_BLOCK_COLOR}
      backgroundColor={demoBackground}
      heroPosition="top"
      metricRow={[
        <div key="one" className={demoBlockClass}>
          <p className="text-2xl font-semibold">Block 1</p>
        </div>,
        <div key="two" className={demoBlockClass}>
          <p className="text-2xl font-semibold">Block 2</p>
        </div>,
        <div key="three" className={demoBlockClass}>
          <p className="text-2xl font-semibold">Block 3</p>
        </div>,
      ]}
      hero={
        <div className={`${demoBlockClass} min-h-[240px]`}>
          <p className="text-4xl font-semibold">Full-width hero above three KPIs</p>
        </div>
      }
    />
  ),
}

export const IssuanceSnapshotCluster: Story = {
  args: {} as never,
  render: () => (
    <div className="flex w-full min-w-0 max-w-5xl flex-row items-stretch gap-3">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-3 self-stretch">
        <ReportCard tone="muted" className="min-h-0 flex-1 justify-end">
          <CurrencyMetric
            amount={169509024}
            label="сума закупівель, ₴"
            size="sm"
          />
        </ReportCard>
        <ReportCard tone="muted" className="min-h-0 flex-1 justify-end">
          <CurrencyMetric
            amount={1400000}
            currency="$"
            compact
            size="sm"
            label="збитки ворогу, $"
            approximate
          />
        </ReportCard>
        <ReportCard tone="muted" className="min-h-0 flex-1 justify-end">
          <DisplayMetric
            value={77}
            label="загалом закритих запитів"
            size="sm"
          />
        </ReportCard>
      </div>

      <ReportCard
        tone="muted"
        data-report-palette="shahedoriz"
        className="min-h-0 min-w-0 flex-1 gap-8 self-stretch overflow-hidden rounded-[var(--radius-report-lg)]"
      >
        <h2 className="[font-family:var(--font-display-dark)] shrink-0 text-lg leading-[0.9] tracking-[-0.02em] text-background md:text-xl">
          Закритих запитів за проєктами та зборами
        </h2>
        <MetricBarList variant="solid" stretchRows className="min-h-0 flex-1">
          <MetricBarHorizontal
            percent={18}
            valueLabel="14"
            valueCaption="запитів"
            label="Русоріз"
            fillColor="#829474"
            trackClassName="bg-current text-white/10"
          />
          <MetricBarHorizontal
            percent={14}
            valueLabel="11"
            valueCaption="запитів"
            label="Тотальний Русоріз"
            fillColor="#A8B89C"
            trackClassName="bg-current text-white/10"
          />
          <MetricBarHorizontal
            percent={12}
            valueLabel="9"
            valueCaption="запитів"
            label="Небесний Русоріз"
            fillColor="#59CBE7"
            trackClassName="bg-current text-white/10"
          />
          <MetricBarHorizontal
            percent={10}
            valueLabel="8"
            valueCaption="запитів"
            label="Шахедоріз"
            fillColor="#FFD62E"
            trackClassName="bg-current text-white/10"
          />
          <MetricBarHorizontal
            percent={9}
            valueLabel="7"
            valueCaption="запитів"
            label="Опторіз"
            fillColor="#A67C52"
            trackClassName="bg-current text-white/10"
          />
        </MetricBarList>
      </ReportCard>
    </div>
  ),
}
