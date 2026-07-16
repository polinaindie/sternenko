import { useEffect, useMemo, useRef, useState } from "react"

import { formatReportNumber } from "@workspace/ui/components/report-metric"
import { cn } from "@workspace/ui/lib/utils"

import type { IncomeTransaction } from "../data/income-transactions"
import { formatIncomeDateParts } from "../lib/income-analytics"
import { IncomeCommentCell } from "./IncomeCommentCell"
import { FundraisingTag } from "./FundraisingTag"

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
              {row.source}
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

function StickyDateHeader({ date }: { date: string }) {
  const sentinelRef = useRef<HTMLDivElement>(null)
  const [isStuck, setIsStuck] = useState(false)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) setIsStuck(!entry.isIntersecting)
      },
      { threshold: 0, rootMargin: "-1px 0px 0px 0px" }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <div ref={sentinelRef} className="pointer-events-none h-px" aria-hidden />
      <h3
        className={cn(
          "sticky top-0 z-10 flex items-center border-b py-2.5",
          "-mx-[var(--page-gutter)] px-[var(--page-gutter)]",
          "md:-mx-[var(--page-gutter-md)] md:px-[var(--page-gutter-md)]",
          "border-[var(--report-border)]",
          "bg-[color-mix(in_oklch,var(--report-surface)_88%,transparent)] backdrop-blur-md backdrop-saturate-150",
          "text-sm font-medium tracking-[0.02em] text-[var(--report-surface-foreground)] tabular-nums",
          "transition-[box-shadow,background-color,border-color] duration-150",
          isStuck && [
            "border-b-[color-mix(in_srgb,var(--primary)_28%,var(--report-border))]",
            "bg-[color-mix(in_oklch,var(--report-surface)_94%,transparent)]",
            "shadow-[0_2px_10px_color-mix(in_oklch,var(--foreground)_8%,transparent)]",
          ]
        )}
      >
        {date}
      </h3>
    </>
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
