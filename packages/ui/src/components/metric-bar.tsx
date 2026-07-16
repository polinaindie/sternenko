import * as React from "react"

import { cn } from "@workspace/ui/lib/utils"

const METRIC_BAR_TRACK_HEIGHT = "6rem"
const METRIC_BAR_HORIZONTAL_TRACK_HEIGHT = "1.5rem"
const METRIC_BAR_HORIZONTAL_SOLID_HEIGHT = "2rem"
const METRIC_BAR_HORIZONTAL_LABEL_GAP = "8px"
const METRIC_BAR_SOLID_RADIUS = "4px"
const METRIC_BAR_HORIZONTAL_SOLID_COLUMNS =
  "grid-cols-[auto_minmax(0,1fr)_auto]"

type MetricBarVariant = "track" | "solid"

type MetricBarGroupContextValue = {
  variant?: MetricBarVariant
  plotHeight?: string
  /** Для горизонтальних solid-барів: найбільша частка = 100% ширини ділянки. */
  maxPercent?: number
  /** MetricBarList solid — спільна сітка label | track | value на всі ряди. */
  sharedGrid?: boolean
  /** Розтягнути ряди та треки на всю висоту контейнера списку. */
  stretchRows?: boolean
}

const MetricBarGroupContext = React.createContext<MetricBarGroupContextValue>({})

function useMetricBarGroup(): MetricBarGroupContextValue {
  return React.useContext(MetricBarGroupContext)
}

function normalizedHorizontalBarWidth(
  percent: number,
  maxPercent?: number
): number {
  const clamped = Math.min(100, Math.max(0, percent))
  if (!maxPercent || maxPercent <= 0) return clamped
  return Math.min(100, (clamped / maxPercent) * 100)
}

function metricBarProgressLabel(
  percent: number,
  label?: React.ReactNode
): string {
  const clamped = Math.min(100, Math.max(0, percent))
  return typeof label === "string" && label.trim()
    ? `${label}: ${clamped}%`
    : `${clamped}%`
}

function MetricBarValueBlock({
  label,
  valueCaption,
  valueLabel,
}: {
  label?: React.ReactNode
  valueCaption?: React.ReactNode
  valueLabel?: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "[font-family:var(--font-subheading-black)] flex w-full shrink-0 flex-col items-center gap-0.5 text-center text-sm leading-[0.9] tracking-[-0.02em]",
        valueLabel ? "min-h-12" : undefined
      )}
    >
      {valueLabel ? (
        <span className="whitespace-nowrap tabular-nums">
          {valueLabel}
          {valueCaption ? (
            <span className="opacity-80"> {valueCaption}</span>
          ) : null}
        </span>
      ) : null}
      {label ? (
        <span className="w-full px-0.5 text-lg [overflow-wrap:anywhere]">
          {label}
        </span>
      ) : null}
    </div>
  )
}

// Signature Sternenko bar: percent on top, column, range label below.
// `track` — stroked column with bottom fill (card-style breakdowns).
// `solid` — filled column whose height equals the share %, shared plot baseline.
function MetricBar({
  className,
  percent,
  label,
  valueLabel,
  valueCaption,
  variant,
  fillColor,
  trackHeight = METRIC_BAR_TRACK_HEIGHT,
  renderFill,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  percent: number
  label?: React.ReactNode
  valueLabel?: React.ReactNode
  valueCaption?: React.ReactNode
  /** `track` — обведений трек із заливкою знизу; `solid` — суцільний стовпець на всю висоту частки. */
  variant?: MetricBarVariant
  /** Колір заливки для `variant="solid"`. */
  fillColor?: string
  /** Висота треку стовпця (за замовч. 6rem). */
  trackHeight?: string
  /** Замінює стандартну заливку стовпця (наприклад, для tooltip лише на fill). */
  renderFill?: (clampedPercent: number) => React.ReactNode
}) {
  const group = useMetricBarGroup()
  const resolvedVariant = variant ?? group.variant ?? "track"
  const plotHeight = trackHeight ?? group.plotHeight ?? METRIC_BAR_TRACK_HEIGHT
  const clamped = Math.min(100, Math.max(0, percent))
  const progressLabel = metricBarProgressLabel(percent, label)

  const percentLabel = (
    <span className="[font-family:var(--font-display-dark)] shrink-0 text-base leading-[0.9] tracking-[-0.02em] tabular-nums md:text-lg">
      {percent}%
    </span>
  )

  if (resolvedVariant === "solid") {
    const solidBar = renderFill ? (
      renderFill(clamped)
    ) : (
      <div
        className="w-full shrink-0 rounded-[var(--radius-report)]"
        style={{
          height: `${clamped}%`,
          backgroundColor: fillColor ?? "currentColor",
        }}
      />
    )

    return (
      <div
        data-slot="metric-bar"
        data-variant="solid"
        className={cn("flex min-w-0 flex-1 flex-col items-center gap-2", className)}
        {...props}
      >
        {percentLabel}
        <div
          role="progressbar"
          aria-label={progressLabel}
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
          className="flex w-full shrink-0 flex-col justify-end"
          style={{ height: plotHeight }}
        >
          {solidBar}
        </div>
        <MetricBarValueBlock
          label={label}
          valueCaption={valueCaption}
          valueLabel={valueLabel}
        />
      </div>
    )
  }

  return (
    <div
      data-slot="metric-bar"
      data-variant="track"
      className={cn("flex min-w-0 flex-1 flex-col items-center gap-2", className)}
      {...props}
    >
      {percentLabel}
      <div
        role="progressbar"
        aria-label={progressLabel}
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        className="relative w-full shrink-0 overflow-hidden rounded-[var(--radius-report)] border-2 border-current bg-transparent"
        style={{ height: plotHeight }}
      >
        {renderFill ? (
          renderFill(clamped)
        ) : (
          <div
            className="absolute inset-x-0 bottom-0 bg-current"
            style={{ height: `${clamped}%` }}
          />
        )}
      </div>
      <MetricBarValueBlock
        label={label}
        valueCaption={valueCaption}
        valueLabel={valueLabel}
      />
    </div>
  )
}

// Left-to-right ranked bars: label, full-width track, value (percent) on the right.
// `track` — stroked row with left fill; `solid` — muted track + colored fill at share %.
function MetricBarHorizontal({
  className,
  labelClassName,
  percent,
  label,
  valueLabel,
  valueCaption,
  variant,
  fillColor,
  maxPercent,
  trackClassName,
  trackHeight = METRIC_BAR_HORIZONTAL_TRACK_HEIGHT,
  renderFill,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  percent: number
  label?: React.ReactNode
  valueLabel?: React.ReactNode
  valueCaption?: React.ReactNode
  labelClassName?: string
  variant?: MetricBarVariant
  fillColor?: string
  maxPercent?: number
  /** Фон повноширинного треку для `variant="solid"`. */
  trackClassName?: string
  trackHeight?: string
  renderFill?: (clampedPercent: number) => React.ReactNode
}) {
  const group = useMetricBarGroup()
  const resolvedVariant = variant ?? group.variant ?? "track"
  const resolvedMaxPercent = maxPercent ?? group.maxPercent
  const stretchRows = group.stretchRows ?? false
  const clamped = Math.min(100, Math.max(0, percent))
  const fillWidth = resolvedMaxPercent
    ? normalizedHorizontalBarWidth(clamped, resolvedMaxPercent)
    : clamped
  const solidTrackHeight =
    resolvedVariant === "solid"
      ? trackHeight === METRIC_BAR_HORIZONTAL_TRACK_HEIGHT
        ? METRIC_BAR_HORIZONTAL_SOLID_HEIGHT
        : trackHeight
      : trackHeight
  const progressLabel = metricBarProgressLabel(percent, label)

  const percentLabel = (
    <span className="[font-family:var(--font-display-dark)] shrink-0 text-sm leading-[0.9] tracking-[-0.02em] tabular-nums md:text-base">
      {percent}%
    </span>
  )

  const labelBlock = label ? (
    <div
      className={cn(
        resolvedVariant === "solid"
          ? "w-[105px] max-w-[105px] shrink-0 justify-self-start text-left"
          : "w-[7.5rem] shrink-0 md:w-44",
        stretchRows && resolvedVariant === "solid" && "self-center",
        labelClassName
      )}
    >
      <span
        className={cn(
          "block tracking-[-0.02em] [overflow-wrap:anywhere]",
          resolvedVariant === "solid"
            ? "[font-family:var(--font-subheading-dark)] text-sm leading-4 md:text-base"
            : "text-xs leading-[1.1] opacity-80"
        )}
      >
        {label}
      </span>
    </div>
  ) : null

  const valueBlock = valueLabel ? (
    <span
      className={cn(
        "[font-family:var(--font-subheading-black)] shrink-0 text-sm leading-[0.9] tracking-[-0.02em] tabular-nums",
        resolvedVariant === "solid"
          ? "whitespace-nowrap text-right"
          : "ml-3 w-24 text-right md:ml-4 md:w-28"
      )}
    >
      {valueLabel}
      {valueCaption ? (
        <span className="opacity-80"> {valueCaption}</span>
      ) : null}
    </span>
  ) : null

  if (resolvedVariant === "solid") {
    const solidBar = renderFill ? (
      renderFill(clamped)
    ) : (
      <div
        className="size-full w-full min-w-0"
        style={{
          backgroundColor: fillColor ?? "currentColor",
          borderRadius: METRIC_BAR_SOLID_RADIUS,
        }}
      />
    )

    return (
      <div
        data-slot="metric-bar-horizontal"
        data-variant="solid"
        className={cn(
          group.sharedGrid ? "contents" : "grid min-w-0 items-center",
          !group.sharedGrid && METRIC_BAR_HORIZONTAL_SOLID_COLUMNS,
          className
        )}
        style={
          group.sharedGrid ? undefined : { columnGap: METRIC_BAR_HORIZONTAL_LABEL_GAP }
        }
        {...props}
      >
        {labelBlock ?? <div aria-hidden />}
        <div
          role="progressbar"
          aria-label={progressLabel}
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
          className={cn(
            "relative w-full min-w-0 overflow-hidden",
            stretchRows && "h-full min-h-8 self-stretch",
            trackClassName ?? "bg-background/15"
          )}
          style={{
            height: stretchRows ? undefined : solidTrackHeight,
            borderRadius: METRIC_BAR_SOLID_RADIUS,
          }}
        >
          {clamped > 0 ? (
            <div
              className="absolute inset-y-0 left-0 min-w-0"
              style={{
                width: `${fillWidth}%`,
                minWidth: "2px",
              }}
            >
              {solidBar}
            </div>
          ) : null}
        </div>
        <span
          className={cn(
            "[font-family:var(--font-subheading-black)] shrink-0 whitespace-nowrap text-left text-sm leading-[0.9] tracking-[-0.02em] tabular-nums",
            stretchRows && "self-center",
            resolvedVariant === "solid" && "justify-self-start"
          )}
        >
          {valueLabel ? (
            <>
              {valueLabel}
              {valueCaption ? (
                <span className="opacity-80"> {valueCaption}</span>
              ) : null}
            </>
          ) : null}
          <span className="opacity-60"> ({percent}%)</span>
        </span>
      </div>
    )
  }

  return (
    <div
      data-slot="metric-bar-horizontal"
      data-variant="track"
      className={cn("flex min-w-0 items-center gap-2 md:gap-3", className)}
      {...props}
    >
      {labelBlock}
      <div
        role="progressbar"
        aria-label={progressLabel}
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        className="relative min-w-0 flex-1 overflow-hidden rounded-[var(--radius-report)] border-2 border-current bg-transparent"
        style={{ height: trackHeight }}
      >
        <div
          className="absolute inset-y-0 left-0 bg-current"
          style={{ width: `${clamped}%` }}
        />
      </div>
      {percentLabel}
      {valueBlock}
    </div>
  )
}

// Aligned row of bars — percent labels share a baseline; plot area shares bottom.
function MetricBarGroup({
  className,
  variant = "track",
  plotHeight = METRIC_BAR_TRACK_HEIGHT,
  ...props
}: React.ComponentProps<"div"> & {
  variant?: MetricBarVariant
  /** Висота ділянки стовпців для `variant="solid"`. */
  plotHeight?: string
}) {
  return (
    <MetricBarGroupContext.Provider value={{ variant, plotHeight }}>
      <div
        data-slot="metric-bar-group"
        data-variant={variant}
        className={cn(
          "flex gap-2 md:gap-3",
          variant === "solid" ? "items-stretch" : "items-start",
          className
        )}
        {...props}
      />
    </MetricBarGroupContext.Provider>
  )
}

// Stacked horizontal bars — one row per category; solid variant uses a shared grid.
function MetricBarList({
  className,
  variant,
  maxPercent,
  stretchRows,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  variant?: MetricBarVariant
  maxPercent?: number
  stretchRows?: boolean
}) {
  const isSolidGrid = variant === "solid"

  const resolvedMaxPercent = React.useMemo(() => {
    if (maxPercent != null) return maxPercent
    if (!isSolidGrid) return undefined

    let max = 0
    React.Children.forEach(children, (child) => {
      if (
        React.isValidElement<{ percent?: number }>(child) &&
        typeof child.props.percent === "number"
      ) {
        max = Math.max(max, child.props.percent)
      }
    })

    return max > 0 ? max : undefined
  }, [children, isSolidGrid, maxPercent])

  const rowCount = React.Children.count(children)

  return (
    <MetricBarGroupContext.Provider
      value={{
        variant,
        maxPercent: resolvedMaxPercent,
        sharedGrid: isSolidGrid,
        stretchRows,
      }}
    >
      <div
        data-slot="metric-bar-list"
        data-variant={variant}
        className={cn(
          isSolidGrid
            ? cn(
                "grid w-full min-w-0 items-center gap-y-3",
                stretchRows && "h-full min-h-0 items-stretch",
                METRIC_BAR_HORIZONTAL_SOLID_COLUMNS
              )
            : "flex flex-col gap-3",
          className
        )}
        style={
          isSolidGrid
            ? {
                columnGap: METRIC_BAR_HORIZONTAL_LABEL_GAP,
                ...(stretchRows && rowCount > 0
                  ? { gridTemplateRows: `repeat(${rowCount}, minmax(0, 1fr))` }
                  : {}),
              }
            : undefined
        }
        {...props}
      >
        {children}
      </div>
    </MetricBarGroupContext.Provider>
  )
}

export {
  METRIC_BAR_HORIZONTAL_SOLID_COLUMNS,
  METRIC_BAR_HORIZONTAL_SOLID_HEIGHT,
  METRIC_BAR_SOLID_RADIUS,
  METRIC_BAR_TRACK_HEIGHT,
  MetricBar,
  MetricBarGroup,
  MetricBarHorizontal,
  MetricBarList,
}
export type { MetricBarVariant }
