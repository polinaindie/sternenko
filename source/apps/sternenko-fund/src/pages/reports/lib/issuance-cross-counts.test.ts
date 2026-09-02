import { describe, expect, it } from "vitest"

import type { IssuanceRow } from "../mock-data"
import { computeIssuanceCrossCounts } from "./issuance-analytics"

const rows = [
  {
    date: "01.05.2026",
    productName: "Дрон",
    project: "Поточний",
    unit: "Альфа",
  },
  {
    date: "02.05.2026",
    productName: "Дрон",
    project: "Поточний",
    unit: "Альфа",
  },
  {
    date: "03.05.2026",
    productName: "Дрон",
    project: "Поточний",
    unit: "Бета",
  },
  {
    date: "04.05.2026",
    productName: "Дрон",
    project: "Шахедоріз",
    unit: "Альфа",
  },
] as IssuanceRow[]

const baseFilters = {
  from: new Date(2026, 4, 1),
  to: new Date(2026, 4, 31),
  nameQuery: "",
  projects: [] as string[],
  units: [] as string[],
}

describe("computeIssuanceCrossCounts", () => {
  it("counts every option when the counterpart is not narrowed", () => {
    const counts = computeIssuanceCrossCounts(rows, baseFilters)

    expect(counts.projects.get("Поточний")).toBe(3)
    expect(counts.projects.get("Шахедоріз")).toBe(1)
    expect(counts.units.get("Альфа")).toBe(3)
    expect(counts.units.get("Бета")).toBe(1)
  })

  it("updates project counts from units without filtering projects by themselves", () => {
    const counts = computeIssuanceCrossCounts(rows, {
      ...baseFilters,
      projects: ["Поточний"],
      units: ["Альфа"],
    })

    expect(counts.projects.get("Поточний")).toBe(2)
    expect(counts.projects.get("Шахедоріз")).toBe(1)
  })

  it("updates unit counts from projects without filtering units by themselves", () => {
    const counts = computeIssuanceCrossCounts(rows, {
      ...baseFilters,
      projects: ["Поточний"],
      units: ["Альфа"],
    })

    expect(counts.units.get("Альфа")).toBe(2)
    expect(counts.units.get("Бета")).toBe(1)
  })
})
