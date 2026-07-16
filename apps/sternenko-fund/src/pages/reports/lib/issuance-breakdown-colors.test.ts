import { describe, expect, it } from "vitest"

import {
  buildIssuanceBreakdownFillColors,
  getIssuanceBreakdownFillColorByRank,
  ISSUANCE_BREAKDOWN_CHART_PALETTE,
  ISSUANCE_BREAKDOWN_FUNDRAISING_OVERRIDES,
} from "./issuance-breakdown-colors"
import { BRAND_PALETTE } from "./brand-palette"

describe("issuance-breakdown-colors", () => {
  it("opens with the five brandbook main accents in palette order", () => {
    expect(ISSUANCE_BREAKDOWN_CHART_PALETTE.slice(0, 5)).toEqual([
      BRAND_PALETTE.yellow.main,
      BRAND_PALETTE.orange.main,
      BRAND_PALETTE.brown.main,
      BRAND_PALETTE.green.main,
      BRAND_PALETTE.blue.main,
    ])
  })

  it("keeps the first ten chart slots visually distinct", () => {
    const firstTen = ISSUANCE_BREAKDOWN_CHART_PALETTE.slice(0, 10)

    expect(new Set(firstTen).size).toBe(10)
  })

  it("cycles through the palette by rank", () => {
    expect(getIssuanceBreakdownFillColorByRank(0)).toBe(BRAND_PALETTE.yellow.main)
    expect(getIssuanceBreakdownFillColorByRank(1)).toBe(BRAND_PALETTE.orange.main)
    expect(getIssuanceBreakdownFillColorByRank(5)).toBe(BRAND_PALETTE.yellow.mid)
    expect(getIssuanceBreakdownFillColorByRank(16)).toBe(
      getIssuanceBreakdownFillColorByRank(0)
    )
  })

  it("pins Шахедоріз to brandbook green.main and Русоріз to green.mid without shifting other ranks", () => {
    expect(ISSUANCE_BREAKDOWN_FUNDRAISING_OVERRIDES["Шахедоріз"]).toBe(
      BRAND_PALETTE.green.main
    )
    expect(ISSUANCE_BREAKDOWN_FUNDRAISING_OVERRIDES["Русоріз"]).toBe(
      BRAND_PALETTE.green.mid
    )
    expect(
      buildIssuanceBreakdownFillColors(["Русоріз", "Шахедоріз", "Опторіз"])
    ).toEqual([
      BRAND_PALETTE.green.mid,
      BRAND_PALETTE.green.main,
      BRAND_PALETTE.yellow.main,
    ])
  })
})
