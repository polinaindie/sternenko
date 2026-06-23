import * as React from "react"

import { cn } from "@workspace/ui/lib/utils"

const METRIC_BAR_TRACK_HEIGHT = "6rem"
const METRIC_BAR_HORIZONTAL_TRACK_HEIGHT = "1.5rem"

function metricBarProgressLabel(
  percent: number,
  label?: React.ReactNode
): string {
  const clamped = Math.min(100, Math.max(0, percent))
  return typeof label === "string" && label.trim()
    ? `${label}: ${clamped}%`
    : `${clamped}%`
}

// Signature Sternenko "bottom-fill" bar: percent on top, a stroked column whose
// interior shows the card colour and whose fill rises from the bottom in the
// foreground colour, range label below. Track height is fixed so a row of bars
// shares one baseline (aspect-ratio tracks used to jump when labels differed).
function MetricBar({
  className,
  percent,
  label,
  valueLabel,
  valueCaption,
  trackHeight = METRIC_BAR_TRACK_HEIGHT,
  renderFill,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  percent: number
  label?: React.ReactNode
  valueLabel?: React.ReactNode
  valueCaption?: React.ReactNode
  /** Висота треку стовпця (за замовч. 6rem). */
  trackHeight?: string
  /** Замінює стандартну заливку стовпця (наприклад, для tooltip лише на fill). */
  renderFill?: (clampedPercent: number) => React.ReactNode
}) {
  const clamped = Math.min(100, Math.max(0, percent))
  const progressLabel = metricBarProgressLabel(percent, label)

  return (
    <div
      data-slot="metric-bar"
      className={cn("flex min-w-0 flex-1 flex-col items-center gap-2", className)}
      {...props}
    >
      <span className="[font-family:var(--font-display-dark)] shrink-0 text-base leading-[0.9] tracking-[-0.02em] tabular-nums md:text-lg">
        {percent}%
      </span>
      <div
        role="progressbar"
        aria-label={progressLabel}
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        className="relative w-full shrink-0 overflow-hidden rounded-[var(--radius-report)] border-2 border-current bg-transparent"
        style={{ height: trackHeight }}
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
    </div>
  )
}

// Left-to-right fill: label, track, percent, optional value — for ranked lists.
function MetricBarHorizontal({
  className,
  labelClassName,
  percent,
  label,
  valueLabel,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  percent: number
  label?: React.ReactNode
  valueLabel?: React.ReactNode
  labelClassName?: string
}) {
  const clamped = Math.min(100, Math.max(0, percent))
  const progressLabel = metricBarProgressLabel(percent, label)

  return (
    <div
      data-slot="metric-bar-horizontal"
      className={cn("flex min-w-0 items-center gap-2 md:gap-3", className)}
      {...props}
    >
      {label ? (
        <div
          className={cn(
            "w-[7.5rem] shrink-0 md:w-44",
            labelClassName
          )}
        >
          <span className="text-xs leading-[1.1] tracking-[-0.02em] opacity-80 [overflow-wrap:anywhere]">
            {label}
          </span>
        </div>
      ) : null}
      <div
        role="progressbar"
        aria-label={progressLabel}
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        className="relative min-w-0 flex-1 overflow-hidden rounded-[var(--radius-report)] border-2 border-current bg-transparent"
        style={{ height: METRIC_BAR_HORIZONTAL_TRACK_HEIGHT }}
      >
        <div
          className="absolute inset-y-0 left-0 bg-current"
          style={{ width: `${clamped}%` }}
        />
      </div>
      <span className="[font-family:var(--font-display-dark)] w-9 shrink-0 text-right text-sm leading-[0.9] tracking-[-0.02em] tabular-nums md:w-10 md:text-base">
        {percent}%
      </span>
      {valueLabel ? (
        <span className="w-24 shrink-0 text-right text-sm leading-[1.1] tracking-[-0.02em] tabular-nums md:w-28">
          {valueLabel}
        </span>
      ) : null}
    </div>
  )
}

// Aligned row of bars — tops share a baseline; tracks are fixed height.
function MetricBarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="metric-bar-group"
      className={cn("flex items-start gap-2 md:gap-3", className)}
      {...props}
    />
  )
}

// Stacked horizontal bars — one row per category.
function MetricBarList({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="metric-bar-list"
      className={cn("flex flex-col gap-3", className)}
      {...props}
    />
  )
}

export { MetricBar, MetricBarGroup, MetricBarHorizontal, MetricBarList }
