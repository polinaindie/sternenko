import { describe, expect, it } from "vitest"

import { resolveVisibleChipCount, type ChipMetrics } from "./filter-chip-rows"

/** Ряд однакових чипів по 100 px у контейнері 320 px — три в рядок. */
function chipGrid(count: number): ChipMetrics[] {
  const perRow = 3
  return Array.from({ length: count }, (_, index) => ({
    top: Math.floor(index / perRow) * 28,
    left: (index % perRow) * 108,
    width: 100,
  }))
}

describe("resolveVisibleChipCount", () => {
  it("keeps every chip when the flow already fits the row limit", () => {
    expect(resolveVisibleChipCount(chipGrid(6), 320, 60)).toBe(6)
  })

  it("keeps only the chips of the first two rows", () => {
    expect(resolveVisibleChipCount(chipGrid(9), 320, 0)).toBe(6)
  })

  it("drops a trailing chip when the toggle would not fit the last row", () => {
    expect(resolveVisibleChipCount(chipGrid(9), 320, 60)).toBe(5)
  })

  it("never collapses below a single chip", () => {
    const items: ChipMetrics[] = [
      { top: 0, left: 0, width: 300 },
      { top: 28, left: 0, width: 300 },
      { top: 56, left: 0, width: 300 },
    ]

    expect(resolveVisibleChipCount(items, 320, 300)).toBe(1)
  })

  it("returns zero for an empty flow", () => {
    expect(resolveVisibleChipCount([], 320, 60)).toBe(0)
  })

  it("respects a custom row limit", () => {
    expect(resolveVisibleChipCount(chipGrid(9), 320, 0, 1)).toBe(3)
  })
})
