import { useMemo, type ReactNode } from "react"

import { MetricBar, MetricBarGroup } from "@workspace/ui/components/metric-bar"
import { Progress } from "@workspace/ui/components/progress"
import {
  CurrencyMetric,
  DisplayMetric,
  formatReportNumber,
  UAH_SUFFIX,
} from "@workspace/ui/components/report-metric"
import { ReportCard } from "@workspace/ui/components/report-card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip"
import { Stack } from "@workspace/ui/layout/stack"

import {
  formatRequestCountCaption,
  summarizeClosedRequestsByProject,
} from "../lib/issuance-analytics"
import { getIssuanceSnapshot } from "../lib/issuance-snapshot"
import type { IssuanceRow } from "../mock-data"
import { EmptyReportState } from "./ReportPagination"
import {
  ReportChartTooltipBody,
  reportChartTooltipContentClass,
} from "./ReportChartTooltip"
import { SectionTitle } from "./report-ui"

type IssuanceSnapshotSectionProps = {
  /** Рядки таблиці після застосованих фільтрів — для розподілу закритих запитів. */
  rows: IssuanceRow[]
}

/**
 * KPI закупівель — пакетний знімок (щоденний/щотижневий).
 * Розподіл закритих запитів за проєктами — за застосованими фільтрами таблиці.
 */
function SnapshotCaption({ children }: { children: ReactNode }) {
  return (
    <span className="[font-family:var(--font-body)] text-sm font-normal tracking-normal text-muted-foreground">
      {children}
    </span>
  )
}

export function IssuanceSnapshotSection({ rows }: IssuanceSnapshotSectionProps) {
  const snapshot = getIssuanceSnapshot()
  const monthlyNormPercent = Math.min(
    100,
    Math.round(
      (snapshot.monthlyNorm.valueUah / snapshot.monthlyNorm.targetUah) * 100
    )
  )

  const projectBreakdown = useMemo(
    () => summarizeClosedRequestsByProject(rows),
    [rows]
  )

  return (
    <Stack className="gap-3">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <ReportCard
          tone="outline"
          className="bg-[var(--report-surface)] text-[var(--report-surface-foreground)]"
        >
          <CurrencyMetric
            amount={snapshot.totalPurchaseAmountUah}
            label="Загальна сума закупівель, ₴"
            size="sm"
          >
            <SnapshotCaption>за весь час</SnapshotCaption>
          </CurrencyMetric>
        </ReportCard>
        <ReportCard
          tone="outline"
          className="bg-[var(--report-surface)] text-[var(--report-surface-foreground)]"
        >
          <DisplayMetric
            value={snapshot.closedRequestsCount}
            label="Закритих запитів"
            size="sm"
          >
            <SnapshotCaption>за весь час</SnapshotCaption>
          </DisplayMetric>
        </ReportCard>
        <ReportCard
          tone="outline"
          className="bg-[var(--report-surface)] text-[var(--report-surface-foreground)]"
        >
          <CurrencyMetric
            amount={snapshot.lossesUsd}
            currency="$"
            compact
            label="Збитки ворогу"
            size="sm"
          >
            <SnapshotCaption>приблизна оцінка · за весь час</SnapshotCaption>
          </CurrencyMetric>
        </ReportCard>
        <ReportCard
          tone="outline"
          className="bg-[var(--report-surface)] text-[var(--report-surface-foreground)]"
        >
          <Stack className="gap-2">
            <CurrencyMetric
              amount={snapshot.monthlyNorm.valueUah}
              label="Місячна норма, ₴"
              size="sm"
            >
              <SnapshotCaption>поточний місяць</SnapshotCaption>
            </CurrencyMetric>
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-xs tracking-wide text-muted-foreground uppercase">
                Ціль {formatReportNumber(snapshot.monthlyNorm.targetUah)}
                {UAH_SUFFIX}
              </span>
              <span className="[font-family:var(--font-display-dark)] text-base leading-none">
                {monthlyNormPercent}%
              </span>
            </div>
            <Progress value={monthlyNormPercent} />
          </Stack>
        </ReportCard>
      </div>

      {projectBreakdown.length === 0 ? (
        <ReportCard tone="contrast" className="gap-[38px] overflow-x-auto">
          <SectionTitle className="text-center">Закриті запити за проєктами</SectionTitle>
          <EmptyReportState message="За обраними фільтрами немає даних для розподілу." />
        </ReportCard>
      ) : (
        <ReportCard tone="contrast" className="gap-[38px] overflow-x-auto">
          <SectionTitle className="text-center">Закриті запити за проєктами</SectionTitle>
          <TooltipProvider>
            <MetricBarGroup className="min-w-[640px]">
              {projectBreakdown.map((item) => (
                <MetricBar
                  key={item.project}
                  percent={item.share}
                  label={item.project}
                  className="min-w-0 flex-1"
                  renderFill={(clamped) => (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className="absolute inset-x-0 bottom-0 cursor-default bg-current outline-none focus-visible:ring-2 focus-visible:ring-foreground/30"
                          style={{ height: `${clamped}%` }}
                          aria-label={`Закритих запитів: ${formatReportNumber(item.count)} ${formatRequestCountCaption(item.count)}; Сума закупівель: ${formatReportNumber(item.amountUah)}${UAH_SUFFIX}`}
                        />
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
                        sideOffset={8}
                        hideArrow
                        className={reportChartTooltipContentClass}
                      >
                        <ReportChartTooltipBody
                          title={item.project}
                          rows={[
                            {
                              label: "Закритих запитів",
                              value: `${formatReportNumber(item.count)} ${formatRequestCountCaption(item.count)}`,
                            },
                            {
                              label: "Сума закупівель",
                              value: `${formatReportNumber(item.amountUah)}${UAH_SUFFIX}`,
                            },
                          ]}
                        />
                      </TooltipContent>
                    </Tooltip>
                  )}
                />
              ))}
            </MetricBarGroup>
          </TooltipProvider>
        </ReportCard>
      )}
    </Stack>
  )
}
