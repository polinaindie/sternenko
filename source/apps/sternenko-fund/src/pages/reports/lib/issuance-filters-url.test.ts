import { describe, expect, it } from "vitest"

import { ISSUANCE_PROJECT_OPTIONS, ISSUANCE_UNITS } from "../mock-data"
import {
  createDefaultIssuanceFilters,
  isSameIssuanceFilters,
} from "./issuance-analytics"
import {
  buildIssuanceFiltersQuery,
  parseIssuanceFiltersFromQuery,
} from "./issuance-filters-url"
import { buildReloadUrl } from "./reports-reload"

describe("buildIssuanceFiltersQuery", () => {
  it("keeps the untouched state out of the address", () => {
    expect(buildIssuanceFiltersQuery(createDefaultIssuanceFilters())).toBe("")
  })

  it("writes every dimension the filter row can change", () => {
    const filters = createDefaultIssuanceFilters()
    filters.nameQuery = "STRIX"
    filters.from = new Date(2026, 4, 4)
    filters.to = new Date(2026, 4, 6, 23, 59, 59, 999)
    filters.projects = [ISSUANCE_PROJECT_OPTIONS[0]!]
    filters.units = [ISSUANCE_UNITS[0]!, ISSUANCE_UNITS[1]!]

    const params = new URLSearchParams(buildIssuanceFiltersQuery(filters))

    expect(params.get("q")).toBe("STRIX")
    expect(params.get("from")).toBe("2026-05-04")
    expect(params.get("to")).toBe("2026-05-06")
    expect(params.getAll("unit")).toEqual([ISSUANCE_UNITS[0], ISSUANCE_UNITS[1]])
  })
})

describe("issuance filters survive a reload", () => {
  it("round-trips the applied state through the query string", () => {
    const filters = createDefaultIssuanceFilters()
    filters.nameQuery = "Hornet"
    filters.from = new Date(2026, 4, 10)
    filters.to = new Date(2026, 4, 20, 23, 59, 59, 999)
    filters.projects = [ISSUANCE_PROJECT_OPTIONS[1]!]
    filters.units = [ISSUANCE_UNITS[2]!]

    const restored = parseIssuanceFiltersFromQuery(
      buildIssuanceFiltersQuery(filters)
    )

    expect(isSameIssuanceFilters(restored.filters, filters)).toBe(true)
    expect(restored.dropped).toEqual([])
  })

  it("names values it could not apply instead of silently dropping them", () => {
    const parsed = parseIssuanceFiltersFromQuery(
      "unit=немає-такого&from=2026-13-45"
    )

    expect(parsed.dropped).toEqual(["немає-такого", "2026-13-45"])
    expect(parsed.filters.units).toEqual([])
  })
})

describe("buildReloadUrl", () => {
  it("drops the question mark when nothing is filtered", () => {
    expect(buildReloadUrl("/sternenko/", "")).toBe("/sternenko/")
    expect(buildReloadUrl("/sternenko/", "q=STRIX")).toBe("/sternenko/?q=STRIX")
  })
})
