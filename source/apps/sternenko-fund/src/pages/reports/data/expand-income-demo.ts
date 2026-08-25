import type { IncomeTransaction, IncomeTransactionsMeta } from "./income-transactions"

/** Скільки календарних днів розтягнути реальні надходження для демо-графіка «День». */
export const DEMO_INCOME_HISTORY_DAYS = 150

function parseMetaDate(value: string, endOfDay = false): Date {
  const [year, month, day] = value.split("-").map(Number)
  return endOfDay
    ? new Date(year!, month! - 1, day!, 23, 59, 59, 999)
    : new Date(year!, month! - 1, day!)
}

function formatAt(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, "0")
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

/**
 * Розносить імпортовані надходження по довшому вікну (≈5 міс), щоб на графіку
 * з гранулярністю «День» з’явилась горизонтальна прокрутка та стрілки.
 */
export function expandIncomeTransactionsForDemo(
  rows: IncomeTransaction[],
  meta: IncomeTransactionsMeta
): { rows: IncomeTransaction[]; meta: IncomeTransactionsMeta } {
  if (rows.length === 0) return { rows, meta }

  const end = parseMetaDate(meta.end, true)
  const start = new Date(end)
  start.setDate(start.getDate() - (DEMO_INCOME_HISTORY_DAYS - 1))
  start.setHours(0, 0, 0, 0)

  const expandedRows = rows.map((row, index) => {
    const dayOffset = index % DEMO_INCOME_HISTORY_DAYS
    const at = new Date(start)
    at.setDate(at.getDate() + dayOffset)

    const original = new Date(row.at.replace(" ", "T"))
    at.setHours(
      original.getHours(),
      original.getMinutes(),
      original.getSeconds(),
      0
    )

    return { ...row, at: formatAt(at) }
  })

  return {
    rows: expandedRows,
    meta: {
      ...meta,
      start: `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}-${String(start.getDate()).padStart(2, "0")}`,
      rowCount: expandedRows.length,
    },
  }
}
