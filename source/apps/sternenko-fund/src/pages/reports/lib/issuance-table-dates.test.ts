import { describe, expect, it } from "vitest"

import { computeIssuanceDateCells, computeIssuanceDateGroupStripes } from "./issuance-table-dates"

describe("computeIssuanceDateCells", () => {
  const rows = [
    { id: "a", date: "01.05.2026" },
    { id: "b", date: "01.05.2026" },
    { id: "c", date: "02.05.2026" },
    { id: "d", date: "02.05.2026" },
    { id: "e", date: "02.05.2026" },
  ]

  it("merges consecutive rows with the same date", () => {
    const placements = computeIssuanceDateCells(rows, true)

    expect(placements.get("a")).toEqual({
      show: true,
      rowSpan: 2,
      isDayGroupStart: true,
    })
    expect(placements.get("b")).toEqual({
      show: false,
      rowSpan: 1,
      isDayGroupStart: false,
    })
    expect(placements.get("c")).toEqual({
      show: true,
      rowSpan: 3,
      isDayGroupStart: true,
    })
    expect(placements.get("d")).toEqual({
      show: false,
      rowSpan: 1,
      isDayGroupStart: false,
    })
    expect(placements.get("e")).toEqual({
      show: false,
      rowSpan: 1,
      isDayGroupStart: false,
    })
  })

  it("shows a date cell on every row when merge is disabled", () => {
    const placements = computeIssuanceDateCells(rows, false)

    for (const row of rows) {
      expect(placements.get(row.id)).toEqual({
        show: true,
        rowSpan: 1,
        isDayGroupStart: row.id === "a" || row.id === "c",
      })
    }
  })
})

describe("computeIssuanceDateGroupStripes", () => {
  it("alternates stripe by contiguous date groups", () => {
    const rows = [
      { id: "a", date: "01.05.2026" },
      { id: "b", date: "01.05.2026" },
      { id: "c", date: "02.05.2026" },
      { id: "d", date: "03.05.2026" },
      { id: "e", date: "03.05.2026" },
    ]

    const stripes = computeIssuanceDateGroupStripes(rows)

    expect(stripes[0]).toBe(false)
    expect(stripes[1]).toBe(false)
    expect(stripes[2]).toBe(true)
    expect(stripes[3]).toBe(false)
    expect(stripes[4]).toBe(false)
  })

  it("alternates multi-row days regardless of group size", () => {
    const rows = [
      { id: "1", date: "30.05.2026" },
      { id: "2", date: "30.05.2026" },
      { id: "3", date: "30.05.2026" },
      { id: "4", date: "29.05.2026" },
      { id: "5", date: "29.05.2026" },
      { id: "6", date: "29.05.2026" },
      { id: "7", date: "29.05.2026" },
      { id: "8", date: "29.05.2026" },
      { id: "9", date: "29.05.2026" },
      { id: "10", date: "28.05.2026" },
      { id: "11", date: "28.05.2026" },
      { id: "12", date: "28.05.2026" },
      { id: "13", date: "28.05.2026" },
      { id: "14", date: "27.05.2026" },
      { id: "15", date: "27.05.2026" },
    ]

    const stripes = computeIssuanceDateGroupStripes(rows)

    expect(stripes.slice(0, 3).every((striped) => striped === false)).toBe(true)
    expect(stripes.slice(3, 9).every((striped) => striped === true)).toBe(true)
    expect(stripes.slice(9, 13).every((striped) => striped === false)).toBe(true)
    expect(stripes.slice(13, 15).every((striped) => striped === true)).toBe(true)
  })

  it("does not collapse stripes when row ids repeat", () => {
    const rows = [
      { id: "dup", date: "01.05.2026" },
      { id: "dup", date: "02.05.2026" },
    ]

    const stripes = computeIssuanceDateGroupStripes(rows)

    expect(stripes).toEqual([false, true])
  })
})
