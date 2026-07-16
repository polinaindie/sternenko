import { describe, expect, it } from "vitest"

import type { IncomeTransaction } from "../data/income-transactions"
import { ISSUANCE_ROWS } from "../mock-data"
import {
  computeIncomeFilterAvailability,
  dayRange,
  defaultIncomePeriod,
  endOfDay,
  startOfDay,
} from "./income-analytics"
import { computeIssuanceFilterAvailability, defaultIssuancePeriod } from "./issuance-analytics"
import {
  computeFilterAvailability,
  inactiveOptions,
  pruneFilterSelectionsForAvailability,
  pruneProjectFundraiserFilters,
} from "./filter-availability"

function makeIncomeRow(
  overrides: Partial<IncomeTransaction> & Pick<IncomeTransaction, "at">
): IncomeTransaction {
  return {
    id: overrides.at,
    source: "Monobank",
    amount: 1000,
    currency: "UAH",
    amountUah: 1000,
    fundraising: "Русоріз",
    counterparty: "Платежі Бітлз_бездоговірні",
    comment: "Благодійний внесок на конверт",
    ...overrides,
  }
}

const FIXTURE_INCOME_ROWS: IncomeTransaction[] = [
  makeIncomeRow({ at: "2026-06-10T10:00:00", fundraising: "Русоріз" }),
  makeIncomeRow({ at: "2026-06-10T12:00:00", fundraising: "Шахедоріз" }),
  makeIncomeRow({ at: "2026-06-11T09:00:00", fundraising: "ReDrone" }),
]

describe("computeFilterAvailability", () => {
  it("marks only fundraisers with data in a single day as active", () => {
    const dayWithData = FIXTURE_INCOME_ROWS[0]!
    const date = startOfDay(new Date(dayWithData.at))

    const availability = computeIncomeFilterAvailability(
      FIXTURE_INCOME_ROWS,
      dayRange(date)
    )
    const inactive = inactiveOptions(
      ["Русоріз", "Шахедоріз"],
      availability.activeFundraisers
    )

    expect(availability.activeFundraisers.size).toBeGreaterThan(0)
    expect(availability.activeFundraisers.has("Русоріз")).toBe(true)
  })

  it("keeps all options inactive when the period has no rows", () => {
    const availability = computeIncomeFilterAvailability(FIXTURE_INCOME_ROWS, {
      from: new Date(2030, 0, 1),
      to: endOfDay(new Date(2030, 0, 1)),
    })

    expect(availability.activeProjects.size).toBe(0)
    expect(availability.activeFundraisers.size).toBe(0)
  })

  it("recalculates availability when the period changes", () => {
    const narrow = computeIncomeFilterAvailability(FIXTURE_INCOME_ROWS, {
      from: new Date(2026, 5, 10),
      to: endOfDay(new Date(2026, 5, 10)),
    })
    const wide = computeIncomeFilterAvailability(FIXTURE_INCOME_ROWS, {
      from: new Date(2026, 5, 1),
      to: endOfDay(new Date(2026, 5, 18)),
    })

    expect(wide.activeFundraisers.size).toBeGreaterThanOrEqual(
      narrow.activeFundraisers.size
    )
    expect(wide.activeProjects.size).toBeGreaterThanOrEqual(
      narrow.activeProjects.size
    )
  })
})

describe("pruneFilterSelectionsForAvailability", () => {
  const all = ["A", "B", "C"] as const
  const active = new Set(["A", "C"])

  it("keeps full selection unchanged", () => {
    expect(pruneFilterSelectionsForAvailability([...all], all, active)).toEqual([...all])
  })

  it("drops inactive picks from partial selections", () => {
    expect(pruneFilterSelectionsForAvailability(["A", "B"], all, active)).toEqual(["A"])
  })

  it("restores full selection when every picked option becomes inactive", () => {
    expect(pruneFilterSelectionsForAvailability(["B"], all, active)).toEqual([...all])
  })
})

describe("pruneProjectFundraiserFilters", () => {
  it("prunes both dimensions independently", () => {
    const next = pruneProjectFundraiserFilters(
      {
        projects: ["Поточний", "Шахедоріз"],
        fundraisings: ["Русоріз", "Шахедоріз"],
      },
      ["Поточний", "Шахедоріз", "Небесний"],
      ["Русоріз", "Шахедоріз", "ReDrone"],
      {
        activeProjects: new Set(["Поточний"]),
        activeFundraisers: new Set(["Шахедоріз"]),
      }
    )

    expect(next.projects).toEqual(["Поточний"])
    expect(next.fundraisings).toEqual(["Шахедоріз"])
  })
})

describe("default income period with imported data window", () => {
  it("matches the imported reporting window", () => {
    const period = defaultIncomePeriod()
    expect(period.from.getFullYear()).toBe(2026)
    expect(period.from.getMonth()).toBe(5)
    expect(period.from.getDate()).toBe(6)
    expect(period.to.getMonth()).toBe(6)
    expect(period.to.getDate()).toBe(6)
  })
})

describe("default issuance period with imported data window", () => {
  it("matches the imported reporting window", () => {
    const period = defaultIssuancePeriod()
    expect(period.from.getFullYear()).toBe(2026)
    expect(period.from.getMonth()).toBe(4)
    expect(period.from.getDate()).toBe(1)
    expect(period.to.getMonth()).toBe(4)
    expect(period.to.getDate()).toBe(30)
  })
})

describe("computeIssuanceFilterAvailability", () => {
  it("evaluates projects and fundraisers separately for issuance rows", () => {
    const availability = computeIssuanceFilterAvailability(ISSUANCE_ROWS, {
      from: new Date(2026, 4, 1),
      to: endOfDay(new Date(2026, 4, 30)),
    })

    expect(availability.activeProjects.size).toBeGreaterThan(0)
    expect(availability.activeFundraisers.size).toBeGreaterThan(0)
  })

  it("uses row dates from issuance data", () => {
    const availability = computeFilterAvailability({
      rows: ISSUANCE_ROWS,
      period: {
        from: new Date(2026, 4, 15),
        to: endOfDay(new Date(2026, 4, 15)),
      },
      getRowDate: (row) => {
        const [day, month, year] = row.date.split(".").map(Number)
        return new Date(year!, (month ?? 1) - 1, day ?? 1)
      },
      getProject: (row) => row.project,
      getFundraiser: (row) => row.fundraising,
      allProjects: ["Шахедоріз"],
      allFundraisers: ["Шахедоріз"],
    })

    expect(availability.activeProjects.has("Шахедоріз")).toBe(true)
    expect(availability.activeFundraisers.has("Шахедоріз")).toBe(true)
  })
})
