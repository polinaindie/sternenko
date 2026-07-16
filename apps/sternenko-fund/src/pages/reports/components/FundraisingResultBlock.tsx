import { MetricBar, MetricBarGroup } from "@workspace/ui/components/metric-bar"
import { Progress } from "@workspace/ui/components/progress"
import {
  CurrencyMetric,
  DisplayMetric,
  formatReportNumber,
} from "@workspace/ui/components/report-metric"
import { ProjectTitle } from "@workspace/ui/components/project-title"
import { ReportCard } from "@workspace/ui/components/report-card"
import { ReportDateStamp } from "@workspace/ui/components/report-date-stamp"

import type { FundraisingSummary } from "../lib/fundraising-analytics"

type FundraisingResultBlockProps = {
  summary: FundraisingSummary
  periodLabel: string
}

// Звітний блок одного збору: дата періоду + назва збору, hero-метрика,
// приблизні збитки ворогу, опційно розбивка по типах і прогрес плану.
// Скін задається `data-report-palette` зі звітних палітр фонду.
export function FundraisingResultBlock({
  summary,
  periodLabel,
}: FundraisingResultBlockProps) {
  const { config, quantity, lossesUsd, breakdown, planPercent, hasData } =
    summary
  const breakdownTotal = breakdown?.reduce((sum, item) => sum + item.count, 0) ?? 0

  return (
    <section
      data-report-palette={config.palette}
      className="bg-foreground text-background flex flex-col gap-3 rounded-[var(--radius-report-lg)] p-3 md:p-4"
    >
      <ReportCard tone="accent" size="lg" className="justify-between gap-6">
        <div className="flex flex-col gap-4">
          <ReportDateStamp period={periodLabel} />
          <ProjectTitle>{config.fundraising}</ProjectTitle>
        </div>
        <DisplayMetric
          value={quantity}
          label={config.heroLabel}
          size="lg"
          align="end"
        />
      </ReportCard>

      {hasData ? (
        <div className="flex flex-col gap-3">
          {lossesUsd > 0 ? (
            <ReportCard tone="muted">
              <CurrencyMetric
                amount={lossesUsd}
                currency="$"
                compact
                size="sm"
                align="end"
                label="приблизні збитки окупантам за період"
              />
            </ReportCard>
          ) : null}

          {breakdown?.length ? (
            <ReportCard tone="contrast" className="overflow-x-auto">
              <MetricBarGroup className="min-w-[420px]">
                {breakdown.map((item) => (
                  <MetricBar
                    key={item.label}
                    percent={
                      breakdownTotal > 0
                        ? Math.round((item.count / breakdownTotal) * 100)
                        : 0
                    }
                    valueLabel={formatReportNumber(item.count)}
                    label={item.label}
                  />
                ))}
              </MetricBarGroup>
            </ReportCard>
          ) : null}

          {planPercent != null ? (
            <ReportCard tone="muted" className="gap-2">
              <div className="flex items-baseline justify-between">
                <span className="text-xs tracking-wide uppercase opacity-80">
                  Виконання плану
                </span>
                <span className="[font-family:var(--font-display-dark)] text-lg leading-none">
                  {planPercent}%
                </span>
              </div>
              <Progress value={planPercent} />
            </ReportCard>
          ) : null}
        </div>
      ) : (
        <ReportCard tone="muted">
          <p className="text-sm opacity-80">Немає даних за обраний період</p>
        </ReportCard>
      )}
    </section>
  )
}
