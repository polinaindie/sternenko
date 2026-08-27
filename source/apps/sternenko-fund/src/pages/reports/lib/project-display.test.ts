import { describe, expect, it } from "vitest"

import { getProjectDisplayName, resolveProjectLine } from "./project-display"

describe("project-display", () => {
  it("maps fundraisings to canonical project line names", () => {
    expect(getProjectDisplayName("ReDrone")).toBe("РеДрон")
    expect(getProjectDisplayName("Русоріз")).toBe("Поточний")
    expect(getProjectDisplayName("Небесний Русоріз")).toBe("Небесний")
    expect(getProjectDisplayName("Секретний RUSORIZ 2.0")).toBe("Секретний")
    expect(getProjectDisplayName("Опторіз")).toBe("Опторіз")
  })

  it("keeps project line names as-is", () => {
    expect(getProjectDisplayName("Поточний")).toBe("Поточний")
    expect(getProjectDisplayName("Шахедоріз")).toBe("Шахедоріз")
  })

  it("shows a hyphen when the fundraising is missing", () => {
    expect(getProjectDisplayName("—")).toBe("-")
    expect(getProjectDisplayName("")).toBe("-")
  })

  it("resolves project lines from fundraisings", () => {
    expect(resolveProjectLine("ReDrone")).toBe("РеДрон")
    expect(resolveProjectLine("Поточний")).toBe("Поточний")
  })
})
