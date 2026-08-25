import { describe, expect, it } from "vitest"

import {
  incomeMetricsLayouts,
  junctionCorners,
} from "./merged-grid-layout"

describe("junctionCorners", () => {
  it("lg: заокруглює лише внутрішні хрести KPI-ряду та hero", () => {
    const { lg } = incomeMetricsLayouts
    const byId = (id: string) => lg.find((cell) => cell.id === id)!

    expect(junctionCorners(byId("kpi1"), lg)).toEqual(["br"])
    expect(junctionCorners(byId("kpi2"), lg)).toEqual(["bl", "br"])
    expect(junctionCorners(byId("kpi3"), lg)).toEqual(["bl"])
    expect(junctionCorners(byId("hero"), lg)).toEqual([])
  })

  it("mobile: вертикальний стек без хрестів — усі кути гострі", () => {
    const { mobile } = incomeMetricsLayouts

    for (const cell of mobile) {
      expect(junctionCorners(cell, mobile)).toEqual([])
    }
  })
})
