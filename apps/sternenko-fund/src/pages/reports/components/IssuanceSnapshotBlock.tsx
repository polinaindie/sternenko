import { useMemo } from "react"

import {
  METRIC_BAR_SOLID_RADIUS,
  MetricBarHorizontal,
  MetricBarList,
} from "@workspace/ui/components/metric-bar"
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
import { cn } from "@workspace/ui/lib/utils"

import {
  formatRequestCountCaption,
  type IssuanceRequestBreakdownItem,
} from "../lib/issuance-analytics"
import { buildIssuanceBreakdownFillColors } from "../lib/issuance-breakdown-colors"
import { getProjectLineDisplayName } from "../lib/project-display"
import {
  ReportChartTooltipBody,
  reportChartTooltipContentClass,
} from "./ReportChartTooltip"
import { KpiGrid, reportIssuanceDesktopGridClass, reportIssuanceSplitColumnClass, SectionTitle } from "./report-ui"

type IssuanceSnapshotBlockProps = {
  totalPurchaseAmountUah: number
  closedRequestsCount: number
  lossesUsd: number
  breakdown: IssuanceRequestBreakdownItem[]
  /** Render KPI column + chart as grid siblings (no outer wrapper). */
  bare?: boolean
  className?: string
}

const issuanceChartShellClassName =
  "min-h-0 min-w-0 gap-8 self-stretch overflow-hidden rounded-[var(--radius-report-lg)]"

function BreakdownChart({
  breakdown,
  className,
}: {
  breakdown: IssuanceRequestBreakdownItem[]
  className?: string
}) {
  const visibleBreakdown = useMemo(
    () => breakdown.filter((item) => item.count > 0),
    [breakdown]
  )

  const fillColors = useMemo(
    () =>
      buildIssuanceBreakdownFillColors(
        visibleBreakdown.map((item) => item.fundraising)
      ),
    [visibleBreakdown]
  )

  return (
    <MetricBarList
      variant="solid"
      stretchRows
      className={cn("min-h-0 flex-1", className)}
    >
      {visibleBreakdown.map((item, index) => {
        const fillColor = fillColors[index]!

        return (
          <MetricBarHorizontal
            key={item.fundraising}
            percent={item.share}
            label={item.fundraising}
            valueLabel={formatReportNumber(item.count)}
            valueCaption={formatRequestCountCaption(item.count)}
            fillColor={fillColor}
            trackClassName="bg-current text-white/10"
            renderFill={() => (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className="size-full w-full min-w-0 cursor-default outline-none focus-visible:ring-2 focus-visible:ring-foreground/30"
                    style={{
                      backgroundColor: fillColor,
                      borderRadius: METRIC_BAR_SOLID_RADIUS,
                    }}
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
                    title={item.fundraising}
                    rows={[
                      {
                        label: "Проєкт",
                        value: getProjectLineDisplayName(item.project),
                      },
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
        )
      })}
    </MetricBarList>
  )
}

/**
 * Зведення вкладки «Видача» — KPI-картки стовпчиком зліва,
 * блок з горизонтальною діаграмою праворуч.
 */
export function IssuanceSnapshotBlock({
  totalPurchaseAmountUah,
  closedRequestsCount,
  lossesUsd,
  breakdown,
  bare = false,
  className,
}: IssuanceSnapshotBlockProps) {
  const visibleBreakdown = useMemo(
    () => breakdown.filter((item) => item.count > 0),
    [breakdown]
  )

  const kpiColumn = (
    <KpiGrid
      className={cn(
        reportIssuanceSplitColumnClass,
        "flex flex-col gap-3 self-stretch",
        className
      )}
    >
      <ReportCard tone="muted" className="min-h-0 flex-1 justify-end">
        <CurrencyMetric
          amount={totalPurchaseAmountUah}
          label="сума закупівель, ₴"
          size="sm"
        />
      </ReportCard>
      <ReportCard tone="muted" className="min-h-0 flex-1 justify-end">
        <CurrencyMetric
          amount={lossesUsd}
          currency="$"
          compact
          size="sm"
          label="збитки ворогу, $"
          approximate
        />
      </ReportCard>
      <ReportCard tone="muted" className="min-h-0 flex-1 justify-end">
        <DisplayMetric
          value={closedRequestsCount}
          label={`загалом закритих ${formatRequestCountCaption(closedRequestsCount)}`}
          size="sm"
        />
      </ReportCard>
    </KpiGrid>
  )

  const chartColumn = (
    <ReportCard
      tone="muted"
      data-report-palette="shahedoriz"
      className={cn(reportIssuanceSplitColumnClass, issuanceChartShellClassName)}
    >
      <SectionTitle className="shrink-0 text-background">
        Закритих запитів за проєктами та зборами
      </SectionTitle>
      {visibleBreakdown.length > 0 ? (
        <BreakdownChart breakdown={breakdown} />
      ) : (
        <p className="text-sm opacity-70">
          За обраними фільтрами немає даних для розподілу.
        </p>
      )}
    </ReportCard>
  )

  if (bare) {
    return (
      <TooltipProvider>
        {kpiColumn}
        {chartColumn}
      </TooltipProvider>
    )
  }

  return (
    <TooltipProvider>
      <div
        data-slot="issuance-snapshot-block"
        className={cn(
          reportIssuanceDesktopGridClass,
          "grid-cols-1 gap-y-(--report-control-gap) md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-stretch",
          className
        )}
      >
        {kpiColumn}
        {chartColumn}
      </div>
    </TooltipProvider>
  )
}

export type { IssuanceSnapshotBlockProps }
