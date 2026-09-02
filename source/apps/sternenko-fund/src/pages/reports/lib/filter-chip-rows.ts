/** Скільки рядків чипів видно, поки список не розгорнули. */
export const COLLAPSED_CHIP_ROW_LIMIT = 2

/** Відповідає `gap-2` у потоці чипів. */
export const CHIP_ROW_GAP_PX = 8

export type ChipMetrics = {
  /** `offsetTop` — чипи з однаковим значенням стоять в одному рядку. */
  top: number
  left: number
  width: number
}

function distinctRowTops(items: readonly ChipMetrics[]): number[] {
  const tops: number[] = []
  for (const item of items) {
    if (!tops.includes(item.top)) tops.push(item.top)
  }
  return tops
}

/**
 * Скільки чипів лишити видимими, щоб потік вклався у `rowLimit` рядків і в
 * останньому з них лишилося місце під кнопку «+N» та «Очистити всі».
 */
export function resolveVisibleChipCount(
  items: readonly ChipMetrics[],
  containerWidth: number,
  reservedWidth: number,
  rowLimit: number = COLLAPSED_CHIP_ROW_LIMIT
): number {
  if (items.length === 0) return 0

  const tops = distinctRowTops(items)
  if (tops.length <= rowLimit) return items.length

  const cutoff = tops[rowLimit]!
  const fitting = items.filter((item) => item.top < cutoff)
  const lastRowTop = tops[rowLimit - 1]!

  let count = fitting.length
  while (count > 1) {
    const last = fitting[count - 1]!
    if (last.top !== lastRowTop) break
    const freeSpace = containerWidth - (last.left + last.width)
    if (freeSpace >= reservedWidth) break
    count -= 1
  }

  return count
}
