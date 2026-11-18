import { describe, expect, it } from "vitest"

import {
  cycleOptionSort,
  optionSortActionLabel,
  sortFilterOptions,
} from "./option-list-sort"

const NAMES = ["Шахедоріз", "Небесний", "Глушник"] as const

describe("cycleOptionSort", () => {
  it("starts ascending, flips, then clears", () => {
    const asc = cycleOptionSort("name", null)
    expect(asc).toEqual({ key: "name", direction: "asc" })
    expect(cycleOptionSort("name", asc)).toEqual({
      key: "name",
      direction: "desc",
    })
    expect(
      cycleOptionSort("name", { key: "name", direction: "desc" })
    ).toBeNull()
  })

  it("switches to the other key from the ascending start", () => {
    expect(
      cycleOptionSort("count", { key: "name", direction: "desc" })
    ).toEqual({ key: "count", direction: "asc" })
  })
})

describe("sortFilterOptions", () => {
  it("sorts names from A to Z and back", () => {
    expect(
      sortFilterOptions(NAMES, { key: "name", direction: "asc" })
    ).toEqual(["Глушник", "Небесний", "Шахедоріз"])
    expect(
      sortFilterOptions(NAMES, { key: "name", direction: "desc" })
    ).toEqual(["Шахедоріз", "Небесний", "Глушник"])
  })

  it("sorts counts from smallest to largest and breaks ties by name", () => {
    const counts = new Map<string, number>([
      ["Шахедоріз", 10],
      ["Небесний", 2],
      ["Глушник", 2],
    ])

    expect(
      sortFilterOptions(NAMES, { key: "count", direction: "asc" }, counts)
    ).toEqual(["Глушник", "Небесний", "Шахедоріз"])
    expect(
      sortFilterOptions(NAMES, { key: "count", direction: "desc" }, counts)
    ).toEqual(["Шахедоріз", "Небесний", "Глушник"])
  })
})

describe("optionSortActionLabel", () => {
  it("names the next action for each direction", () => {
    expect(optionSortActionLabel("count", null)).toBe(
      "Сортувати від найменшого до найбільшого"
    )
    expect(optionSortActionLabel("count", "asc")).toBe(
      "Сортувати від найбільшого до найменшого"
    )
    expect(optionSortActionLabel("name", null)).toBe("Сортувати від А до Я")
    expect(optionSortActionLabel("name", "asc")).toBe("Сортувати від Я до А")
  })
})
