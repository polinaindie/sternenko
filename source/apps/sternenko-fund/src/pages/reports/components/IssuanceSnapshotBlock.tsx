import { useMemo } from "react"

import {
  METRIC_BAR_SOLID_RADIUS,
  METRIC_BAR_STRETCH_MIN_ROW_HEIGHT,
  METRIC_BAR_STRETCH_MIN_TARGET_HEIGHT,
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
import { cn } from "@workspace/ui/lib/utils"

import {
  formatRequestCountCaption,
  type IssuanceRequestBreakdownItem,
} from "../lib/issuance-analytics"
import { buildIssuanceBreakdownFillColors, ISSUANCE_BREAKDOWN_PROJECT_COLOR_KEY } from "../lib/issuance-breakdown-colors"
import { BreakdownScrollArea } from "./BreakdownScrollArea"
import {
  ChartCursorTooltip,
  ReportChartTooltipBody,
} from "./ReportChartTooltip"
import {
  KpiGrid,
  reportIssuanceDesktopGridClass,
  reportIssuanceSplitColumnClass,
  SectionTitle,
} from "./report-ui"

type IssuanceSnapshotBlockProps = {
  totalPurchaseAmountUah: number
  closedRequestsCount: number
  lossesUsd: number
  breakdown: IssuanceRequestBreakdownItem[]
  emptyMessage: string
  isLoading?: boolean
  /** Render KPI column + chart as grid siblings (no outer wrapper). */
  bare?: boolean
  className?: string
}

const issuanceChartShellClassName =
  "min-h-0 min-w-0 gap-8 self-stretch overflow-hidden rounded-[var(--radius-report-lg)]"

/** --muted-foreground дає лише 3.67:1 на цій картці, тож приглушуємо через --foreground. */
const kpiLabelClassName = "font-normal text-foreground/70"

/**
 * До шести рядів вистачає висоти, яку картці задає KPI-колонка. Далі ряди
 * впираються в підлогу 24px — мінімальну ціль вказівника (WCAG 2.2 SC 2.5.8) —
 * і картка починає рости замість того, щоб тиснути бари в нечитабельні смужки.
 */
const BREAKDOWN_COMFORTABLE_ROW_LIMIT = 6

/**
 * Далі за дванадцять рядів картка вже переважила б KPI-колонку, тож замість
 * зростання лишаємо вікно на дванадцять рядів і прокручуємо список усередині.
 */
const BREAKDOWN_SCROLL_ROW_LIMIT = 12
const BREAKDOWN_DENSE_TRACK_HEIGHT = 24
const BREAKDOWN_DENSE_ROW_GAP = 4
const BREAKDOWN_SCROLL_VIEWPORT_HEIGHT =
  BREAKDOWN_SCROLL_ROW_LIMIT * BREAKDOWN_DENSE_TRACK_HEIGHT +
  (BREAKDOWN_SCROLL_ROW_LIMIT - 1) * BREAKDOWN_DENSE_ROW_GAP

// Довга назва інакше забирає ширину в треку й обрізає відсоток праворуч.
const BREAKDOWN_DENSE_LABEL_CLASS = "max-w-36 [&>span]:truncate"

type BreakdownDensity = {
  rowMinHeight: string
  listClassName?: string
  labelClassName?: string
}

function breakdownDensity(rowCount: number): BreakdownDensity {
  if (rowCount <= BREAKDOWN_COMFORTABLE_ROW_LIMIT) {
    return { rowMinHeight: METRIC_BAR_STRETCH_MIN_ROW_HEIGHT }
  }

  return {
    rowMinHeight: METRIC_BAR_STRETCH_MIN_TARGET_HEIGHT,
    listClassName: "gap-y-1",
    labelClassName: BREAKDOWN_DENSE_LABEL_CLASS,
  }
}

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
        visibleBreakdown.map(
          (item) => ISSUANCE_BREAKDOWN_PROJECT_COLOR_KEY[item.project]
        )
      ),
    [visibleBreakdown]
  )

  const rowCount = visibleBreakdown.length
  const density = breakdownDensity(rowCount)
  const scrolls = rowCount > BREAKDOWN_SCROLL_ROW_LIMIT

  const bars = visibleBreakdown.map((item, index) => {
    const fillColor = fillColors[index]!

    return (
      <MetricBarHorizontal
        key={item.project}
        percent={item.share}
        label={item.project}
        labelClassName={
          scrolls ? BREAKDOWN_DENSE_LABEL_CLASS : density.labelClassName
        }
        valueLabel={formatReportNumber(item.count)}
        valueClassName="text-background"
        fillColor={fillColor}
        // У режимі скролу ряди не розтягуються, тож висота треку задається явно.
        trackHeight={
          scrolls ? `${BREAKDOWN_DENSE_TRACK_HEIGHT}px` : undefined
        }
        trackClassName="bg-current text-white/10 transition-colors hover:text-white/20"
        renderFill={() => (
          <div
            className="size-full w-full min-w-0 transition-[filter] group-hover/bar:brightness-110 group-focus-visible/bar:brightness-110"
            style={{
              backgroundColor: fillColor,
              borderRadius: METRIC_BAR_SOLID_RADIUS,
            }}
          />
        )}
        renderTrack={(track) => (
          <ChartCursorTooltip
            body={
              <ReportChartTooltipBody
                title={item.project}
                rows={[
                  {
                    label: "Закритих запитів",
                    value: formatReportNumber(item.count),
                  },
                  {
                    label: "На суму",
                    value: `${formatReportNumber(item.amountUah)}${UAH_SUFFIX}`,
                  },
                ]}
              />
            }
          >
            {track}
          </ChartCursorTooltip>
        )}
      />
    )
  })

  if (scrolls) {
    return (
      <BreakdownScrollArea
        viewportHeight={BREAKDOWN_SCROLL_VIEWPORT_HEIGHT}
        className={className}
      >
        <MetricBarList variant="solid" className="gap-y-1">
          {bars}
        </MetricBarList>
      </BreakdownScrollArea>
    )
  }

  return (
    <MetricBarList
      variant="solid"
      stretchRows
      rowMinHeight={density.rowMinHeight}
      className={cn("min-h-0 flex-1", density.listClassName, className)}
    >
      {bars}
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
  emptyMessage,
  isLoading = false,
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
      <ReportCard tone="muted" className="min-h-0 flex-1 justify-center">
        <CurrencyMetric
          amount={totalPurchaseAmountUah}
          label="сума закупівель, ₴"
          labelClassName={kpiLabelClassName}
          size="sm"
        />
      </ReportCard>
      <ReportCard tone="muted" className="min-h-0 flex-1 justify-center">
        <CurrencyMetric
          amount={lossesUsd}
          currency="$"
          compact
          size="sm"
          label="збитки ворогу, $"
          labelClassName={kpiLabelClassName}
          approximate
        />
      </ReportCard>
      <ReportCard tone="muted" className="min-h-0 flex-1 justify-center">
        <DisplayMetric
          value={closedRequestsCount}
          label={`загалом закритих ${formatRequestCountCaption(closedRequestsCount)}`}
          labelClassName={kpiLabelClassName}
          size="sm"
        />
      </ReportCard>
    </KpiGrid>
  )

  const chartColumn = (
    <ReportCard
      tone="muted"
      data-report-palette="shahedoriz"
      aria-busy={isLoading}
      className={cn(reportIssuanceSplitColumnClass, issuanceChartShellClassName)}
    >
      <SectionTitle className="shrink-0 [font-family:var(--font-display-black)] text-background">
        Закритих запитів за проєктами
      </SectionTitle>
      {!isLoading && visibleBreakdown.length > 0 ? (
        <BreakdownChart breakdown={breakdown} />
      ) : (
        <p role="status" className="text-sm text-background">
          {isLoading ? "Завантажуємо розподіл…" : emptyMessage}
        </p>
      )}
    </ReportCard>
  )

  if (bare) {
    return (
      <>
        {kpiColumn}
        {chartColumn}
      </>
    )
  }

  return (
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
  )
}

export type { IssuanceSnapshotBlockProps }
