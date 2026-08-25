import { cn } from "@workspace/ui/lib/utils"

export type MetricTrendProps = {
  deltaPercent: number | null
  /** @deprecated sparklines removed — kept for call-site compat */
  sparkline?: number[]
  className?: string
}

function trendBadgeClass(deltaPercent: number | null): string {
  if (deltaPercent == null) return "text-primary-foreground/55 border-primary-foreground/20"
  if (deltaPercent > 0) return "text-primary-foreground border-primary-foreground/45"
  if (deltaPercent < 0) return "text-primary-foreground/70 border-primary-foreground/30"
  return "text-primary-foreground/55 border-primary-foreground/20"
}

function trendArrow(deltaPercent: number | null): string {
  if (deltaPercent == null || deltaPercent === 0) return ""
  return deltaPercent > 0 ? "↑ " : "↓ "
}

/** Компактний бейдж динаміки в кутку картки — без спарклайна. */
export function MetricTrend({ deltaPercent, className }: MetricTrendProps) {
  if (deltaPercent == null) return null

  const sign = deltaPercent > 0 ? "+" : ""
  const label = `${trendArrow(deltaPercent)}${sign}${Math.abs(deltaPercent)}%`

  return (
    <span
      className={cn(
        "[font-family:var(--font-display-dark)] absolute top-3 right-3 rounded-[var(--radius-report-lg)] border px-2 py-0.5 text-[0.65rem] leading-none tracking-[-0.02em] tabular-nums uppercase md:top-4 md:right-4 md:text-xs",
        trendBadgeClass(deltaPercent),
        className
      )}
    >
      {label}
    </span>
  )
}
