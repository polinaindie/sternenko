import { describe, expect, it } from "vitest"

import {
  createDefaultIssuanceFilters,
  filterIssuanceResult,
  formatIssuancePeriod,
  hasActiveIssuanceFilters,
  ISSUANCE_EMPTY_FILTERS_MESSAGE,
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

  it("uses the same copy regardless of which filters emptied the result", () => {
    expect(ISSUANCE_EMPTY_FILTERS_MESSAGE).toBe(
      "За обраними фільтрами не знайдено результатів"
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
