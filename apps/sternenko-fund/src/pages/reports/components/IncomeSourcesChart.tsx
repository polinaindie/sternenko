import { useCallback, useId, useLayoutEffect, useMemo, useRef, useState } from "react"
import {
  Bar,
  BarChart,
  BarStack,
  CartesianGrid,
  useOffset,
  useYAxisTicks,
  XAxis,
  YAxis,
} from "recharts"

import { Button } from "@workspace/ui/components/button"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@workspace/ui/components/chart"
import {
  formatCompactReportNumber,
  formatReportNumber,
  UAH_SUFFIX,
} from "@workspace/ui/components/report-metric"
import { cn } from "@workspace/ui/lib/utils"

import { ChartScrollEdgeFade } from "./ChartScrollEdgeFade"
import { ChartScrollDiscoveryHint } from "./ChartScrollHint"
import { EmptyReportState } from "./ReportPagination"
import {
  applyStackedBarMinSegmentDisplay,
  CHART_BAR_GAP,
  chartBarLayout,
  chartCategoryWidth,
  resolveIncomeChartSources,
  type IncomeChartRow,
} from "../lib/income-analytics"
import type { IncomeSource } from "../data/income-transactions"
import {
  INCOME_CHART_KEYS,
  INCOME_SOURCE_CHART_KEY,
  INCOME_SOURCES,
  type ChartGranularity,
} from "../mock-data"

/**
 * Палітра бренду фонду — кожне джерело має свій колір (не відтінки жовтого).
 * Контраст vs #1E1E1E перевірено: усі ≥3:1 (WCAG 1.4.11 AA).
 */
const CHART_COLORS = [
  "#FE6A34", // Monobank — помаранчевий (donations)
  "#FFD62E", // ПриватБанк — жовтий (shahedoriz)
  "#59CBE7", // Гривневий рахунок — блакитний (nebesnyi)
  "#829474", // Валютний рахунок — оливковий (potochnyi)
] as const

const GRANULARITY_LABEL: Record<ChartGranularity, string> = {
  day: "день",
  week: "тиждень",
  month: "місяць",
}

const chartConfig = Object.fromEntries(
  INCOME_SOURCES.map((source, index) => [
    INCOME_SOURCE_CHART_KEY[source],
    { label: source, color: CHART_COLORS[index % CHART_COLORS.length] },
  ])
) satisfies ChartConfig

const CHART_HEIGHT = 400
const CHART_MARGIN_TOP = 8
/** Висота plot area при повернутих підписах осі X — фіксуємо, щоб стовпці не росли при підгонці осі. */
const PLOT_HEIGHT_ROTATED =
  CHART_HEIGHT - CHART_MARGIN_TOP - 8 - 96
const Y_AXIS_MIN_WIDTH = 48
const Y_AXIS_LABEL_PADDING = 4
const X_AXIS_HEIGHT_DEFAULT = 36
/** dd.mm.yy −45°: під віссю ~43px + tickMargin; 96px лишало ~61px порожнього простору знизу SVG. */
const X_AXIS_HEIGHT_ROTATED = 52
/** dd.mm.yy–dd.mm.yy −45°: довший підпис потребує більше місця знизу SVG. */
const X_AXIS_HEIGHT_ROTATED_WEEK = 84
/** Горизонтальний підпис тижневого діапазону (рідко, коли стовпці широкі). */
const X_AXIS_HEIGHT_WEEK = 44
/** Запас зліва/справа, щоб повернуті підписи осі X не обрізались SVG. */
const X_AXIS_ROTATED_MARGIN_X = 32
/** Тижневий діапазон довший — перший підпис −45° виходить ліворуч за plot margin 32px. */
const X_AXIS_ROTATED_MARGIN_X_WEEK = 48

function xAxisRotatedMarginX(granularity: ChartGranularity): number {
  return granularity === "week"
    ? X_AXIS_ROTATED_MARGIN_X_WEEK
    : X_AXIS_ROTATED_MARGIN_X
}
/** Підпис «dd.mm.yy» (~12px); при багатьох днях — −45° і крок раз на 3 дні. */
const X_LABEL_MIN_PX = 52
/** Тижневий «dd.mm.yy–dd.mm.yy» (~120px горизонтально) — раніше поріг 52px лишав підписи горизонтальними і вони злипались. */
const X_LABEL_MIN_PX_WEEK = 120
const X_LABEL_TARGET_PX = 80
const X_LABEL_TARGET_PX_WEEK = 120
/** Крок підписів осі X у режимі «день», коли дні займають усю ширину графіка. */
const X_DAY_LABEL_STEP = 3
/** Верхні кути стовпців — однакові, гостріші за --radius-report (4px). Низ завжди 0. */
const BAR_TOP_RADIUS = 4

const AXIS_LINE = { stroke: "rgba(255,255,255,0.28)", strokeWidth: 1 }
const GRID_STROKE = "rgba(255,255,255,0.1)"

const chartAxisClass =
  "[&_.recharts-cartesian-axis-tick_text]:fill-[#FFFFFF] [&_.recharts-cartesian-axis-tick_text]:text-xs [&_.recharts-cartesian-axis-tick_text]:uppercase [&_.recharts-yAxis_.recharts-cartesian-axis-tick_text]:[font-family:var(--font-subheading-dark)] [&_.recharts-xAxis_.recharts-cartesian-axis-tick_text]:[font-family:var(--font-sans-light)] [&_.recharts-xAxis_.recharts-cartesian-axis-tick_text]:font-normal [&_.recharts-surface]:overflow-visible [&_.recharts-wrapper]:overflow-visible"

const chartShellClass =
  "overflow-visible [&_.recharts-surface]:overflow-visible [&_.recharts-wrapper]:overflow-visible [&_svg]:[background:unset]"

function formatYAxisTick(value: number): string {
  return formatCompactReportNumber(value).replace(/\s/g, "\u00A0")
}

function isDisplayablePeriodLabel(label: unknown): boolean {
  if (label == null) return false
  if (typeof label === "number" && !Number.isFinite(label)) return false
  const text = String(label).trim()
  if (!text) return false
  return !text.includes("NaN")
}

function isDisplayableTooltipValue(value: unknown): boolean {
  const numeric = Number(value)
  return Number.isFinite(numeric) && numeric !== 0
}

function tooltipStackOrderTopToBottom(
  sources: readonly IncomeSource[]
): string[] {
  return [...sources].reverse().map((source) => INCOME_SOURCE_CHART_KEY[source])
}

function chartRowTotal(
  row: IncomeChartRow,
  sources: readonly IncomeSource[]
): number {
  return sources.reduce(
    (sum, source) => sum + (row[INCOME_SOURCE_CHART_KEY[source]] ?? 0),
    0
  )
}

function sourceChartColor(source: IncomeSource): string {
  const index = INCOME_SOURCES.indexOf(source)
  return CHART_COLORS[index % CHART_COLORS.length]!
}

/** У stacked bar перший Bar — знизу; у тултіпі показуємо сегменти зверху вниз. */
function sortTooltipPayloadByStackOrder<
  T extends { dataKey?: unknown; name?: unknown },
>(payload: readonly T[], stackOrder: readonly string[]): T[] {
  return [...payload].sort((a, b) => {
    const aKey = String(a.dataKey ?? a.name ?? "")
    const bKey = String(b.dataKey ?? b.name ?? "")
    const aIndex = stackOrder.indexOf(aKey)
    const bIndex = stackOrder.indexOf(bKey)
    if (aIndex === -1 && bIndex === -1) return 0
    if (aIndex === -1) return 1
    if (bIndex === -1) return -1
    return aIndex - bIndex
  })
}

const Y_AXIS_TICK_MARGIN = 2

function fallbackYTickCoordinate(
  value: number,
  yMax: number,
  marginTop: number,
  plotHeight: number
): number {
  if (yMax <= 0) return marginTop
  return marginTop + (1 - value / yMax) * plotHeight
}

/** Публікує Y-координати tickів основного графіка — для підписів ліворуч. */
function YTickCoordinatePublisher({
  onCoordinatesChange,
}: {
  onCoordinatesChange: (coordinates: Map<number, number>) => void
}) {
  const ticks = useYAxisTicks()

  useLayoutEffect(() => {
    if (!ticks?.length) return
    const next = new Map<number, number>()
    for (const tick of ticks) {
      const value = Number(tick.value)
      if (Number.isFinite(value)) {
        next.set(value, tick.coordinate)
      }
    }
    onCoordinatesChange(next)
  }, [ticks, onCoordinatesChange])

  return null
}

function IncomeChartYAxisLabels({
  yTicks,
  yMax,
  yAxisWidth,
  chartHeight,
  marginTop,
  plotHeight,
  coordinates,
}: {
  yTicks: number[]
  yMax: number
  yAxisWidth: number
  chartHeight: number
  marginTop: number
  plotHeight: number
  coordinates: Map<number, number>
}) {
  const labelX = yAxisWidth - Y_AXIS_TICK_MARGIN

  return (
    <svg
      aria-hidden="true"
      width={yAxisWidth}
      height={chartHeight}
      className="shrink-0 overflow-visible"
    >
      {yTicks.map((value) => {
        const y =
          coordinates.get(value) ??
          fallbackYTickCoordinate(value, yMax, marginTop, plotHeight)

        return (
          <text
            key={value}
            x={labelX}
            y={y}
            dominantBaseline="central"
            alignmentBaseline="central"
            textAnchor="end"
            fill="#FFFFFF"
            fontSize={12}
            fontFamily="var(--font-subheading-dark, ui-sans-serif, system-ui, sans-serif)"
            style={{ textTransform: "uppercase" }}
          >
            {formatYAxisTick(value)}
          </text>
        )
      })}
    </svg>
  )
}

const xTickFont = {
  fill: "#FFFFFF",
  fontSize: 12,
  fontFamily:
    "var(--font-sans-light, var(--font-sans, ui-sans-serif, system-ui, sans-serif))",
  style: { textTransform: "uppercase" as const, fontWeight: 400 },
}

function xAxisHeightForGranularity(
  granularity: ChartGranularity,
  rotated: boolean
): number {
  if (!rotated) {
    return granularity === "week" ? X_AXIS_HEIGHT_WEEK : X_AXIS_HEIGHT_DEFAULT
  }
  return granularity === "week"
    ? X_AXIS_HEIGHT_ROTATED_WEEK
    : X_AXIS_HEIGHT_ROTATED
}

/** Зсув повернутого підпису — кінчик дати над центром стовпця. */
const X_TICK_ROTATED_OFFSET_X = 0

function XAxisTick({
  x = 0,
  y = 0,
  payload,
  rotated = false,
  bandWidth,
  marginLeft = 0,
  dataIndex,
  granularity = "day",
}: {
  x?: number | string
  y?: number | string
  payload?: { value?: unknown }
  rotated?: boolean
  bandWidth?: number
  marginLeft?: number
  /** Індекс рядка в data[] — для точного центру смуги бару. */
  dataIndex?: number
  granularity?: ChartGranularity
}) {
  const label = payload?.value != null ? String(payload.value) : ""
  if (!isDisplayablePeriodLabel(label)) return null

  const tickFont = {
    ...xTickFont,
    fontSize: granularity === "week" ? 11 : xTickFont.fontSize,
  }

  const centerX =
    rotated && bandWidth != null && dataIndex != null && dataIndex >= 0
      ? marginLeft + (dataIndex + 0.5) * bandWidth + X_TICK_ROTATED_OFFSET_X
      : Number(x)

  if (rotated) {
    const anchorY = Number(y)
    return (
      <text
        x={centerX}
        y={anchorY}
        textAnchor="end"
        dominantBaseline="hanging"
        transform={`rotate(-45, ${centerX}, ${anchorY})`}
        {...tickFont}
      >
        {label}
      </text>
    )
  }

  return (
    <text x={centerX} y={Number(y)} dy={8} textAnchor="middle" {...tickFont}>
      {label}
    </text>
  )
}

function measureYAxisWidth(ticks: number[]): number {
  if (typeof document === "undefined") {
    return Y_AXIS_MIN_WIDTH
  }

  const canvas = document.createElement("canvas")
  const context = canvas.getContext("2d")
  if (!context) {
    return Y_AXIS_MIN_WIDTH
  }

  context.font =
    '600 12px "Murs Gothic Narrow Dark", ui-sans-serif, system-ui, sans-serif'

  const maxLabelWidth = ticks.reduce((max, tick) => {
    const label = formatYAxisTick(tick)
    return Math.max(max, context.measureText(label).width)
  }, 0)

  return Math.max(
    Y_AXIS_MIN_WIDTH,
    Math.ceil(maxLabelWidth + Y_AXIS_LABEL_PADDING)
  )
}

function niceCeil(value: number): number {
  if (value <= 0) return 1000
  const pow = 10 ** Math.floor(Math.log10(value))
  const n = value / pow
  const nice = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10
  return nice * pow
}

function niceStepSize(roughStep: number): number {
  if (roughStep <= 0) return 1
  const exponent = Math.floor(Math.log10(roughStep))
  const magnitude = 10 ** exponent
  const normalized = roughStep / magnitude
  const nice =
    normalized <= 1
      ? 1
      : normalized <= 2
        ? 2
        : normalized <= 2.5
          ? 2.5
          : normalized <= 5
            ? 5
            : 10
  return nice * magnitude
}

const Y_AXIS_TARGET_TICKS = 6
const Y_AXIS_MAX_TICKS = 7

/** Підписи осі Y з «гарним» кроком — не більше 6–7 позначок, щоб не злипались у режимі «місяць». */
function computeRoundYTicks(maxTotal: number): { yMax: number; yTicks: number[] } {
  if (maxTotal <= 0) {
    return { yMax: 50_000, yTicks: [0, 10_000, 20_000, 30_000, 40_000, 50_000] }
  }

  const yMax = niceCeil(maxTotal)
  let step = niceStepSize(yMax / (Y_AXIS_TARGET_TICKS - 1))

  while (Math.floor(yMax / step) + 1 > Y_AXIS_MAX_TICKS) {
    step = niceStepSize(step * 1.5)
  }

  const yTicks: number[] = []
  for (let value = 0; value <= yMax; value += step) {
    yTicks.push(Math.round(value))
  }

  return { yMax, yTicks }
}

/** Горизонтальна сітка від x=0 (зона Y-підписів) до кінця plot area. */
function ExtendedCartesianGrid() {
  const offset = useOffset()
  if (!offset) return null

  return (
    <CartesianGrid
      vertical={false}
      syncWithTicks
      stroke={GRID_STROKE}
      strokeWidth={1}
      x={0}
      width={offset.left + offset.width}
    />
  )
}

type IncomeSourcesChartProps = {
  data: IncomeChartRow[]
  granularity: ChartGranularity
  onGranularityChange: (granularity: ChartGranularity) => void
  /** Обрані джерела з фільтра; у легенді лишаються навіть без даних за період. */
  activeSources?: readonly IncomeSource[]
}

/** На пристроях без hover (мобайл/тач-планшет) тултіп відкривається по тапу. */
function useChartTooltipTrigger(): "hover" | "click" {
  const [trigger, setTrigger] = useState<"hover" | "click">(() => {
    if (typeof window === "undefined") return "hover"
    return window.matchMedia("(hover: none), (pointer: coarse)").matches
      ? "click"
      : "hover"
  })

  useLayoutEffect(() => {
    const mq = window.matchMedia("(hover: none), (pointer: coarse)")
    const update = () => setTrigger(mq.matches ? "click" : "hover")
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  return trigger
}

export function IncomeSourcesChart({
  data,
  granularity,
  onGranularityChange,
  activeSources = INCOME_SOURCES,
}: IncomeSourcesChartProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const descriptionId = useId()
  const tooltipTrigger = useChartTooltipTrigger()
  const hasData = data.length > 0
  const chartSources = useMemo(
    () => resolveIncomeChartSources(activeSources),
    [activeSources]
  )
  const tooltipStackOrder = useMemo(
    () => tooltipStackOrderTopToBottom(chartSources),
    [chartSources]
  )

  const [scrollViewportWidth, setScrollViewportWidth] = useState(0)
  const [yTickCoordinates, setYTickCoordinates] = useState<Map<number, number>>(
    () => new Map()
  )
  const handleYTickCoordinates = useCallback((coordinates: Map<number, number>) => {
    setYTickCoordinates(coordinates)
  }, [])

  useLayoutEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const update = () => {
      setScrollViewportWidth(el.clientWidth)
    }
    update()
    el.addEventListener("scroll", update, { passive: true })
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => {
      el.removeEventListener("scroll", update)
      observer.disconnect()
    }
  }, [hasData, granularity, data.length])

  const chartDescription = useMemo(() => {
    if (data.length === 0) return ""
    const bucketCount = data.length
    const maxTotal = data.reduce(
      (max, row) => Math.max(max, chartRowTotal(row, chartSources)),
      0
    )
    const periodLabel = GRANULARITY_LABEL[granularity]
    const sourceList = chartSources.join(", ")
    return (
      `Стовпчиковий графік надходжень у гривнях за ${bucketCount} ${periodLabel}${bucketCount === 1 ? "" : bucketCount < 5 ? "і" : "ів"}. ` +
      `Кожен стовпець показує суму за один ${periodLabel}, розбиту за джерелами: ${sourceList}. ` +
      `Максимальна сума за період — ${formatReportNumber(maxTotal)} гривень. ` +
      `Кольори доповнюють підписи в легенді; не покладайтесь лише на колір.`
    )
  }, [chartSources, data, granularity])

  if (data.length === 0) {
    return (
      <EmptyReportState message="За обраний період немає даних для графіка." />
    )
  }

  const bucketCount = data.length

  const chartMarginForLayout = {
    top: 8,
    right: 8,
    bottom: 0,
    left: 0,
  } as const

  const barLayout = chartBarLayout(
    granularity,
    bucketCount,
    scrollViewportWidth,
    chartMarginForLayout.left + chartMarginForLayout.right
  )

  const fillsViewport = barLayout.fillsViewport
  const categoryWidth = barLayout.categoryWidth

  const xLabelMinPx =
    granularity === "week" ? X_LABEL_MIN_PX_WEEK : X_LABEL_MIN_PX
  const rotateXLabels = categoryWidth < xLabelMinPx
  const xAxisHeight = xAxisHeightForGranularity(granularity, rotateXLabels)
  const rotatedMarginX = rotateXLabels
    ? xAxisRotatedMarginX(granularity)
    : chartMarginForLayout.left

  const chartMargin = {
    top: chartMarginForLayout.top,
    right: rotateXLabels ? rotatedMarginX : chartMarginForLayout.right,
    bottom: 0,
    left: rotateXLabels ? rotatedMarginX : chartMarginForLayout.left,
  } as const

  const chartHeight = rotateXLabels
    ? CHART_MARGIN_TOP + PLOT_HEIGHT_ROTATED + xAxisHeight
    : CHART_HEIGHT

  const plotHeightPx = chartHeight - chartMargin.top - xAxisHeight

  const {
    barWidth: resolvedBarWidth,
    barGap: resolvedBarGap,
    categoryWidth: resolvedCategoryWidth,
    fillsViewport: resolvedFillsViewport,
  } =
    rotateXLabels && fillsViewport
      ? chartBarLayout(
          granularity,
          bucketCount,
          scrollViewportWidth,
          chartMargin.left + chartMargin.right
        )
      : barLayout

  const finalBarWidth = resolvedBarWidth
  const finalBarGap = resolvedBarGap
  const finalCategoryWidth = resolvedCategoryWidth

  const viewportReady = scrollViewportWidth > 0
  const minPlotChartWidth =
    bucketCount * chartCategoryWidth(granularity) +
    chartMargin.left +
    chartMargin.right
  const mustScroll =
    viewportReady && minPlotChartWidth > scrollViewportWidth + 1
  /** До вимірювання viewport не розтягуємо — інакше Recharts стискає всі стовпці і скрол зникає. */
  const finalFillsViewport =
    viewportReady && resolvedFillsViewport && !mustScroll

  /** Plot area: розтягується до viewport або hug content при скролі. */
  const plotWidth = finalFillsViewport
    ? Math.max(
        scrollViewportWidth - chartMargin.left - chartMargin.right,
        bucketCount * finalCategoryWidth
      )
    : bucketCount * finalCategoryWidth

  const xLabelTargetPx =
    granularity === "week" ? X_LABEL_TARGET_PX_WEEK : X_LABEL_TARGET_PX
  const maxLabels = Math.max(2, Math.floor(plotWidth / xLabelTargetPx))
  const tickInterval = Math.max(0, Math.ceil(bucketCount / maxLabels) - 1)
  /** Крок тижневих підписів — не показуємо всі діапазони, коли вони не вміщаються. */
  const weekLabelStep = Math.max(1, Math.ceil(bucketCount / maxLabels))

  /** Явний список підписів — надійніше за interval при кастомному tick. */
  const xAxisTicks =
    granularity === "week"
      ? data
          .filter((_, index) => index % weekLabelStep === 0)
          .map((row) => row.period)
          .filter(isDisplayablePeriodLabel)
      : granularity === "day" && rotateXLabels
        ? data
            .filter((_, index) => index % X_DAY_LABEL_STEP === 0)
            .map((row) => row.period)
            .filter(isDisplayablePeriodLabel)
        : undefined

  const xTickInterval =
    finalFillsViewport && !rotateXLabels ? 0 : xAxisTicks ? 0 : tickInterval

  const maxTotal = data.reduce(
    (max, row) => Math.max(max, chartRowTotal(row, chartSources)),
    0
  )
  const yAxisScale = computeRoundYTicks(maxTotal)
  const yMax = yAxisScale.yMax
  const yTicks = yAxisScale.yTicks
  const yAxisWidth = measureYAxisWidth(yTicks)

  const displayData = useMemo(
    () => applyStackedBarMinSegmentDisplay(data, yMax, plotHeightPx),
    [data, yMax, plotHeightPx]
  )

  const bandWidth = finalCategoryWidth
  const plotChartWidth = finalFillsViewport
    ? scrollViewportWidth > 0
      ? scrollViewportWidth
      : plotWidth + chartMargin.left + chartMargin.right
    : plotWidth + chartMargin.left + chartMargin.right

  const needsScroll =
    !finalFillsViewport &&
    scrollViewportWidth > 0 &&
    plotChartWidth > scrollViewportWidth + 1
  const showHint = needsScroll && granularity !== "month"
  const suggestedGranularity: ChartGranularity =
    bucketCount > 120 ? "month" : "week"

  const barChartProps = {
    barCategoryGap: `${Math.round((finalBarGap / finalCategoryWidth) * 100)}%`,
    barGap: 0,
    maxBarSize: finalBarWidth,
  } as const

  return (
    <figure
      className="flex w-full min-w-0 flex-col gap-6"
      aria-describedby={descriptionId}
    >
      <figcaption className="sr-only">Джерела надходжень, гривня</figcaption>
      <p id={descriptionId} className="sr-only">
        {chartDescription}
      </p>

      <div className="flex w-full min-w-0 items-start">
        {/* Y-вісь фіксована — не скролиться з днями; координати з основного графіка */}
        <IncomeChartYAxisLabels
          yTicks={yTicks}
          yMax={yMax}
          yAxisWidth={yAxisWidth}
          chartHeight={chartHeight}
          marginTop={chartMargin.top}
          plotHeight={plotHeightPx}
          coordinates={yTickCoordinates}
        />

        <div className="relative min-w-0 flex-1">
          <div
            ref={scrollRef}
            className={cn(
              "w-full overflow-x-auto overflow-y-visible pb-1",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
              "[scrollbar-color:rgba(255,255,255,0.22)_transparent] [scrollbar-width:thin]",
              "[&::-webkit-scrollbar]:h-px",
              "[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/20",
              "[&::-webkit-scrollbar-thumb]:hover:bg-white/28",
              "[&::-webkit-scrollbar-track]:bg-transparent"
            )}
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(255,255,255,0.22) transparent",
            }}
            tabIndex={0}
            role="region"
            aria-label="Прокручувана область графіка надходжень"
          >
            <ChartContainer
              config={chartConfig}
              className={cn(
                "aspect-auto justify-start [&_.recharts-responsive-container]:size-full",
                finalFillsViewport ? "w-full min-w-full" : "w-fit shrink-0",
                chartShellClass,
                chartAxisClass
              )}
              style={{
                width: finalFillsViewport ? "100%" : plotChartWidth,
                height: chartHeight,
              }}
            >
              <BarChart
                data={displayData}
                accessibilityLayer
                margin={chartMargin}
                {...barChartProps}
              >
                <ExtendedCartesianGrid />
                <YTickCoordinatePublisher onCoordinatesChange={handleYTickCoordinates} />
                <XAxis
                  dataKey="period"
                  height={xAxisHeight}
                  ticks={xAxisTicks}
                  tick={(props) => {
                    const label =
                      props.payload?.value != null
                        ? String(props.payload.value)
                        : ""
                    const dataIndex = data.findIndex(
                      (row) => row.period === label
                    )
                    return (
                      <XAxisTick
                        {...props}
                        rotated={rotateXLabels}
                        bandWidth={bandWidth}
                        marginLeft={chartMargin.left}
                        dataIndex={dataIndex}
                        granularity={granularity}
                      />
                    )
                  }}
                  tickLine={false}
                  axisLine={AXIS_LINE}
                  interval={xTickInterval}
                  minTickGap={0}
                  tickMargin={rotateXLabels ? 2 : 6}
                />
                <YAxis
                  domain={[0, yMax]}
                  ticks={yTicks}
                  interval={0}
                  width={0}
                  hide
                  padding={{ top: 0, bottom: 0 }}
                  tickMargin={Y_AXIS_TICK_MARGIN}
                />
                <ChartTooltip
                  trigger={tooltipTrigger}
                  shared
                  cursor={{ fill: "#FFD62E", fillOpacity: 0.12 }}
                  content={(props) => {
                    if (!props.active || !props.payload?.length) return null

                    const payload = sortTooltipPayloadByStackOrder(
                      props.payload
                        .filter(
                          (item) =>
                            item.type !== "none" &&
                            isDisplayableTooltipValue(item.value)
                        )
                        .map((item) => ({
                          ...item,
                          name: item.name ?? String(item.dataKey ?? ""),
                        }))
                        .filter((item) => item.name),
                      tooltipStackOrder
                    )
                    if (payload.length === 0) return null

                    return (
                      <ChartTooltipContent
                        {...props}
                        payload={payload}
                        hideIndicator
                        hideLabel={!isDisplayablePeriodLabel(props.label)}
                        className="rounded-[var(--radius-report)] border-2 border-primary bg-foreground px-3 py-2 text-background shadow-none [&_.font-medium]:[font-family:var(--font-subheading-dark)] [&_.font-medium]:uppercase"
                        formatter={(value, name, item) => {
                          const chartKey = String(item.dataKey ?? name)
                          const row = data.find(
                            (entry) => entry.period === String(props.label ?? "")
                          )
                          const actualValue = row
                            ? Number(row[chartKey as keyof IncomeChartRow] ?? value)
                            : Number(value)
                          const label =
                            chartConfig[name as keyof typeof chartConfig]
                              ?.label ?? name
                          return (
                            <div className="flex w-full items-center gap-2.5">
                              <span
                                aria-hidden="true"
                                className="h-3 w-3 shrink-0 rounded-[var(--radius-report-inner)] ring-1 ring-background/30"
                                style={{ backgroundColor: item.color }}
                              />
                              <span className="flex-1">{label}</span>
                              <span className="[font-family:var(--font-display-dark)] text-sm tabular-nums">
                                {formatReportNumber(actualValue)}
                                {UAH_SUFFIX}
                              </span>
                            </div>
                          )
                        }}
                      />
                    )
                  }}
                />
                <BarStack
                  stackId="income"
                  radius={[BAR_TOP_RADIUS, BAR_TOP_RADIUS, 0, 0]}
                >
                  {chartSources.map((source) => {
                    const chartKey = INCOME_SOURCE_CHART_KEY[source]
                    return (
                      <Bar
                        key={chartKey}
                        dataKey={chartKey}
                        fill={`var(--color-${chartKey})`}
                        stroke="none"
                        isAnimationActive={false}
                      />
                    )
                  })}
                </BarStack>
              </BarChart>
            </ChartContainer>
          </div>
          <ChartScrollEdgeFade scrollRef={scrollRef} enabled={needsScroll} />
          <ChartScrollDiscoveryHint enabled={needsScroll} scrollRef={scrollRef} />
        </div>
      </div>

      <div className="flex w-full min-w-0 flex-col items-center gap-2 pt-1">
        <ul
          role="list"
          aria-label="Джерела надходжень"
          className="flex w-full flex-wrap items-center justify-center gap-x-4 gap-y-1 [font-family:var(--font-subheading-dark)] text-xs tracking-wide text-background/90 uppercase"
        >
          {chartSources.map((source) => (
            <li key={source} className="inline-flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="size-2.5 shrink-0 rounded-[var(--radius-report-inner)] ring-1 ring-background/25"
                style={{
                  backgroundColor: sourceChartColor(source),
                }}
              />
              {source}
            </li>
          ))}
        </ul>

        {showHint ? (
          <p
            role="status"
            className="[font-family:var(--font-sans-light)] m-0 flex w-full flex-wrap items-center justify-center gap-x-1.5 gap-y-0 text-center text-xs text-background/70"
          >
            <span>Прокрутіть графік, щоб побачити весь період, або</span>
            <Button
              type="button"
              size="sm"
              variant="link"
              className="[font-family:var(--font-sans-light)] h-auto min-h-6 p-0 text-xs text-primary underline underline-offset-2 hover:text-primary/90"
              onClick={() => onGranularityChange(suggestedGranularity)}
            >
              згрупуйте по{" "}
              {suggestedGranularity === "month" ? "місяцях" : "тижнях"}
            </Button>
          </p>
        ) : null}
      </div>
    </figure>
  )
}
