import type { IssuanceRow } from "../mock-data"

/** Множник рядків видач для демо таблиці (пагінація, групи по днях). */
export const DEMO_ISSUANCE_ROW_FACTOR = 6

function parseIssuanceDate(value: string): Date {
  const [day, month, year] = value.split(".").map(Number)
  return new Date(year!, month! - 1, day!)
}

/**
 * Дублює рядки видач із зсувом дат у межах вікна звітності — більше сторінок
 * і щільніша розбивка по днях у таблиці.
 */
export function expandIssuanceRowsForDemo(rows: IssuanceRow[]): IssuanceRow[] {
  if (rows.length === 0) return rows

  const dates = [...new Set(rows.map((row) => row.date))].sort(
    (a, b) => parseIssuanceDate(a).getTime() - parseIssuanceDate(b).getTime()
  )
  if (dates.length === 0) return rows

  const expanded: IssuanceRow[] = []

  for (let copy = 0; copy < DEMO_ISSUANCE_ROW_FACTOR; copy += 1) {
    for (const [index, row] of rows.entries()) {
      const date = dates[(index + copy) % dates.length]!
      expanded.push({
        ...row,
        id: `${row.id}~${copy}`,
        date,
        attachments: {
          media: [...row.attachments.media],
          act: [...row.attachments.act],
          payment: [...row.attachments.payment],
        },
      })
    }
  }

  return expanded.sort(
    (a, b) => parseIssuanceDate(b.date).getTime() - parseIssuanceDate(a.date).getTime()
  )
}
