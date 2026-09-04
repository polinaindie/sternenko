import { describe, expect, it } from "vitest"

import {
  collapseFilterChips,
  confirmRemoveFiltersMessage,
  expandChipsLabel,
  pluralizeFilters,
  queueFilterChip,
} from "./FilterChips"

function chips(count: number) {
  return Array.from({ length: count }, (_, index) => `чип-${index + 1}`)
}

describe("collapseFilterChips", () => {
  it("показує все й не пропонує згортання в межах ліміту", () => {
    const view = collapseFilterChips(chips(6), { limit: 6, expanded: false })

    expect(view.visible).toHaveLength(6)
    expect(view.hiddenCount).toBe(0)
    expect(view.collapsible).toBe(false)
  })

  it("обрізає до ліміту й повідомляє, скільки лишилося поза очима", () => {
    const view = collapseFilterChips(chips(10), { limit: 6, expanded: false })

    expect(view.visible).toEqual(chips(6))
    expect(view.hiddenCount).toBe(4)
    expect(view.collapsible).toBe(true)
  })

  it("у розгорнутому стані показує все, але лишає перемикач", () => {
    const view = collapseFilterChips(chips(10), { limit: 6, expanded: true })

    expect(view.visible).toHaveLength(10)
    expect(view.hiddenCount).toBe(0)
    expect(view.collapsible).toBe(true)
  })

  it("зберігає порядок чипсів — першими лишаються найраніші фільтри", () => {
    const view = collapseFilterChips(chips(9), { limit: 3, expanded: false })

    expect(view.visible).toEqual(["чип-1", "чип-2", "чип-3"])
  })

  it("нульовий ліміт не ховає нічого — інакше фільтр неможливо зняти", () => {
    const view = collapseFilterChips(chips(4), { limit: 0, expanded: false })

    expect(view.visible).toHaveLength(4)
    expect(view.collapsible).toBe(false)
  })
})

describe("expandChipsLabel", () => {
  it("узгоджує числівник з формою слова", () => {
    expect(expandChipsLabel(1)).toBe("Ще 1 фільтр")
    expect(expandChipsLabel(3)).toBe("Ще 3 фільтри")
    expect(expandChipsLabel(7)).toBe("Ще 7 фільтрів")
  })

  it("розділяє тисячі за українським форматом", () => {
    expect(expandChipsLabel(1002)).toContain("фільтри")
    expect(expandChipsLabel(1002).startsWith("Ще 1")).toBe(true)
  })
})

describe("pluralizeFilters", () => {
  it("тримає винятки на 11–14", () => {
    expect(pluralizeFilters(11)).toBe("фільтрів")
    expect(pluralizeFilters(12)).toBe("фільтрів")
    expect(pluralizeFilters(14)).toBe("фільтрів")
  })

  it("повертається до звичайних форм у наступних десятках", () => {
    expect(pluralizeFilters(21)).toBe("фільтр")
    expect(pluralizeFilters(22)).toBe("фільтри")
    expect(pluralizeFilters(25)).toBe("фільтрів")
  })
})

describe("confirmRemoveFiltersMessage", () => {
  it("asks about one filter without naming it in the sentence", () => {
    expect(confirmRemoveFiltersMessage(1)).toBe(
      "Ви впевнені, що хочете очистити фільтр?"
    )
  })

  it("uses the plural when several chips are queued", () => {
    expect(confirmRemoveFiltersMessage(3)).toBe(
      "Ви впевнені, що хочете очистити фільтри?"
    )
  })
})

describe("queueFilterChip", () => {
  it("appends a new chip and ignores a duplicate id", () => {
    const first = queueFilterChip([], { id: "unit:a", label: "A" })
    const second = queueFilterChip(first, { id: "unit:b", label: "B" })
    const again = queueFilterChip(second, { id: "unit:a", label: "A" })

    expect(second.map((chip) => chip.id)).toEqual(["unit:a", "unit:b"])
    expect(again).toHaveLength(2)
  })
})
