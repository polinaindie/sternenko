import { describe, expect, it } from "vitest"

import {
  formatIncomeCommentDisplay,
  sanitizeIncomeComment,
} from "./income-comment-display"

describe("income comment display", () => {
  it("keeps generic donation comments", () => {
    expect(formatIncomeCommentDisplay("Благодійний внесок на конверт")).toBe(
      "Благодійний внесок на конверт"
    )
  })

  it("removes donor names from assistance comments", () => {
    expect(
      sanitizeIncomeComment(
        "Благодійна допомога від Нікітюк Мирослав Віталійович, Нікітюк Мирослав Віталійович"
      )
    ).toBe("Благодійна допомога")
  })

  it("removes payer details and keeps purpose", () => {
    expect(
      sanitizeIncomeComment(
        "На дрони Платник ЛИСЕНКО ПАВЛО МИХАЙЛОВИЧ ІПН 2833503934 Рахунок платника UA373003460000026208912670030"
      )
    ).toBe("На дрони")
  })

  it("removes ccid identifiers", () => {
    expect(
      sanitizeIncomeComment(
        "безповоротна благодійна допомога, ccid: 1c5fc66f-d370-455d-a5b2-094cce5bcc98"
      )
    ).toBe("безповоротна благодійна допомога")
  })

  it("removes trailing personal names after comma", () => {
    expect(
      sanitizeIncomeComment("На добру справу, Годоба Олександр Вiкторович")
    ).toBe("На добру справу")
  })

  it("removes latin-i bank comments with account and duplicate names", () => {
    expect(
      formatIncomeCommentDisplay(
        "Благодiйна допомога  UA353052990000026009000147387, Антипенко Дар'я Володимирiвна, Антипенко Дар'я Володимирiвна"
      )
    ).toBe("Благодійна допомога")
  })

  it("removes donor name and bank date from transfer comments", () => {
    expect(
      formatIncomeCommentDisplay(
        "Переказ у фонд Спільнота Стерненка від Статіва Сергій Вікторович 20260701"
      )
    ).toBe("Переказ у фонд Спільнота Стерненка")
  })

  it("removes donor from quoted fund donation template", () => {
    expect(
      formatIncomeCommentDisplay(
        'Донат у благодійний фонд "Спільнота Стерненка" від Дуднікова Олександра Володимирівна 20260706'
      )
    ).toBe('Донат у благодійний фонд "Спільнота Стерненка"')
  })

  it("removes donor from project-specific transfer comments", () => {
    expect(
      formatIncomeCommentDisplay(
        "На Поточний Русоріз від Баранова Наталія Володимирівна 20260706"
      )
    ).toBe("На Поточний Русоріз")
  })

  it("returns dash when only personal data remains", () => {
    expect(formatIncomeCommentDisplay("Гох Максим Iгорович")).toBe("—")
  })
})
