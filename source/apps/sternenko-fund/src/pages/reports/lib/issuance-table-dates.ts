export type IssuanceDateCellPlacement = {
  show: boolean
  rowSpan: number
  /** Перший рядок чергового дня у поточному списку (для роздільника між днями). */
  isDayGroupStart: boolean
}

/** Групує послідовні рядки з однаковою датою для rowspan у стовпці «Дата». */
export function computeIssuanceDateCells(
  rows: readonly { id: string; date: string }[],
  mergeSameDate: boolean
): Map<string, IssuanceDateCellPlacement> {
  const placements = new Map<string, IssuanceDateCellPlacement>()

  if (!mergeSameDate) {
    for (const [index, row] of rows.entries()) {
      placements.set(row.id, {
        show: true,
        rowSpan: 1,
        isDayGroupStart:
          index === 0 || rows[index - 1]!.date !== row.date,
      })
    }
    return placements
  }

  let index = 0
  while (index < rows.length) {
    const date = rows[index]!.date
    let end = index + 1
    while (end < rows.length && rows[end]!.date === date) {
      end += 1
    }

    const rowSpan = end - index
    placements.set(rows[index]!.id, {
      show: true,
      rowSpan,
      isDayGroupStart: index === 0 || rows[index - 1]!.date !== date,
    })
    for (let offset = index + 1; offset < end; offset += 1) {
      placements.set(rows[offset]!.id, {
        show: false,
        rowSpan: 1,
        isDayGroupStart: false,
      })
    }
    index = end
  }

  return placements
}

/** Чергування фону по послідовних групах однакової дати на сторінці. */
export function computeIssuanceDateGroupStripes(
  rows: readonly { id: string; date: string }[]
): boolean[] {
  const stripes: boolean[] = Array.from({ length: rows.length }, () => false)
  let index = 0
  let groupIndex = 0

  while (index < rows.length) {
    const date = rows[index]!.date
    let end = index + 1
    while (end < rows.length && rows[end]!.date === date) {
      end += 1
    }

    const striped = groupIndex % 2 === 1
    for (let offset = index; offset < end; offset += 1) {
      stripes[offset] = striped
    }

    groupIndex += 1
    index = end
  }

  return stripes
}
