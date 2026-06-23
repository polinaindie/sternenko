import { CurrencyMetric, DisplayMetric } from "@workspace/ui/components/report-metric"
import { ReportCard } from "@workspace/ui/components/report-card"

import type { IncomeSummary } from "../lib/income-analytics"
import { KpiGrid } from "./report-ui"

type IncomeMetricsClusterProps = {
  summary: IncomeSummary
  periodLabel: string
}

function MetricPeriodCaption({ children }: { children: string }) {
  return (
    <span className="[font-family:var(--font-body)] text-sm font-normal tracking-normal text-muted-foreground">
      {children}
    </span>
  )
}

export function IncomeMetricsCluster({ summary, periodLabel }: IncomeMetricsClusterProps) {
  return (
    <KpiGrid>
      <ReportCard tone="muted">
        <CurrencyMetric
          amount={summary.totalAmountUah}
          label="Загальна сума надходжень, ₴"
          size="sm"
        >
          <MetricPeriodCaption>{periodLabel}</MetricPeriodCaption>
        </CurrencyMetric>
      </ReportCard>
      <ReportCard tone="muted">
        <CurrencyMetric
          amount={summary.averageDonationUah}
          label="Середня сума надходжень, ₴"
          size="sm"
        >
          <MetricPeriodCaption>{periodLabel}</MetricPeriodCaption>
        </CurrencyMetric>
      </ReportCard>
      <ReportCard tone="muted">
        <DisplayMetric
          value={summary.donationCount}
          label="Загальна кількість надходжень"
          size="sm"
        >
          <MetricPeriodCaption>{periodLabel}</MetricPeriodCaption>
        </DisplayMetric>
      </ReportCard>
    </KpiGrid>
  )
}
