import { useId } from "react"

import { reportTableRowSurfaceClass } from "@workspace/ui/components/report-table"
import { cn } from "@workspace/ui/lib/utils"

export type ReportRecordField = {
  id: string
  label: string
  value: React.ReactNode
  /** Emphasize value (e.g. amounts). */
  emphasis?: "default" | "muted" | "strong"
}

type ReportRecordCardProps = {
  title: React.ReactNode
  /** Optional secondary line under the title. */
  subtitle?: React.ReactNode
  fields: ReportRecordField[]
  actions?: React.ReactNode
  actionsLabel?: string
  className?: string
  /** Alternating stripe like table rows. */
  striped?: boolean
}

const valueEmphasisClass: Record<
  NonNullable<ReportRecordField["emphasis"]>,
  string
> = {
  default: "text-[var(--report-surface-foreground)]",
  muted:
    "text-[color-mix(in_oklch,var(--report-surface-foreground)_72%,transparent)] tabular-nums",
  strong:
    "font-medium text-[var(--report-surface-foreground)] tabular-nums",
}

export function ReportRecordCard({
  title,
  subtitle,
  fields,
  actions,
  actionsLabel = "Дії",
  className,
  striped = false,
}: ReportRecordCardProps) {
  const actionsLabelId = useId()

  return (
    <article
      className={cn(
        "rounded-[var(--radius-report)] border border-[var(--report-border)] bg-[var(--report-surface)] p-4 text-[var(--report-surface-foreground)]",
        striped
          ? "bg-[color-mix(in_oklch,var(--report-surface-foreground)_3.5%,var(--report-surface))]"
          : reportTableRowSurfaceClass,
        className
      )}
    >
      <header className="mb-3 min-w-0 space-y-1">
        <h3 className="text-base leading-snug font-medium break-words">{title}</h3>
        {subtitle ? (
          <p className="text-sm leading-snug text-[color-mix(in_oklch,var(--report-surface-foreground)_72%,transparent)]">
            {subtitle}
          </p>
        ) : null}
      </header>

      <dl className="grid min-w-0 gap-x-3 gap-y-2.5 sm:grid-cols-[minmax(7rem,9rem)_1fr]">
        {fields.map((field) => (
          <div
            key={field.id}
            className="contents"
          >
            <dt className="text-xs leading-snug font-normal tracking-wide text-[color-mix(in_oklch,var(--report-surface-foreground)_72%,transparent)] uppercase [font-family:var(--font-subheading-dark)]">
              {field.label}
            </dt>
            <dd
              className={cn(
                "min-w-0 text-sm leading-snug break-words",
                valueEmphasisClass[field.emphasis ?? "default"]
              )}
            >
              {field.value}
            </dd>
          </div>
        ))}
      </dl>

      {actions ? (
        <div className="mt-4 border-t border-[var(--report-border)] pt-3">
          <p
            id={actionsLabelId}
            className="mb-2 text-xs tracking-wide text-[color-mix(in_oklch,var(--report-surface-foreground)_72%,transparent)] uppercase [font-family:var(--font-subheading-dark)]"
          >
            {actionsLabel}
          </p>
          <div
            className="flex flex-wrap items-center gap-2"
            role="group"
            aria-labelledby={actionsLabelId}
          >
            {actions}
          </div>
        </div>
      ) : null}
    </article>
  )
}

export function ReportRecordCardList({
  children,
  className,
  "aria-label": ariaLabel,
}: {
  children: React.ReactNode
  className?: string
  "aria-label"?: string
}) {
  return (
    <ul
      className={cn("flex min-w-0 flex-col gap-3", className)}
      aria-label={ariaLabel}
    >
      {children}
    </ul>
  )
}

export function ReportRecordCardItem({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <li className={cn("min-w-0", className)}>{children}</li>
}
