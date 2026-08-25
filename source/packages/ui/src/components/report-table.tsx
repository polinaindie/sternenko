import * as React from "react"
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@workspace/ui/lib/utils"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table"

export const reportTableHeadClass =
  "bg-[var(--report-header)] text-[color-mix(in_oklch,var(--report-header-foreground)_72%,transparent)] h-11 px-3 text-left text-xs uppercase [font-family:var(--font-subheading-dark)] font-normal tracking-[0.06em] align-middle md:px-4"

export const reportTableCellClass =
  "px-3 py-3 text-sm leading-snug text-[var(--report-surface-foreground)] align-middle md:px-4"

/** Фон парного рядка — той самий відтінок, що був на hover. */
export const reportTableRowSurfaceClass =
  "bg-[var(--report-surface)] hover:bg-[var(--report-surface)]"

export const reportTableRowStripeClass =
  "bg-[color-mix(in_oklch,var(--report-surface-foreground)_7%,var(--report-surface))] hover:bg-[color-mix(in_oklch,var(--report-surface-foreground)_7%,var(--report-surface))]"

export type ReportSortDirection = "asc" | "desc"

const reportTableVariants = cva(
  "w-full overflow-hidden rounded-[var(--radius-report)] border border-[var(--report-border)] bg-[var(--report-surface)] text-[var(--report-surface-foreground)] [&_thead_[data-slot=table-row]:hover]:bg-[var(--report-header)]",
  {
    variants: {
      tone: {
        default: "",
        /** Темна таблиця на темному сайті — як `ReportCard tone="muted"`. */
        muted:
          "[--report-header:var(--card)] [--report-header-foreground:var(--card-foreground)] [--report-surface:var(--muted)] [--report-surface-foreground:var(--foreground)] [--report-border:var(--border)]",
      },
    },
    defaultVariants: {
      tone: "default",
    },
  }
)

function ReportTable({
  className,
  tableClassName,
  containerClassName,
  tone = "default",
  ...props
}: React.ComponentProps<typeof Table> &
  VariantProps<typeof reportTableVariants> & {
    tableClassName?: string
    containerClassName?: string
  }) {
  return (
    <div
      data-slot="report-table"
      data-tone={tone ?? "default"}
      className={cn(reportTableVariants({ tone }), className)}
    >
      <Table
        className={tableClassName}
        containerClassName={containerClassName}
        {...props}
      />
    </div>
  )
}

function ReportTableHeader({
  className,
  ...props
}: React.ComponentProps<typeof TableHeader>) {
  return <TableHeader className={cn("[&_tr]:border-0", className)} {...props} />
}

function ReportTableHead({
  className,
  scope = "col",
  ...props
}: React.ComponentProps<typeof TableHead>) {
  return <TableHead scope={scope} className={cn(reportTableHeadClass, className)} {...props} />
}

function ReportTableHeadSortable({
  label,
  sortDirection,
  onCycleSort,
  className,
  align = "left",
  layout = "fill",
}: {
  label: string
  /** null — сортування неактивне для цього стовпця */
  sortDirection: ReportSortDirection | null
  onCycleSort: () => void
  className?: string
  align?: "left" | "right" | "center"
  /** `compact` — ширина лише під підпис і кнопку (напр. стовпець дати). */
  layout?: "fill" | "compact"
}) {
  const sortLabel =
    sortDirection === null
      ? `Сортувати «${label}» від найменшого до найбільшого`
      : sortDirection === "asc"
        ? `Сортувати «${label}» від найбільшого до найменшого`
        : `Скинути сортування «${label}»`

  const sortButton = (
    <button
      type="button"
      onClick={onCycleSort}
      aria-label={sortLabel}
      title={sortLabel}
      className={cn(
        "inline-flex size-6 shrink-0 items-center justify-center rounded-sm text-[var(--report-header-foreground)] opacity-70 outline-none focus-visible:ring-2 focus-visible:ring-[var(--report-header-foreground)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--report-header)]",
        sortDirection &&
          "bg-[color-mix(in_oklch,var(--report-header-foreground)_12%,transparent)] opacity-100"
      )}
    >
      {sortDirection === null ? (
        <ArrowUpDownIcon className="size-3.5" aria-hidden />
      ) : sortDirection === "asc" ? (
        <ArrowUpIcon className="size-3.5" aria-hidden />
      ) : (
        <ArrowDownIcon className="size-3.5" aria-hidden />
      )}
    </button>
  )

  const labelClassName = cn(
    "min-w-0 shrink-0 whitespace-nowrap leading-tight",
    align === "right"
      ? "text-right"
      : align === "center"
        ? "text-center"
        : "text-left"
  )

  return (
    <ReportTableHead className={cn("h-auto min-h-11 whitespace-normal py-2.5", className)}>
      <div
        className={cn(
          "flex w-full min-w-0 items-center",
          layout === "compact" && align !== "right" && "w-max max-w-full"
        )}
      >
        {align === "right" ? <span className="min-w-0 flex-1" aria-hidden /> : null}
        <span className={labelClassName}>{label}</span>
        <span className="min-w-0 flex-1" aria-hidden />
        <span className="shrink-0">{sortButton}</span>
      </div>
    </ReportTableHead>
  )
}

function ReportTableHeaderRow({
  className,
  ...props
}: React.ComponentProps<typeof TableRow>) {
  return (
    <TableRow
      className={cn(
        "border-0 bg-[var(--report-header)] hover:bg-[var(--report-header)]",
        className
      )}
      {...props}
    />
  )
}

function ReportTableBody({
  className,
  ...props
}: React.ComponentProps<typeof TableBody>) {
  return <TableBody className={className} {...props} />
}

function ReportTableRow({
  className,
  striping = "alternate",
  ...props
}: React.ComponentProps<typeof TableRow> & {
  /** `none` — фон задається ззовні (напр. зебра по групах дати). */
  striping?: "alternate" | "none"
}) {
  return (
    <TableRow
      className={cn(
        "border-b border-[var(--report-border)] last:border-b-0",
        striping === "alternate" && [
          "odd:bg-[var(--report-surface)] odd:hover:bg-[var(--report-surface)]",
          "even:bg-[color-mix(in_oklch,var(--report-surface-foreground)_7%,var(--report-surface))] even:hover:bg-[color-mix(in_oklch,var(--report-surface-foreground)_7%,var(--report-surface))]",
        ],
        className
      )}
      {...props}
    />
  )
}

function ReportTableCell({
  className,
  ...props
}: React.ComponentProps<typeof TableCell>) {
  return <TableCell className={cn(reportTableCellClass, className)} {...props} />
}

export {
  ReportTable,
  ReportTableHeader,
  ReportTableHead,
  ReportTableHeadSortable,
  ReportTableHeaderRow,
  ReportTableBody,
  ReportTableRow,
  ReportTableCell,
  type ReportSortDirection,
}
