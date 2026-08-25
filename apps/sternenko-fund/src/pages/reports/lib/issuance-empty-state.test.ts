import { describe, expect, it } from "vitest"

import {
  buildIssuanceEmptyStateMessage,
  createDefaultIssuanceFilters,
  filterIssuanceResult,
  formatIssuancePeriod,
  hasActiveIssuanceFilters,
} from "./issuance-analytics"
import { ISSUANCE_ROWS } from "../mock-data"

describe("issuance empty state copy", () => {
  it("formats a single day with the full year", () => {
    const day = new Date(2026, 4, 15)

    expect(formatIssuancePeriod(day, day)).toBe("15.05.2026")
  })

  it("formats a range in one year without repeating the year", () => {
    expect(
      formatIssuancePeriod(new Date(2026, 4, 1), new Date(2026, 4, 30))
    ).toBe("01.05 – 30.05")
  })

  it("names every applied filter value", () => {
    expect(
      buildIssuanceEmptyStateMessage({
        from: new Date(2026, 4, 15),
        to: new Date(2026, 4, 15),
        nameQuery: "",
        projects: ["Опторіз"],
        units: ["81 БПАК"],
      })
    ).toBe(
      "За 15.05.2026 по проєкту «Опторіз» у підрозділі «81 БПАК» закупівель не було"
    )
  })

  it("lists multiple values instead of hiding them behind a generic count", () => {
    expect(
      buildIssuanceEmptyStateMessage({
        from: new Date(2026, 4, 1),
        to: new Date(2026, 4, 30),
        nameQuery: "",
        projects: ["Опторіз", "Русоріз", "Небесний русоріз"],
        units: [],
      })
    ).toBe(
      "За 01.05 – 30.05 по обраних проєктах (3): «Опторіз», «Русоріз», «Небесний русоріз» закупівель не було"
    )
  })

  it("uses the search-specific explanation", () => {
    expect(
      buildIssuanceEmptyStateMessage({
        from: new Date(2026, 4, 1),
        to: new Date(2026, 4, 30),
        nameQuery: "STRIX",
        projects: [],
        units: [],
      })
    ).toBe(
      "За 01.05 – 30.05 нічого не знайдено за запитом «STRIX»"
    )
  })
})

describe("issuance result contract", () => {
  it("returns active dates for applied dimensions independently of the range", () => {
    const filters = createDefaultIssuanceFilters()
    filters.from = new Date(2026, 4, 1)
    filters.to = new Date(2026, 4, 1)

    const result = filterIssuanceResult(ISSUANCE_ROWS, filters)

    expect(result.rows.every((row) => row.date === "01.05.2026")).toBe(true)
    expect(result.activeDates).toContain("2026-05-01")
    expect(result.activeDates.length).toBeGreaterThan(1)
  })

  it("recalculates active dates for project filters", () => {
    const filters = createDefaultIssuanceFilters()
    const project = ISSUANCE_ROWS[0]!.project
    filters.projects = [project]

    const result = filterIssuanceResult(ISSUANCE_ROWS, filters)
    const expectedDates = [
      ...new Set(
        ISSUANCE_ROWS.filter((row) => row.project === project).map((row) => {
          const [day, month, year] = row.date.split(".")
          return `${year}-${month}-${day}`
        })
      ),
    ].sort()

    expect(result.activeDates).toEqual(expectedDates)
  })

  it("treats untouched filters as having nothing to highlight", () => {
    expect(hasActiveIssuanceFilters(createDefaultIssuanceFilters())).toBe(false)
  })

  it("marks a picked project as a reason to highlight dates", () => {
    const filters = createDefaultIssuanceFilters()
    filters.projects = [ISSUANCE_ROWS[0]!.project]

    expect(hasActiveIssuanceFilters(filters)).toBe(true)
  })
})
