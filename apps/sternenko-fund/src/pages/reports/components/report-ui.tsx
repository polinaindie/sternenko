import { createContext, useContext, useId } from "react"

import { Button } from "@workspace/ui/components/button"
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
  "border-border h-8 w-full min-w-0 font-normal"
)

/** Primary apply action in a filter row — Storybook Button default без site overrides. */
export function FilterApplyButton({
  className,
  children = "Фільтрувати",
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button type="button" className={cn("shrink-0", className)} {...props}>
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
          className="[font-family:var(--font-subheading-dark)] truncate text-xs tracking-wide uppercase"
        >
          {label}
        </label>
        {children}
      </div>
    </FilterControlIdContext.Provider>
  )
}

export function KpiGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid w-full min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {children}
    </div>
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
                  : "border-transparent text-muted-foreground hover:text-background/80"
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
  available,
  onClick,
}: {
  label: string
  icon: React.ComponentType<{ className?: string }>
  iconClassName?: string
  available: boolean
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      disabled={!available}
      aria-label={label}
      onClick={available ? onClick : undefined}
      className={cn(
        "inline-flex size-9 items-center justify-center transition-colors",
        siteControlClass,
        available ? "text-foreground" : "text-muted-foreground/60 cursor-not-allowed"
      )}
    >
      <Icon className={iconClassName} />
    </button>
  )
}
