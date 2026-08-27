import { useMemo } from "react"

import { formatReportNumber } from "@workspace/ui/components/report-metric"
import { cn } from "@workspace/ui/lib/utils"

import type { IncomeTransaction } from "../data/income-transactions"
import { formatTableCellValue } from "../lib/empty-table-value"
import { formatIncomeDateParts } from "../lib/income-analytics"
import { IncomeCommentCell } from "./IncomeCommentCell"
import { FundraisingTag } from "./FundraisingTag"
import { StickyDateHeader } from "./StickyDateHeader"

type IncomeTransactionsCompactTableProps = {
  rows: IncomeTransaction[]
}

/** ~93% mix — дрібні капси, ціль WCAG AA 4.5:1 на темному фоні. */
const metaLabelClass =
  "text-[0.6875rem] font-semibold tracking-[0.04em] text-[color-mix(in_oklch,var(--report-surface-foreground)_93%,transparent)] uppercase [font-family:var(--font-subheading-dark)]"

const secondaryTextClass =
  "text-xs text-[color-mix(in_oklch,var(--report-surface-foreground)_82%,transparent)]"

function groupRowsByDate(rows: IncomeTransaction[]) {
  const groups: { date: string; rows: IncomeTransaction[] }[] = []

  for (const row of rows) {
    const { date } = formatIncomeDateParts(row.at)
    const last = groups[groups.length - 1]
    if (last?.date === date) {
      last.rows.push(row)
    } else {
      groups.push({ date, rows: [row] })
    }
  }

  return groups
}

function CompactMetaRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <span className={metaLabelClass}>{label}</span>
      <div className="min-w-0 text-sm leading-snug">{children}</div>
    </div>
  )
}

function AmountBlock({ row }: { row: IncomeTransaction }) {
  return (
    <div className="min-w-0">
      <p className="text-2xl leading-tight font-bold tabular-nums text-[var(--report-surface-foreground)]">
        {formatReportNumber(row.amountUah)} ₴
      </p>
      <p className={cn("mt-1 tabular-nums", secondaryTextClass)}>
        {formatReportNumber(row.amount)} {row.currency}
      </p>
    </div>
  )
}

function IncomeCompactCard({ row }: { row: IncomeTransaction }) {
  const { time } = formatIncomeDateParts(row.at)

  return (
    <article className="rounded-[var(--radius-report)] border border-[var(--report-border)] bg-[var(--card)] p-4 text-[var(--report-surface-foreground)]">
      <div className="flex min-w-0 flex-col gap-4">
        <div className="flex min-w-0 flex-col gap-3">
          <div className="min-w-0">
            <p className="text-lg leading-snug font-semibold break-words text-[var(--report-surface-foreground)]">
              {formatTableCellValue(row.source)}
            </p>
            <p className={cn("mt-0.5 tabular-nums", secondaryTextClass)}>{time}</p>
          </div>
          <AmountBlock row={row} />
        </div>

        <div className="flex min-w-0 flex-col gap-6">
          <CompactMetaRow label="Проєкт/збір">
            <FundraisingTag
              name={row.fundraising}
              variant="colored"
              className="inline-flex"
            />
          </CompactMetaRow>
          <CompactMetaRow label="Коментар">
            <IncomeCommentCell comment={row.comment} />
          </CompactMetaRow>
        </div>
      </div>
    </article>
  )
}

/**
 * Компактне подання надходжень для mobile/tablet (< lg) —
 * групи по даті зі sticky-заголовком, кожен запис окремою карткою.
 */
export function IncomeTransactionsCompactTable({
  rows,
}: IncomeTransactionsCompactTableProps) {
  const dateGroups = useMemo(() => groupRowsByDate(rows), [rows])

  return (
    <div
      className="flex flex-col gap-4 pb-12 lg:hidden [--report-border:var(--border)] [--report-surface:var(--muted)] [--report-surface-foreground:var(--foreground)]"
      aria-label="Список надходжень"
    >
      {dateGroups.map((group) => (
        <section key={group.date} className="flex flex-col gap-3">
          <StickyDateHeader date={group.date} />
          <ul className="flex flex-col gap-3">
            {group.rows.map((row) => (
              <li key={row.id} className="min-w-0">
                <IncomeCompactCard row={row} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
