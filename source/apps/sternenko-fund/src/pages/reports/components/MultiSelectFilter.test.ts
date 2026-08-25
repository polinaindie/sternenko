import { describe, expect, it } from "vitest"

import {
  isFilterSelectionActive,
  selectionLabel,
} from "./MultiSelectFilter"

const OPTIONS = ["Поточний", "Шахедоріз", "Небесний", "РеДрон"] as const

describe("selectionLabel", () => {
  it("uses the empty placeholder when nothing is selected", () => {
    expect(selectionLabel(OPTIONS, [], "Обрати проєкти", "Усі проєкти")).toBe(
      "Обрати проєкти"
    )
  })

  it("shows up to three selected names", () => {
    expect(
      selectionLabel(
        OPTIONS,
        ["Поточний", "Шахедоріз", "Небесний"],
        "Обрати проєкти",
        "Усі проєкти"
      )
    ).toBe("Поточний, Шахедоріз, Небесний")
  })

  it("shows a count above three and a dedicated all-selected label", () => {
    expect(
      selectionLabel(OPTIONS, [...OPTIONS], "Обрати проєкти", "Усі проєкти")
    ).toBe("Усі проєкти")
    expect(
      selectionLabel(
        [...OPTIONS, "Опторіз"],
        [...OPTIONS],
        "Обрати проєкти",
        "Усі проєкти"
      )
    ).toBe("Обрано 4")
  })
})

describe("isFilterSelectionActive", () => {
  it("treats empty and complete selections as no narrowing", () => {
    expect(isFilterSelectionActive(OPTIONS, [])).toBe(false)
    expect(isFilterSelectionActive(OPTIONS, [...OPTIONS])).toBe(false)
  })

  it("treats a partial selection as narrowing", () => {
    expect(isFilterSelectionActive(OPTIONS, ["Поточний"])).toBe(true)
  })
})
