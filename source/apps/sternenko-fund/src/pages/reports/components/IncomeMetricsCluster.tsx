import { CurrencyMetric, DisplayMetric } from "@workspace/ui/components/report-metric"
import { ReportCard } from "@workspace/ui/components/report-card"
import { cn } from "@workspace/ui/lib/utils"

import type { IncomeSummary } from "../lib/income-analytics"
import { KpiGrid, reportDesktopKpiRowClass } from "./report-ui"

type IncomeMetricsClusterProps = {
  summary: IncomeSummary
  /** Desktop KPI row without outer grid — three flex cards aligned with the filter row. */
  bare?: boolean
  className?: string
}

export function IncomeMetricCards({
  summary,
  cardClassName,
}: {
  summary: IncomeSummary
  cardClassName?: string
}) {
  return (
    <>
      <ReportCard tone="muted" className={cardClassName}>
        <CurrencyMetric
          amount={summary.totalAmountUah}
          label="Загальна сума надходжень, ₴"
          size="sm"
        />
      </ReportCard>
      <ReportCard tone="muted" className={cardClassName}>
        <CurrencyMetric
          amount={summary.averageDonationUah}
          label="Середня сума надходжень, ₴"
          size="sm"
        />
      </ReportCard>
      <ReportCard tone="muted" className={cardClassName}>
        <DisplayMetric
          value={summary.donationCount}
          label="Загальна кількість надходжень"
          size="sm"
        />
      </ReportCard>
    </>
  )
}

export function IncomeMetricsCluster({
  summary,
  bare = false,
  className,
}: IncomeMetricsClusterProps) {
  const cards = <IncomeMetricCards summary={summary} />

  if (bare) {
    return (
      <div className={cn(reportDesktopKpiRowClass, className)}>
        <IncomeMetricCards summary={summary} cardClassName="min-w-0 flex-1" />
      </div>
    )
  }

  return (
    <KpiGrid
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 [&>*:first-child]:sm:col-span-2 [&>*:first-child]:lg:col-span-1",
        className
      )}
    >
      {cards}
    </KpiGrid>
  )
}
