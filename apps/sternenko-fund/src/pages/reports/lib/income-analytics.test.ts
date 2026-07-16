import { describe, expect, it } from "vitest"

import type { IncomeTransaction } from "../data/income-transactions"
import { INCOME_SOURCE_CHART_KEY, INCOME_SOURCES } from "../mock-data"
import {
  applyStackedBarMinSegmentDisplay,
  buildIncomeChartData,
  chartBarLayout,
  countChartBuckets,
  resolveIncomeChartSources,
  suggestChartGranularity,
} from "./income-analytics"

function makeRow(at: string, amountUah: number): IncomeTransaction {
  return {
    id: at,
    at,
    source: "Monobank",
    amount: amountUah,
    currency: "UAH",
    amountUah,
    fundraising: "Русоріз",
    counterparty: "Платежі Бітлз_бездоговірні",
    comment: "Благодійний внесок на конверт",
  }
}

const monobankKey = INCOME_SOURCE_CHART_KEY.Monobank

describe("resolveIncomeChartSources", () => {
  it("повертає всі джерела, якщо фільтр не звужений", () => {
    expect(resolveIncomeChartSources([...INCOME_SOURCES])).toEqual([
      ...INCOME_SOURCES,
    ])
    expect(resolveIncomeChartSources([])).toEqual([...INCOME_SOURCES])
  })

  it("повертає обрані джерела в канонічному порядку, навіть без даних", () => {
    expect(
      resolveIncomeChartSources(["Portmone", "Monobank"])
    ).toEqual(["Monobank", "Portmone"])
  })
})

describe("buildIncomeChartData — заповнення пропусків", () => {
  it("створює bucket для кожного дня діапазону, навіть без транзакцій", () => {
    const rows = [makeRow("2026-01-01T10:00:00", 500)]
    const range = { from: new Date(2026, 0, 1), to: new Date(2026, 0, 7) }

    const data = buildIncomeChartData(rows, "day", range)

    expect(data).toHaveLength(7)
    expect(data[0]![monobankKey]).toBe(500)
    // Решта днів — нулі, а не пропуски.
    expect(data.slice(1).every((row) => row[monobankKey] === 0)).toBe(true)
  })

  it("зберігає хронологічний порядок bucketів", () => {
    const range = { from: new Date(2026, 0, 1), to: new Date(2026, 0, 3) }
    const data = buildIncomeChartData([], "day", range)
    const keys = data.map((row) => row.sortKey)
    expect(keys).toEqual([...keys].sort())
  })

  it("без range повертає лише дні з транзакціями", () => {
    const rows = [
      makeRow("2026-01-01T10:00:00", 100),
      makeRow("2026-01-05T10:00:00", 200),
    ]
    const data = buildIncomeChartData(rows, "day")
    expect(data).toHaveLength(2)
  })
})

describe("countChartBuckets", () => {
  it("рік по днях ≈ 365 стовпців", () => {
    const from = new Date(2026, 0, 1)
    const to = new Date(2026, 11, 31)
    expect(countChartBuckets(from, to, "day")).toBe(365)
  })

  it("рік по місяцях = 12 стовпців", () => {
    const from = new Date(2026, 0, 1)
    const to = new Date(2026, 11, 31)
    expect(countChartBuckets(from, to, "month")).toBe(12)
  })

  it("2 роки по місяцях = 24 стовпці", () => {
    const from = new Date(2025, 0, 1)
    const to = new Date(2026, 11, 31)
    expect(countChartBuckets(from, to, "month")).toBe(24)
  })

  it("3 роки по місяцях = 36 стовпців", () => {
    const from = new Date(2024, 0, 1)
    const to = new Date(2026, 11, 31)
    expect(countChartBuckets(from, to, "month")).toBe(36)
  })
})

describe("suggestChartGranularity", () => {
  it("короткий період (≤45 днів) → день", () => {
    expect(
      suggestChartGranularity(new Date(2026, 0, 1), new Date(2026, 0, 20))
    ).toBe("day")
  })

  it("середній період (46–120 днів) → тиждень", () => {
    expect(
      suggestChartGranularity(new Date(2026, 0, 1), new Date(2026, 2, 31))
    ).toBe("week")
  })

  it("рік і більше → місяць", () => {
    expect(
      suggestChartGranularity(new Date(2026, 0, 1), new Date(2026, 11, 31))
    ).toBe("month")
    expect(
      suggestChartGranularity(new Date(2024, 0, 1), new Date(2026, 11, 31))
    ).toBe("month")
  })
})

describe("chartBarLayout", () => {
  it("менше bucketів ніж вміщається на мін. ширині — розтягує до viewport", () => {
    const oneDay = chartBarLayout("day", 1, 400, 16)
    const nineDays = chartBarLayout("day", 9, 900, 16)

    expect(oneDay.fillsViewport).toBe(true)
    expect(nineDays.fillsViewport).toBe(true)
    expect(oneDay.barWidth).toBeGreaterThan(nineDays.barWidth)
    expect(nineDays.categoryWidth * 9).toBeCloseTo(884, 0)
  })

  it("більше bucketів ніж вміщається — мін. ширина і скрол", () => {
    const layout = chartBarLayout("day", 100, 900, 16)
    expect(layout.fillsViewport).toBe(false)
    expect(layout.barWidth).toBe(20)
    expect(layout.categoryWidth).toBe(24)
  })

  it("на межі viewport — мін. ширина заповнює всю площу", () => {
    const plotWidth = 900 - 16
    const maxBuckets = Math.floor(plotWidth / 24)
    const layout = chartBarLayout("day", maxBuckets, 900, 16)
    expect(layout.fillsViewport).toBe(true)
    expect(layout.categoryWidth).toBeCloseTo(plotWidth / maxBuckets, 5)
  })
})

describe("applyStackedBarMinSegmentDisplay", () => {
  it("піднімає ненульові сегменти до мінімальної висоти 6px", () => {
    const rows = [
      {
        period: "01.01.26",
        sortKey: "2026-01-01",
        [monobankKey]: 50,
      } as ReturnType<typeof buildIncomeChartData>[number],
    ]

    const yMax = 50_000
    const plotHeightPx = 300
    const minValue = (6 / plotHeightPx) * yMax

    const display = applyStackedBarMinSegmentDisplay(rows, yMax, plotHeightPx)

    expect(display[0]![monobankKey]).toBe(minValue)
  })

  it("не змінює нульові сегменти", () => {
    const rows = [
      {
        period: "01.01.26",
        sortKey: "2026-01-01",
        [monobankKey]: 0,
      } as ReturnType<typeof buildIncomeChartData>[number],
    ]

    const display = applyStackedBarMinSegmentDisplay(rows, 50_000, 300)

    expect(display[0]![monobankKey]).toBe(0)
  })

  it("не змінює сегменти, що вже вище мінімуму", () => {
    const rows = [
      {
        period: "01.01.26",
        sortKey: "2026-01-01",
        [monobankKey]: 25_000,
      } as ReturnType<typeof buildIncomeChartData>[number],
    ]

    const display = applyStackedBarMinSegmentDisplay(rows, 50_000, 300)

    expect(display[0]![monobankKey]).toBe(25_000)
  })
})
