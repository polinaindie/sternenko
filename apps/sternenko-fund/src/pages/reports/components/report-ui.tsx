import { createContext, useContext, useId } from "react"
import { ClockIcon } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip"
import { cn } from "@workspace/ui/lib/utils"

import type { ChartGranularity } from "../mock-data"

const FilterControlIdContext = createContext<string | undefined>(undefined)

export function useFilterControlId(explicitId?: string) {
  const fromContext = useContext(FilterControlIdContext)
  return explicitId ?? fromContext
}

/** Site chrome uses sharp corners; filters/buttons inherit --radius: 0 from the theme. */
export const siteControlClass = "rounded-none"

/** Outline filter triggers (date, multiselect, amount) — Storybook Button outline + site chrome. */
export const siteFilterTriggerClass = cn(
  siteControlClass,
  "border-border h-[38px] w-full min-w-0 font-normal [&_span.truncate]:text-muted-foreground"
)

/** Popover panel width matches the filter trigger (Radix anchor width). */
export const filterPopoverContentClass =
  "w-[var(--radix-popover-trigger-width)] max-w-[calc(100vw-2rem)] p-2"

/** Label accent when a filter shows a narrowed selection (not the placeholder). */
export const siteFilterTriggerActiveClass = "[&_span.truncate]:text-white"

/** Primary apply action in a filter row — Wide Bold label, 10px padding. */
export function FilterApplyButton({
  className,
  children = "Фільтрувати",
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      type="button"
      className={cn(
        "shrink-0 [font-family:var(--font-display-dark)] h-[38px] p-2.5 normal-case",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  )
}

/** Secondary reset inside filter popovers — text action, not input-like. */
export function FilterPopoverResetButton({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      type="button"
      variant="ghost"
      className={cn(
        siteControlClass,
        "[font-family:var(--font-display-dark)] text-card-foreground h-8 w-full min-w-0 px-2 text-sm whitespace-nowrap border-0 bg-border font-normal shadow-none hover:bg-muted/60",
        className
      )}
      {...props}
    />
  )
}

/** Primary apply inside filter popovers — same display face as FilterApplyButton. */
export function FilterPopoverApplyButton({
  className,
  children = "Застосувати",
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      type="button"
      className={cn(
        siteControlClass,
        "h-8 w-full min-w-0 px-2 text-sm whitespace-nowrap [font-family:var(--font-display-dark)] normal-case",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  )
}

export function DataFreshnessBadge({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        "border-border bg-muted text-muted-foreground inline-flex w-fit items-center rounded-[var(--radius-report-lg)] border px-2.5 py-1 text-xs",
        className
      )}
    >
      {children}
    </span>
  )
}

export function LastUpdated({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <DataFreshnessBadge className={className}>{children}</DataFreshnessBadge>
}

export function FilterRow({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col gap-3 md:flex-row md:flex-wrap md:items-end",
        className
      )}
    >
      {children}
    </div>
  )
}

/** Shared horizontal gap for desktop filter fields and KPI cards (Tailwind --spacing(3)). */
export const reportControlGapStyle = "[--report-control-gap:--spacing(3)]"

/** Desktop filter row — three equal fields + auto-sized apply button. */
export const reportDesktopFilterRowClass = cn(
  reportControlGapStyle,
  "flex w-full min-w-0 items-end gap-(--report-control-gap)"
)

/** Desktop KPI row — three equal cards; total width matches the filter row above. */
export const reportDesktopKpiRowClass = cn(
  reportControlGapStyle,
  "flex w-full min-w-0 gap-(--report-control-gap)"
)

/** Income desktop grid — three filter/KPI columns + apply button column. */
export const reportIncomeDesktopGridClass = cn(
  reportControlGapStyle,
  "grid w-full min-w-0 grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] gap-x-(--report-control-gap) [&>*]:min-w-0"
)

/** @deprecated Use reportDesktopFilterRowClass + reportDesktopKpiRowClass as separate groups. */
export const reportDesktopFilterKpiGridClass =
  "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[repeat(3,minmax(0,1fr))_auto] lg:items-end"

/** @deprecated Prefer reportDesktopFilterRowClass. */
export const reportFilterRowClass = reportDesktopFilterKpiGridClass

/** Vertical space between desktop filter row and KPI widgets (40px). */
export const reportFiltersToWidgetsGapClass = "gap-10"

/** Two-column desktop grid — filters and snapshot share the same column tracks. */
export const reportIssuanceDesktopGridClass = cn(
  reportControlGapStyle,
  "grid w-full min-w-0 grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-x-(--report-control-gap) [&>*]:min-w-0"
)

/** Direct child of reportIssuanceDesktopGridClass — equal column width. */
export const reportIssuanceSplitColumnClass = "min-w-0 w-full"

/** @deprecated Use reportIssuanceDesktopGridClass. */
export const reportIssuanceSplitRowClass = reportIssuanceDesktopGridClass

/** Issuance desktop filter row — two equal columns (matches snapshot 50/50 split). */
export const reportIssuanceFilterRowClass = cn(
  reportIssuanceDesktopGridClass,
  "items-end"
)

/** Filters inside one half of the issuance filter row. */
export const reportIssuanceFilterGroupClass = cn(
  reportControlGapStyle,
  "flex min-w-0 items-end gap-(--report-control-gap)"
)

export function FilterField({
  label,
  children,
  className,
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  const controlId = useId()

  return (
    <FilterControlIdContext.Provider value={controlId}>
      <div className={cn("flex w-full min-w-0 flex-col gap-1.5", className)}>
        <label
          htmlFor={controlId}
          className="[font-family:var(--font-sans)] truncate text-xs font-medium tracking-wide uppercase"
        >
          {label}
        </label>
        {children}
      </div>
    </FilterControlIdContext.Provider>
  )
}

export function KpiGrid({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "w-full min-w-0 gap-3",
        className ?? "grid sm:grid-cols-2 lg:grid-cols-3"
      )}
    >
      {children}
    </div>
  )
}

export function MetricPeriodCaption({ children }: { children: string }) {
  return (
    <span className="[font-family:var(--font-body)] text-sm font-normal tracking-normal text-muted-foreground">
      {children}
    </span>
  )
}

export function SectionTitle({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <h2
      className={cn(
        "[font-family:var(--font-display-dark)] text-lg leading-[0.9] tracking-[-0.02em] md:text-xl",
        className
      )}
    >
      {children}
    </h2>
  )
}

export function GranularityToggle({
  value,
  onChange,
  tone = "default",
}: {
  value: ChartGranularity
  onChange: (value: ChartGranularity) => void
  /** На темному report-canvas (`bg-foreground text-background`). */
  tone?: "default" | "onDark"
}) {
  const options: { id: ChartGranularity; label: string }[] = [
    { id: "day", label: "День" },
    { id: "week", label: "Тиждень" },
    { id: "month", label: "Місяць" },
  ]

  const onDark = tone === "onDark"

  if (onDark) {
    return (
      <div
        className="flex gap-6"
        role="group"
        aria-label="Гранулярність графіка"
      >
        {options.map((option) => {
          const active = value === option.id
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(option.id)}
              className={cn(
                "[font-family:var(--font-display-dark)] border-b-2 pb-2 text-sm transition-colors md:text-base",
                active
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-background"
              )}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div
      className="flex gap-0 border-2 border-foreground p-0"
      role="group"
      aria-label="Гранулярність графіка"
    >
      {options.map((option) => (
        <Button
          key={option.id}
          type="button"
          size="sm"
          variant={value === option.id ? "default" : "ghost"}
          aria-pressed={value === option.id}
          className={cn(
            siteControlClass,
            "h-8 min-w-[4.5rem] border-0 px-3",
            value !== option.id && "hover:bg-muted"
          )}
          onClick={() => onChange(option.id)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  )
}

export function AttachmentButton({
  label,
  icon: Icon,
  iconClassName = "size-4",
  compact = false,
  available,
  pending = false,
  onClick,
}: {
  label: string
  icon: React.ComponentType<{ className?: string }>
  iconClassName?: string
  compact?: boolean
  available: boolean
  /** Документ ще очікується — годинник замість порожньої клітинки. */
  pending?: boolean
  onClick?: () => void
}) {
  const sizeClass = compact ? "size-8" : "size-9"

  if (!available) {
    if (!pending) {
      return <span aria-hidden className={cn("inline-flex", sizeClass)} />
    }

    return (
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              role="img"
              tabIndex={0}
              aria-label={`${label} — документ очікується`}
              className={cn(
                "inline-flex cursor-default select-none items-center justify-center text-muted-foreground/60 outline-none focus-visible:ring-2 focus-visible:ring-foreground/30",
                sizeClass
              )}
            >
              <ClockIcon className={iconClassName} />
            </span>
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={6} hideArrow>
            Документ очікується
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center text-foreground/75 transition-colors hover:bg-foreground/10 hover:text-foreground",
        sizeClass,
        siteControlClass
      )}
    >
      <Icon className={iconClassName} />
    </button>
  )
}
