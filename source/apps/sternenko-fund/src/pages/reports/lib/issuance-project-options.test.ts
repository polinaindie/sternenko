import { describe, expect, it } from "vitest"

import {
  createDefaultIssuanceFilters,
  filterIssuanceRows,
  summarizeClosedRequestsByProject,
} from "./issuance-analytics"
import {
  ISSUANCE_PROJECT_LINES,
  ISSUANCE_PROJECT_OPTIONS,
  ISSUANCE_ROWS,
} from "../mock-data"

describe("issuance project options", () => {
  it("offers only project lines present in the dataset", () => {
    expect(ISSUANCE_PROJECT_OPTIONS.length).toBeGreaterThan(0)

    for (const option of ISSUANCE_PROJECT_OPTIONS) {
      expect(ISSUANCE_ROWS.some((row) => row.project === option)).toBe(true)
    }

    const withoutRows = ISSUANCE_PROJECT_LINES.filter(
      (line) => !ISSUANCE_PROJECT_OPTIONS.includes(line)
    )
    for (const line of withoutRows) {
      expect(ISSUANCE_ROWS.some((row) => row.project === line)).toBe(false)
    }
  })

  it("returns rows for every offered option", () => {
    for (const option of ISSUANCE_PROJECT_OPTIONS) {
      const rows = filterIssuanceRows(ISSUANCE_ROWS, {
        ...createDefaultIssuanceFilters(),
        projects: [option],
      })

      expect(rows.length, `«${option}» має видачі`).toBeGreaterThan(0)
    }
  })

  it("labels the breakdown with the same project vocabulary as the chips", () => {
    const breakdown = summarizeClosedRequestsByProject(ISSUANCE_ROWS)

    expect(breakdown.length).toBeGreaterThan(0)
    for (const item of breakdown) {
      expect(ISSUANCE_PROJECT_OPTIONS).toContain(item.project)
    }
  })
})
