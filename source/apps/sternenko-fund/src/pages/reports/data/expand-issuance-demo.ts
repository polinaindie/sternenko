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

function cloneKitLine<T extends IssuanceRow>(
  host: T,
  id: string,
  productName: string,
  quantity: number,
  unitPrice: number
): T {
  return {
    ...host,
    id,
    productName,
    quantity,
    unitPrice,
    total: quantity * unitPrice,
    attachments: {
      media: [...host.attachments.media],
      act: [...host.attachments.act],
      payment: [...host.attachments.payment],
    },
    pendingAttachments: { ...host.pendingAttachments },
  }
}

/**
 * ДЕМО: 2–3 комплекти як у Excel (кілька номенклатур однієї передачі).
 * Вставляємо після expand, на найпізнішу дату — щоб групи були на 1-й сторінці.
 */
export function seedIssuanceDemoKits<T extends IssuanceRow>(rows: T[]): T[] {
  if (rows.length === 0) return rows

  const latestDate = rows[0]!.date
  const hostEntries = rows
    .map((row, index) => ({ row, index }))
    .filter(({ row }) => row.date === latestDate)

  const hostA = hostEntries[0]
  const hostB = hostEntries[1]
  const hostC = hostEntries[2]
  if (!hostA) return rows

  const ops: { index: number; lines: T[] }[] = [
    {
      index: hostA.index,
      lines: [
        cloneKitLine(
          hostA.row,
          `${hostA.row.id}~kit1-fiber`,
          'БпЛА FiberKrab 10" Радіа 13"',
          20,
          45000
        ),
        cloneKitLine(
          hostA.row,
          `${hostA.row.id}~kit1-ibor`,
          'БпЛА IborKrab 10" Радіа 10"',
          10,
          38000
        ),
        cloneKitLine(
          hostA.row,
          `${hostA.row.id}~kit1-gs`,
          "Наземна станція IP Digital PRO",
          1,
          269000
        ),
      ],
    },
  ]

  if (hostB) {
    ops.push({
      index: hostB.index,
      lines: [
        cloneKitLine(
          hostB.row,
          `${hostB.row.id}~kit2-fpv`,
          "FPV дрон Winfly Hunter",
          30,
          34230
        ),
        cloneKitLine(
          hostB.row,
          `${hostB.row.id}~kit2-gs`,
          "Наземна станція «Дрон-шпага»",
          1,
          200000
        ),
      ],
    })
  }

  if (hostC) {
    ops.push({
      index: hostC.index,
      lines: [
        cloneKitLine(
          hostC.row,
          `${hostC.row.id}~kit3-strix`,
          "STRIX (ReDrone)",
          40,
          1575
        ),
        cloneKitLine(
          hostC.row,
          `${hostC.row.id}~kit3-air`,
          "Strix Air Long Range",
          20,
          32800
        ),
      ],
    })
  }

  const result = [...rows]
  ops.sort((a, b) => b.index - a.index)
  for (const op of ops) {
    result.splice(op.index, 1, ...op.lines)
  }
  return result
}
