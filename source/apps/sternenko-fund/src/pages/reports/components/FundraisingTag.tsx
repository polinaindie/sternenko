import { cn } from "@workspace/ui/lib/utils"

import { EMPTY_TABLE_VALUE, isEmptyTableValue } from "../lib/empty-table-value"
import { getProjectDisplayName } from "../lib/project-display"

type FundraisingTagProps = {
  name: string
  className?: string
  nowrap?: boolean
  /** `chip` — суцільний бейдж; `colored` — бейдж; `text` — простий підпис. */
  variant?: "text" | "chip" | "colored"
}

const neutralTagSurfaceClassName =
  "bg-[color-mix(in_oklch,var(--muted-foreground)_22%,transparent)] text-foreground/95"

export function FundraisingTag({
  name,
  className,
  nowrap = false,
  variant = "text",
}: FundraisingTagProps) {
  if (isEmptyTableValue(name)) {
    return (
      <span
        className={cn("text-[var(--report-surface-foreground)]", className)}
        aria-label="Проєкт не вказано"
      >
        {EMPTY_TABLE_VALUE}
      </span>
    )
  }

  const label = getProjectDisplayName(name)

  if (variant === "chip") {
    return (
      <span
        className={cn(
          "inline-flex min-w-[calc(9ch+1rem)] max-w-full items-center justify-center text-center rounded-[var(--radius-report)] px-2 py-1 text-xs font-medium leading-tight tracking-[-0.01em]",
          neutralTagSurfaceClassName,
          nowrap ? "truncate whitespace-nowrap" : "whitespace-normal break-words",
          className
        )}
        title={label}
      >
        {label}
      </span>
    )
  }

  if (variant === "colored") {
    return (
      <span
        className={cn(
          "inline-flex max-w-full rounded-[var(--radius-report)] px-2 py-1 text-xs font-medium leading-snug tracking-[-0.01em]",
          neutralTagSurfaceClassName,
          nowrap ? "truncate whitespace-nowrap" : "whitespace-normal break-words",
          className
        )}
        title={label}
      >
        {label}
      </span>
    )
  }

  return (
    <span
      className={cn(
        nowrap ? "whitespace-nowrap" : "whitespace-normal break-words",
        className
      )}
    >
      {label}
    </span>
  )
}
