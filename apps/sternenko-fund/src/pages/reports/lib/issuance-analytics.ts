import {
  FUNDRAISINGS,
  ISSUANCE_PROJECT_LINES,
  ISSUANCE_PROPERTY_CATEGORIES,
  ISSUANCE_UNITS,
  type IssuanceProjectLine,
  type IssuancePropertyCategory,
  type IssuanceRow,
} from "../mock-data"
import {
  clampIncomeRange,
  defaultIncomePeriod,
  formatPeriodLabel,
  isDefaultIncomePeriod,
} from "./income-analytics"

export type IssuanceFilters = {
  from: Date
  to: Date
  nameQuery: string
  fundraisings: string[]
  units: string[]
  categories: IssuancePropertyCategory[]
}

export type IssuanceFilterChip = {
  id: string
  label: string
  type:
    | "period"
    | "name"
    | "fundraising"
    | "unit"
    | "category"
}

function parseIssuanceDate(value: string): Date {
  const [day, month, year] = value.split(".").map(Number)
  return new Date(year!, (month ?? 1) - 1, day ?? 1)
}

export function createDefaultIssuanceFilters(): IssuanceFilters {
  const { from, to } = defaultIncomePeriod()
  return {
    from,
    to,
    nameQuery: "",
    fundraisings: [...FUNDRAISINGS],
    units: [...ISSUANCE_UNITS],
    categories: [...ISSUANCE_PROPERTY_CATEGORIES],
  }
}

export function hasActiveIssuanceFilters(filters: IssuanceFilters): boolean {
  if (!isDefaultIncomePeriod(filters.from, filters.to)) return true
  if (filters.nameQuery.trim()) return true
  if (filters.fundraisings.length < FUNDRAISINGS.length) return true
  if (filters.units.length < ISSUANCE_UNITS.length) return true
  if (filters.categories.length < ISSUANCE_PROPERTY_CATEGORIES.length) return true
  return false
}

export function filterIssuanceRows(
  rows: IssuanceRow[],
  filters: IssuanceFilters
): IssuanceRow[] {
  const query = filters.nameQuery.trim().toLowerCase()
  const { from, to } = clampIncomeRange(filters.from, filters.to)
  const fromMs = from.getTime()
  const toMs = to.getTime()

  return rows.filter((row) => {
    const ms = parseIssuanceDate(row.date).getTime()
    if (ms < fromMs || ms > toMs) return false
    if (query && !row.productName.toLowerCase().includes(query)) return false
    if (!filters.fundraisings.includes(row.fundraising)) return false
    if (!filters.units.includes(row.unit)) return false
    if (!filters.categories.includes(row.category)) return false
    return true
  })
}

export function buildIssuanceFilterChips(filters: IssuanceFilters): IssuanceFilterChip[] {
  const chips: IssuanceFilterChip[] = []

  if (!isDefaultIncomePeriod(filters.from, filters.to)) {
    chips.push({
      id: "period",
      label: formatPeriodLabel(filters.from, filters.to),
      type: "period",
    })
  }

  const name = filters.nameQuery.trim()
  if (name) {
    chips.push({ id: "name", label: `«${name}»`, type: "name" })
  }

  if (filters.fundraisings.length < FUNDRAISINGS.length) {
    for (const fundraising of filters.fundraisings) {
      chips.push({ id: `fundraising:${fundraising}`, label: fundraising, type: "fundraising" })
    }
  }

  if (filters.units.length < ISSUANCE_UNITS.length) {
    for (const unit of filters.units) {
      chips.push({ id: `unit:${unit}`, label: unit, type: "unit" })
    }
  }

  if (filters.categories.length < ISSUANCE_PROPERTY_CATEGORIES.length) {
    for (const category of filters.categories) {
      chips.push({ id: `category:${category}`, label: category, type: "category" })
    }
  }

  return chips
}

export function removeIssuanceFilterChip(
  filters: IssuanceFilters,
  chip: IssuanceFilterChip
): IssuanceFilters {
  if (chip.type === "period") {
    const { from, to } = defaultIncomePeriod()
    return { ...filters, from, to }
  }

  if (chip.type === "name") {
    return { ...filters, nameQuery: "" }
  }

  if (chip.type === "fundraising") {
    const next = filters.fundraisings.filter((item) => item !== chip.label)
    return {
      ...filters,
      fundraisings: next.length === 0 ? [...FUNDRAISINGS] : next,
    }
  }

  if (chip.type === "unit") {
    const next = filters.units.filter((item) => item !== chip.label)
    return {
      ...filters,
      units: next.length === 0 ? [...ISSUANCE_UNITS] : next,
    }
  }

  if (chip.type === "category") {
    const next = filters.categories.filter((item) => item !== chip.label)
    return {
      ...filters,
      categories: next.length === 0 ? [...ISSUANCE_PROPERTY_CATEGORIES] : next,
    }
  }

  return filters
}

export type IssuanceProjectRequestBreakdownItem = {
  project: IssuanceProjectLine
  count: number
  amountUah: number
  share: number
}

export type IssuanceKpiSummary = {
  totalPurchaseAmountUah: number
  closedRequestsCount: number
  lossesUsd: number
}

/** Орієнтовні збитки ворогу за рядком видачі (детерміновано від id для стабільних моків). */
function estimateRowLossesUsd(row: IssuanceRow): number {
  if (row.category !== "FPV-дрони" && row.category !== "БК") return 0
  const seed = [...row.id].reduce((sum, char) => sum + char.charCodeAt(0), 0)
  const lossPerUnitUsd = 300 + (seed % 400)
  return Math.round((row.quantity * lossPerUnitUsd) / 100) * 100
}

/** KPI закупівель за застосованими фільтрами (дата видачі та ін.). */
export function summarizeIssuanceKpis(rows: IssuanceRow[]): IssuanceKpiSummary {
  return {
    totalPurchaseAmountUah: rows.reduce((sum, row) => sum + row.total, 0),
    closedRequestsCount: rows.length,
    lossesUsd: rows.reduce((sum, row) => sum + estimateRowLossesUsd(row), 0),
  }
}

export function formatRequestCountCaption(count: number): string {
  const abs = Math.abs(count)
  const mod10 = abs % 10
  const mod100 = abs % 100
  if (mod10 === 1 && mod100 !== 11) return "запит"
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "запити"
  return "запитів"
}

/** Кількість закритих запитів (рядків видачі) за проєктами після фільтрів. */
export function summarizeClosedRequestsByProject(
  rows: IssuanceRow[]
): IssuanceProjectRequestBreakdownItem[] {
  if (rows.length === 0) return []

  const counts = new Map<IssuanceProjectLine, number>()
  const amounts = new Map<IssuanceProjectLine, number>()
  for (const project of ISSUANCE_PROJECT_LINES) {
    counts.set(project, 0)
    amounts.set(project, 0)
  }
  for (const row of rows) {
    counts.set(row.project, (counts.get(row.project) ?? 0) + 1)
    amounts.set(row.project, (amounts.get(row.project) ?? 0) + row.total)
  }

  const grandTotal = rows.length
  const items = ISSUANCE_PROJECT_LINES.map((project) => ({
    project,
    count: counts.get(project) ?? 0,
    amountUah: amounts.get(project) ?? 0,
    share: Math.round(((counts.get(project) ?? 0) / grandTotal) * 100),
  }))

  const shareTotal = items.reduce((sum, item) => sum + item.share, 0)
  if (shareTotal !== 100) {
    const top = items.reduce((best, item) => (item.count > best.count ? item : best))
    top.share += 100 - shareTotal
  }

  return [...items].sort((left, right) => {
    if (left.count !== right.count) return right.count - left.count
    return left.project.localeCompare(right.project, "uk")
  })
}
