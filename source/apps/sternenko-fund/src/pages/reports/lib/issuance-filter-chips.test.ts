import { describe, expect, it } from "vitest"

import {
  buildIssuanceFilterChips,
  createDefaultIssuanceFilters,
  filterIssuanceRows,
  hasIssuanceFilterSelection,
  isSameIssuanceFilters,
} from "./issuance-analytics"
import { ISSUANCE_PROJECT_OPTIONS, ISSUANCE_ROWS } from "../mock-data"

function chipsFor(filters: ReturnType<typeof createDefaultIssuanceFilters>) {
  return buildIssuanceFilterChips(filters, filterIssuanceRows(ISSUANCE_ROWS, filters))
}

describe("issuance filter chip counts", () => {
  it("splits the result between chips of one dimension", () => {
    const filters = createDefaultIssuanceFilters()
    filters.projects = [...ISSUANCE_PROJECT_OPTIONS].slice(0, 2)

    const chips = chipsFor(filters)
    const total = filterIssuanceRows(ISSUANCE_ROWS, filters).length
    const sum = chips
      .filter((chip) => chip.type === "project")
      .reduce((acc, chip) => acc + chip.count, 0)

    expect(chips).toHaveLength(2)
    expect(sum).toBe(total)
  })

  it("keeps the chip and shows a zero when the value has no records", () => {
    const filters = createDefaultIssuanceFilters()
    filters.projects = [ISSUANCE_PROJECT_OPTIONS[0]!]
    filters.nameQuery = "нічого-такого-немає"

    const chips = chipsFor(filters)

    expect(chips.map((chip) => chip.count)).toEqual([0, 0])
    expect(chips.find((chip) => chip.type === "project")?.label).toBe(
      ISSUANCE_PROJECT_OPTIONS[0]
    )
  })

  it("counts the search chip as the whole result", () => {
    const filters = createDefaultIssuanceFilters()
    filters.nameQuery = ISSUANCE_ROWS[0]!.productName

    const rows = filterIssuanceRows(ISSUANCE_ROWS, filters)
    const chips = buildIssuanceFilterChips(filters, rows)

    expect(rows.length).toBeGreaterThan(0)
    expect(chips[0]!.count).toBe(rows.length)
  })
})

describe("issuance apply availability", () => {
  it("treats untouched filters as nothing to apply", () => {
    expect(hasIssuanceFilterSelection(createDefaultIssuanceFilters())).toBe(false)
  })

  it("counts a narrowed period as a selection", () => {
    const filters = createDefaultIssuanceFilters()
    filters.to = filters.from

    expect(hasIssuanceFilterSelection(filters)).toBe(true)
  })

  it("ignores value order when comparing draft with applied", () => {
    const applied = createDefaultIssuanceFilters()
    applied.units = ["81 БПАК", "1030 ОЗРАДн"]
    const draft = {
      ...applied,
      units: ["1030 ОЗРАДн", "81 БПАК"],
      nameQuery: "  ",
    }

    expect(isSameIssuanceFilters(draft, applied)).toBe(true)
  })

  it("sees a cleared draft as a change worth applying", () => {
    const applied = createDefaultIssuanceFilters()
    applied.projects = [ISSUANCE_PROJECT_OPTIONS[0]!]
    const draft = createDefaultIssuanceFilters()

    expect(hasIssuanceFilterSelection(draft)).toBe(false)
    expect(isSameIssuanceFilters(draft, applied)).toBe(false)
  })
})
