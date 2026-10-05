export type IssuanceTransferAttachmentRef = {
  src: string
}

export type IssuanceTransferKeySource = {
  id: string
  date: string
  recipient: string
  project: string
  attachments: {
    payment: readonly IssuanceTransferAttachmentRef[]
    act: readonly IssuanceTransferAttachmentRef[]
    media: readonly IssuanceTransferAttachmentRef[]
  }
}

export type IssuanceTransferSortable = IssuanceTransferKeySource & {
  quantity: number
  unitPrice: number
  total: number
}

export type IssuanceTransferGroup<T extends IssuanceTransferSortable> = {
  key: string
  rows: T[]
  total: number
}

export type TransferCellPlacement = {
  show: boolean
  rowSpan: number
  isTransferStart: boolean
}

export type IssuanceTransferSortKey = "date" | "quantity" | "unitPrice" | "total"

function firstSrc(
  items: readonly IssuanceTransferAttachmentRef[] | undefined
): string {
  return items?.[0]?.src ?? ""
}

/** Дата + підрозділ + проєкт + платіж (або акт/фото, якщо платежу немає). */
export function issuanceTransferKey(row: IssuanceTransferKeySource): string {
  const payment = firstSrc(row.attachments.payment)
  const proof = payment
    ? payment
    : `${firstSrc(row.attachments.act)}|${firstSrc(row.attachments.media)}`
  return [row.date, row.recipient, row.project, proof].join("\u001f")
}

export function parseIssuanceTransferDate(date: string): number {
  const [day, month, year] = date.split(".").map(Number)
  return new Date(year!, month! - 1, day!).getTime()
}

export function groupIssuanceTransfers<T extends IssuanceTransferSortable>(
  rows: readonly T[]
): IssuanceTransferGroup<T>[] {
  const groups: IssuanceTransferGroup<T>[] = []
  const indexByKey = new Map<string, number>()

  for (const row of rows) {
    const key = issuanceTransferKey(row)
    const existingIndex = indexByKey.get(key)
    if (existingIndex !== undefined) {
      const group = groups[existingIndex]!
      group.rows.push(row)
      group.total += row.total
      continue
    }
    indexByKey.set(key, groups.length)
    groups.push({ key, rows: [row], total: row.total })
  }

  return groups
}

export function computeTransferCellPlacements<
  T extends IssuanceTransferKeySource,
>(rows: readonly T[]): Map<string, TransferCellPlacement> {
  const placements = new Map<string, TransferCellPlacement>()
  let index = 0

  while (index < rows.length) {
    const key = issuanceTransferKey(rows[index]!)
    let end = index + 1
    while (end < rows.length && issuanceTransferKey(rows[end]!) === key) {
      end += 1
    }

    const rowSpan = end - index
    placements.set(rows[index]!.id, {
      show: true,
      rowSpan,
      isTransferStart: true,
    })
    for (let offset = index + 1; offset < end; offset += 1) {
      placements.set(rows[offset]!.id, {
        show: false,
        rowSpan: 1,
        isTransferStart: false,
      })
    }
    index = end
  }

  return placements
}

export function sortIssuanceTransferGroups<T extends IssuanceTransferSortable>(
  groups: readonly IssuanceTransferGroup<T>[],
  sortKey: IssuanceTransferSortKey,
  direction: 1 | -1
): IssuanceTransferGroup<T>[] {
  return [...groups].sort((a, b) => {
    const firstA = a.rows[0]!
    const firstB = b.rows[0]!

    if (sortKey === "date") {
      const byDate =
        (parseIssuanceTransferDate(firstA.date) -
          parseIssuanceTransferDate(firstB.date)) *
        direction
      if (byDate !== 0) return byDate
      const byKey = a.key.localeCompare(b.key, "uk")
      if (byKey !== 0) return byKey
      return firstA.id.localeCompare(firstB.id, "uk")
    }

    if (sortKey === "quantity") {
      const quantityA = Math.max(...a.rows.map((row) => row.quantity))
      const quantityB = Math.max(...b.rows.map((row) => row.quantity))
      const byQuantity = (quantityA - quantityB) * direction
      if (byQuantity !== 0) return byQuantity
    } else if (sortKey === "unitPrice") {
      const priceA = Math.max(...a.rows.map((row) => row.unitPrice))
      const priceB = Math.max(...b.rows.map((row) => row.unitPrice))
      const byPrice = (priceA - priceB) * direction
      if (byPrice !== 0) return byPrice
    } else {
      const byTotal = (a.total - b.total) * direction
      if (byTotal !== 0) return byTotal
    }

    return firstA.id.localeCompare(firstB.id, "uk")
  })
}

export function flattenTransferGroups<T extends IssuanceTransferSortable>(
  groups: readonly IssuanceTransferGroup<T>[]
): T[] {
  return groups.flatMap((group) => group.rows)
}

/** Пакує групи в сторінки, не розриваючи передачу. */
export function paginateTransferGroups<T extends IssuanceTransferSortable>(
  groups: readonly IssuanceTransferGroup<T>[],
  pageSize: number
): IssuanceTransferGroup<T>[][] {
  if (pageSize < 1) {
    throw new Error("pageSize must be at least 1")
  }

  const pages: IssuanceTransferGroup<T>[][] = []
  let current: IssuanceTransferGroup<T>[] = []
  let count = 0

  for (const group of groups) {
    const size = group.rows.length
    if (current.length > 0 && count + size > pageSize) {
      pages.push(current)
      current = []
      count = 0
    }
    current.push(group)
    count += size
  }

  if (current.length > 0) {
    pages.push(current)
  }

  return pages
}

export function paginateIssuanceTransferRows<T extends IssuanceTransferSortable>(
  rows: readonly T[],
  pageSize: number
): { pages: T[][]; ranges: { from: number; to: number }[] } {
  const packed = paginateTransferGroups(groupIssuanceTransfers(rows), pageSize)
  let offset = 0
  const pages = packed.map((pageGroups) => flattenTransferGroups(pageGroups))
  const ranges = pages.map((pageRows) => {
    const from = offset + 1
    const to = offset + pageRows.length
    offset = to
    return { from, to }
  })
  return { pages, ranges }
}

export function uniqueAttachmentSrcs<T extends IssuanceTransferAttachmentRef>(
  items: readonly T[]
): T[] {
  const seen = new Set<string>()
  const unique: T[] = []
  for (const item of items) {
    if (seen.has(item.src)) continue
    seen.add(item.src)
    unique.push(item)
  }
  return unique
}

export function mergeTransferAttachments<
  T extends {
    attachments: {
      media: readonly IssuanceTransferAttachmentRef[]
      act: readonly IssuanceTransferAttachmentRef[]
      payment: readonly IssuanceTransferAttachmentRef[]
    }
    pendingAttachments: { media: boolean; act: boolean; payment: boolean }
  },
>(rows: readonly T[]): T["attachments"] & {
  pending: T["pendingAttachments"]
} {
  return {
    media: uniqueAttachmentSrcs(rows.flatMap((row) => row.attachments.media)),
    act: uniqueAttachmentSrcs(rows.flatMap((row) => row.attachments.act)),
    payment: uniqueAttachmentSrcs(
      rows.flatMap((row) => row.attachments.payment)
    ),
    pending: {
      media: rows.some((row) => row.pendingAttachments.media),
      act: rows.some((row) => row.pendingAttachments.act),
      payment: rows.some((row) => row.pendingAttachments.payment),
    },
  }
}
