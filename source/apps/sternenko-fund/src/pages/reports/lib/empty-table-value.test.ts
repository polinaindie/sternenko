import { describe, expect, it } from "vitest"

import {
  EMPTY_TABLE_VALUE,
  formatTableCellValue,
  isEmptyTableValue,
} from "./empty-table-value"

describe("empty table value", () => {
  it("treats blank and dash placeholders as empty", () => {
    expect(isEmptyTableValue("")).toBe(true)
    expect(isEmptyTableValue("   ")).toBe(true)
    expect(isEmptyTableValue("—")).toBe(true)
    expect(isEmptyTableValue("-")).toBe(true)
    expect(isEmptyTableValue(null)).toBe(true)
    expect(isEmptyTableValue("Небесний")).toBe(false)
    expect(isEmptyTableValue(0)).toBe(false)
  })

  it("formats missing values as a hyphen", () => {
    expect(formatTableCellValue("")).toBe(EMPTY_TABLE_VALUE)
    expect(formatTableCellValue("—")).toBe("-")
    expect(formatTableCellValue("  Акт  ")).toBe("Акт")
    expect(formatTableCellValue(0)).toBe("0")
  })
})
