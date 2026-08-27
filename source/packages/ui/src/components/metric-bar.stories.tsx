import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  METRIC_BAR_SOLID_RADIUS,
  METRIC_BAR_STRETCH_MIN_ROW_HEIGHT,
  METRIC_BAR_STRETCH_MIN_TARGET_HEIGHT,
  MetricBar,
  MetricBarGroup,
  MetricBarHorizontal,
  MetricBarList,
} from "@workspace/ui/components/metric-bar"
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

/**
 * Щільність розтягнутого списку. Понад шість рядів висоти картки вже не
 * вистачає, тож ряди сідають на підлогу 24px — мінімальну ціль вказівника
 * (WCAG 2.2 SC 2.5.8) — і далі росте картка, а не тоншають бари.
 */
const DENSE_ROWS = [
  { label: "Поточний", count: 412, share: 30, fill: "#FFE69C" },
  { label: "Опторіз", count: 220, share: 16, fill: "#FFB79D" },
  { label: "Небесний", count: 165, share: 12, fill: "#D1BFA6" },
  { label: "Шахедоріз", count: 137, share: 10, fill: "#B4C1A9" },
  { label: "РеДрон", count: 124, share: 9, fill: "#66D2ED" },
  { label: "Секретний", count: 96, share: 7, fill: "#F5F1E1" },
  { label: "Оптичний", count: 69, share: 5, fill: "#FEE5DC" },
  { label: "Дронвестиція", count: 55, share: 4, fill: "#F0E9E1" },
  { label: "Перехоплення", count: 41, share: 3, fill: "#E9ECE5" },
  { label: "Грім", count: 27, share: 2, fill: "#E1F5FA" },
  { label: "Небесна інвестиція", count: 14, share: 1, fill: "#D9D9D9" },
  { label: "Тотальний", count: 12, share: 1, fill: "#FFD23F" },
]

function DensityCard({
  rowCount,
  height,
}: {
  rowCount: number
  height: number
}) {
  const rows = DENSE_ROWS.slice(0, rowCount)
  const dense = rowCount > 6

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2">
      <p className="text-background/70 text-xs">
        {rowCount} рядів · трек ≥{" "}
        {dense
          ? METRIC_BAR_STRETCH_MIN_TARGET_HEIGHT
          : METRIC_BAR_STRETCH_MIN_ROW_HEIGHT}
      </p>
      <ReportCard
        tone="muted"
        data-report-palette="shahedoriz"
        className="min-h-0 min-w-0 gap-8 overflow-hidden"
        style={{ height }}
      >
        <h2 className="text-background shrink-0 [font-family:var(--font-display-black)]">
          Закритих запитів за проєктами
        </h2>
        <MetricBarList
          variant="solid"
          stretchRows
          rowMinHeight={
            dense
              ? METRIC_BAR_STRETCH_MIN_TARGET_HEIGHT
              : METRIC_BAR_STRETCH_MIN_ROW_HEIGHT
          }
          className={dense ? "min-h-0 flex-1 gap-y-1" : "min-h-0 flex-1"}
        >
          {rows.map((row) => (
            <MetricBarHorizontal
              key={row.label}
              percent={row.share}
              label={row.label}
              labelClassName={dense ? "max-w-36 [&>span]:truncate" : undefined}
              valueLabel={String(row.count)}
              valueClassName="text-background"
              fillColor={row.fill}
              trackClassName="bg-current text-white/10"
              renderFill={() => (
                <div
                  className="size-full w-full min-w-0"
                  style={{
                    backgroundColor: row.fill,
                    borderRadius: METRIC_BAR_SOLID_RADIUS,
                  }}
                />
              )}
            />
          ))}
        </MetricBarList>
      </ReportCard>
    </div>
  )
}

/**
 * До шести рядів картка тримає задану висоту 367px і ряди розтягуються.
 * На дванадцяти ряди впираються в 24px, і картці потрібно вже 430px.
 */
export const SolidBreakdownDensity: Story = {
  args: { percent: 0 },
  render: () => (
    <div className="bg-foreground text-background flex w-full max-w-6xl flex-col gap-6 p-6 md:flex-row md:items-start">
      <DensityCard rowCount={5} height={367} />
      <DensityCard rowCount={7} height={367} />
      <DensityCard rowCount={12} height={430} />
    </div>
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
