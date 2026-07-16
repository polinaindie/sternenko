import * as React from "react"

import { MetricBar, MetricBarGroup } from "@workspace/ui/components/metric-bar"
import {
  DisplayMetric,
} from "@workspace/ui/components/report-metric"
import { ReportCard } from "@workspace/ui/components/report-card"
import { cn } from "@workspace/ui/lib/utils"

type DonationBreakdownChartItem = {
  id: string
  percent: number
  label: React.ReactNode
  valueLabel?: React.ReactNode
  valueCaption?: React.ReactNode
  renderFill?: (clampedPercent: number) => React.ReactNode
}

type DonationBreakdownChartProps = {
  className?: string
  palette?: string
  summary: {
    value: number | string
    label: React.ReactNode
    size?: "sm" | "default" | "lg"
  }
  items: DonationBreakdownChartItem[]
  emptyMessage?: React.ReactNode
}

/**
 * Діаграма розбивки у стилі звіту по донатах:
 * темне полотно → accent-картка → hero-метрика + вертикальні MetricBar.
 */
function DonationBreakdownChart({
  className,
  palette = "shahedoriz",
  summary,
  items,
  emptyMessage = "Немає даних для розподілу.",
}: DonationBreakdownChartProps) {
  const visibleItems = items.filter((item) => item.percent > 0)

  return (
    <section
      data-slot="donation-breakdown-chart"
      data-report-palette={palette}
      className={cn(
        "bg-foreground text-background w-full overflow-hidden rounded-[var(--radius-report-lg)] p-3 md:p-4",
        className
      )}
    >
      <ReportCard tone="accent" className="gap-6">
        <DisplayMetric
          value={summary.value}
          label={summary.label}
          size={summary.size ?? "lg"}
        />

        {visibleItems.length > 0 ? (
          <div className="w-full overflow-x-auto">
            <MetricBarGroup className="min-w-[min(100%,28rem)] w-full">
              {visibleItems.map((item) => (
                <MetricBar
                  key={item.id}
                  percent={item.percent}
                  label={item.label}
                  valueLabel={item.valueLabel}
                  valueCaption={item.valueCaption}
                  renderFill={item.renderFill}
                />
              ))}
            </MetricBarGroup>
          </div>
        ) : (
          <p className="text-primary-foreground/80 text-sm">{emptyMessage}</p>
        )}
      </ReportCard>
    </section>
  )
}

export { DonationBreakdownChart }
export type { DonationBreakdownChartItem, DonationBreakdownChartProps }
