import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@workspace/ui/lib/utils"

// Ukrainian-style grouping: thousands separated by a (non-breaking) space —
// "2 861", "225 366 619" — matching the Sternenko report typography.
function formatReportNumber(value: number): string {
  return new Intl.NumberFormat("uk-UA", { maximumFractionDigits: 0 }).format(
    value
  )
}

const COMPACT_UNITS = [
  { threshold: 1_000_000_000, suffix: "МЛРД" },
  { threshold: 1_000_000, suffix: "МЛН" },
  { threshold: 1_000, suffix: "ТИС" },
] as const

// Compact money like "$42 МЛН" / "$7,2 МЛН" — uk-UA uses a decimal comma.
function formatCompactReportNumber(value: number): string {
  const unit = COMPACT_UNITS.find((u) => Math.abs(value) >= u.threshold)
  if (!unit) return formatReportNumber(value)
  const scaled = value / unit.threshold
  const digits = scaled < 10 && !Number.isInteger(scaled) ? 1 : 0
  const number = new Intl.NumberFormat("uk-UA", {
    maximumFractionDigits: digits,
  }).format(scaled)
  return `${number} ${unit.suffix}`
}

const valueVariants = cva(
  "block py-0.5 [font-family:var(--font-display-black)] leading-[1.05] tracking-[-0.02em] text-card-foreground tabular-nums",
  {
    variants: {
      size: {
        sm: "text-3xl md:text-4xl",
        default: "text-4xl md:text-6xl",
        lg: "text-[clamp(2.25rem,22cqi,6rem)]",
      },
    },
    defaultVariants: { size: "default" },
  }
)

type DisplayMetricProps = React.ComponentProps<"div"> &
  VariantProps<typeof valueVariants> & {
    value: number | string
    label?: React.ReactNode
    labelClassName?: string
    align?: "start" | "end"
    layout?: "stack" | "row"
    /** Префікс «≈» біля значення (приблизна оцінка). */
    approximate?: boolean
  }

function DisplayMetric({
  className,
  value,
  label,
  labelClassName,
  size = "default",
  align = "start",
  layout = "stack",
  approximate = false,
  children,
  ...props
}: DisplayMetricProps) {
  const formattedValue =
    typeof value === "number" ? formatReportNumber(value) : value

  const valueEl = (
    <span
      className={cn(valueVariants({ size }))}
      title={approximate ? "Приблизна оцінка" : undefined}
    >
      {approximate ? (
        <>
          <span aria-hidden="true">≈&nbsp;</span>
          {formattedValue}
        </>
      ) : (
        formattedValue
      )}
    </span>
  )
  const labelEl = label ? (
    <span
      className={cn(
        "[font-family:var(--font-sans)] text-lg leading-[0.9] font-medium tracking-[-0.02em] text-card-foreground",
        labelClassName
      )}
    >
      {label}
    </span>
  ) : null

  return (
    <div
      data-slot="display-metric"
      className={cn(
        "@container flex w-full min-w-0 gap-1.5",
        "flex-col",
        (layout === "row" || align === "end") && "items-end",
        align === "end" && "text-right",
        className
      )}
      {...props}
    >
      {valueEl}
      {labelEl}
      {children}
    </div>
  )
}

type CurrencyMetricProps = Omit<DisplayMetricProps, "value"> & {
  amount: number
  currency?: "₴" | "$"
  compact?: boolean
}

const UAH_SUFFIX = "\u00A0₴" as const

function CurrencyMetric({
  amount,
  currency = "₴",
  compact = false,
  ...props
}: CurrencyMetricProps) {
  const formatted = compact
    ? formatCompactReportNumber(amount)
    : formatReportNumber(amount)

  return (
    <DisplayMetric
      data-slot="currency-metric"
      value={`${currency}${formatted}`}
      {...props}
    />
  )
}

export {
  DisplayMetric,
  CurrencyMetric,
  formatReportNumber,
  formatCompactReportNumber,
  UAH_SUFFIX,
}
