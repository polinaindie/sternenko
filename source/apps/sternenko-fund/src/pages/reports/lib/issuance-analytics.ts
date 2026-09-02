import {
  FUNDRAISINGS,
  ISSUANCE_PROJECT_LINES,
  ISSUANCE_PROJECT_OPTIONS,
  ISSUANCE_PROPERTY_CATEGORIES,
  ISSUANCE_UNITS,
  toIssuanceProjectLine,
  type IssuanceProjectLine,
  type IssuancePropertyCategory,
  type IssuanceRow,
} from "../mock-data"
import {
  ISSUANCE_REPORTING_END,
  ISSUANCE_REPORTING_START,
} from "../data/issuance-reporting"
import { clampIncomeRange, isSameIncomePeriod } from "./income-analytics"
import { computeFilterAvailability } from "./filter-availability"
import { matchesNameQuery } from "./fuzzy-text-match"

export type IssuanceFilters = {
  from: Date
  to: Date
  nameQuery: string
  projects: IssuanceProjectLine[]
  fundraisings: string[]
  units: string[]
  categories: IssuancePropertyCategory[]
}

export type IssuanceFilterChip = {
  id: string
  label: string
  /** Скільки зі знайдених записів належить цьому значенню; сума чіпсів одного виміру дорівнює загальній кількості. */
  count: number
  type: "name" | "project" | "fundraising" | "unit" | "category"
}

export type IssuanceResultPayload = {
  rows: IssuanceRow[]
  /** ISO calendar dates with records for the applied non-date filters. */
  activeDates: string[]
}

function parseIssuanceDate(value: string): Date {
  const [day, month, year] = value.split(".").map(Number)
  return new Date(year!, (month ?? 1) - 1, day ?? 1)
}

function issuanceDateToIso(value: string): string {
  const [day, month, year] = value.split(".")
  return `${year}-${month}-${day}`
}

export function defaultIssuancePeriod(): { from: Date; to: Date } {
  return clampIncomeRange(ISSUANCE_REPORTING_START, ISSUANCE_REPORTING_END)
}

export function isDefaultIssuancePeriod(from: Date, to: Date): boolean {
  return isSameIncomePeriod({ from, to }, defaultIssuancePeriod())
}

function formatIssuanceDate(date: Date, includeYear: boolean): string {
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  return includeYear
    ? `${day}.${month}.${date.getFullYear()}`
    : `${day}.${month}`
}

export function formatIssuancePeriod(from: Date, to: Date): string {
  const sameDay =
    from.getFullYear() === to.getFullYear() &&
    from.getMonth() === to.getMonth() &&
    from.getDate() === to.getDate()

  if (sameDay) return formatIssuanceDate(from, true)

  const sameYear = from.getFullYear() === to.getFullYear()
  return `${formatIssuanceDate(from, !sameYear)} – ${formatIssuanceDate(to, !sameYear)}`
}

export const ISSUANCE_EMPTY_FILTERS_MESSAGE =
  "За обраними фільтрами не знайдено результатів"

export function collectIssuanceProductNames(
  rows: readonly IssuanceRow[]
): string[] {
  return [...new Set(rows.map((row) => row.productName))].sort((a, b) =>
    a.localeCompare(b, "uk")
  )
}

export function createDefaultIssuanceFilters(): IssuanceFilters {
  const { from, to } = defaultIssuancePeriod()
  return {
    from,
    to,
    nameQuery: "",
    projects: [],
    fundraisings: [...FUNDRAISINGS],
    units: [],
    categories: [...ISSUANCE_PROPERTY_CATEGORIES],
  }
}

/** Чи обрано бодай один параметр фільтрації — разом з періодом. */
export function hasIssuanceFilterSelection(filters: IssuanceFilters): boolean {
  return (
    hasActiveIssuanceFilters(filters) ||
    !isDefaultIssuancePeriod(filters.from, filters.to)
  )
}

function sameFilterValues(a: readonly string[], b: readonly string[]): boolean {
  if (a.length !== b.length) return false
  const left = [...a].sort()
  const right = [...b].sort()
  return left.every((value, index) => value === right[index])
}

export function isSameIssuanceFilters(
  a: IssuanceFilters,
  b: IssuanceFilters
): boolean {
  return (
    isSameIncomePeriod(
      { from: a.from, to: a.to },
      { from: b.from, to: b.to }
    ) &&
    a.nameQuery.trim() === b.nameQuery.trim() &&
    sameFilterValues(a.projects, b.projects) &&
    sameFilterValues(a.fundraisings, b.fundraisings) &&
    sameFilterValues(a.units, b.units) &&
    sameFilterValues(a.categories, b.categories)
  )
}

/** Активність будь-якого виміру, крім періоду. */
export function hasActiveIssuanceFilters(filters: IssuanceFilters): boolean {
  if (filters.nameQuery.trim()) return true
  if (
    filters.projects.length > 0 &&
    filters.projects.length < ISSUANCE_PROJECT_OPTIONS.length
  )
    return true
  if (filters.fundraisings.length < FUNDRAISINGS.length) return true
  if (
    filters.units.length > 0 &&
    filters.units.length < ISSUANCE_UNITS.length
  ) {
    return true
  }
  if (filters.categories.length < ISSUANCE_PROPERTY_CATEGORIES.length)
    return true
  return false
}

export function filterIssuanceRows(
  rows: IssuanceRow[],
  filters: IssuanceFilters
): IssuanceRow[] {
  const { from, to } = clampIncomeRange(filters.from, filters.to)
  const fromMs = from.getTime()
  const toMs = to.getTime()

  return rows.filter((row) => {
    const ms = parseIssuanceDate(row.date).getTime()
    if (ms < fromMs || ms > toMs) return false
    return matchesIssuanceDimensions(row, filters)
  })
}

function matchesIssuanceDimensions(
  row: IssuanceRow,
  filters: IssuanceFilters
): boolean {
  if (!matchesNameQuery(row.productName, filters.nameQuery)) return false
  if (
    filters.projects.length > 0 &&
    filters.projects.length < ISSUANCE_PROJECT_OPTIONS.length
  ) {
    const project = toIssuanceProjectLine(row.project)
    if (!project || !filters.projects.includes(project)) return false
  }
  if (
    filters.fundraisings.length > 0 &&
    filters.fundraisings.length < FUNDRAISINGS.length &&
    !filters.fundraisings.includes(row.fundraising)
  ) {
    return false
  }
  if (
    filters.units.length > 0 &&
    filters.units.length < ISSUANCE_UNITS.length &&
    !filters.units.includes(row.unit)
  ) {
    return false
  }
  if (
    filters.categories.length > 0 &&
    filters.categories.length < ISSUANCE_PROPERTY_CATEGORIES.length &&
    !filters.categories.includes(row.category)
  ) {
    return false
  }
  return true
}

/** Дати з даними за всіма вимірами, крім самого періоду. */
export function collectIssuanceActiveDates(
  rows: readonly IssuanceRow[],
  filters: IssuanceFilters
): string[] {
  const activeDates = new Set<string>()

  for (const row of rows) {
    if (matchesIssuanceDimensions(row, filters)) {
      activeDates.add(issuanceDateToIso(row.date))
    }
  }

  return [...activeDates].sort()
}

/**
 * Endpoint-shaped result: table rows respect the date range, while activeDates
 * span the dataset and respect only the currently applied dimensions.
 */
export function filterIssuanceResult(
  rows: IssuanceRow[],
  filters: IssuanceFilters
): IssuanceResultPayload {
  return {
    rows: filterIssuanceRows(rows, filters),
    activeDates: collectIssuanceActiveDates(rows, filters),
  }
}

export type IssuanceCrossCounts = {
  projects: ReadonlyMap<string, number>
  units: ReadonlyMap<string, number>
}

/**
 * Фасетні лічильники: проєкти враховують вибрані підрозділи, а підрозділи —
 * вибрані проєкти. Власний вимір не враховується, щоб можна було додати ще
 * одну опцію до поточного вибору.
 */
export function computeIssuanceCrossCounts(
  rows: readonly IssuanceRow[],
  filters: Pick<
    IssuanceFilters,
    "from" | "to" | "nameQuery" | "projects" | "units"
  >
): IssuanceCrossCounts {
  const { from, to } = clampIncomeRange(filters.from, filters.to)
  const fromMs = from.getTime()
  const toMs = to.getTime()
  const projectPicks = new Set<string>(filters.projects)
  const unitPicks = new Set<string>(filters.units)
  const projectsNarrowed =
    projectPicks.size > 0 && projectPicks.size < ISSUANCE_PROJECT_OPTIONS.length
  const unitsNarrowed =
    unitPicks.size > 0 && unitPicks.size < ISSUANCE_UNITS.length

  const projects = new Map<string, number>()
  const units = new Map<string, number>()

  for (const row of rows) {
    const ms = parseIssuanceDate(row.date).getTime()
    if (ms < fromMs || ms > toMs) continue
    if (!matchesNameQuery(row.productName, filters.nameQuery)) continue

    const project = toIssuanceProjectLine(row.project)
    if (project && (!unitsNarrowed || unitPicks.has(row.unit))) {
      projects.set(project, (projects.get(project) ?? 0) + 1)
    }
    if (project && (!projectsNarrowed || projectPicks.has(project))) {
      units.set(row.unit, (units.get(row.unit) ?? 0) + 1)
    }
  }

  return { projects, units }
}

function countIssuanceRowsByValue(
  rows: readonly IssuanceRow[],
  getValue: (row: IssuanceRow) => string | null
): Map<string, number> {
  const counts = new Map<string, number>()

  for (const row of rows) {
    const value = getValue(row)
    if (!value) continue
    counts.set(value, (counts.get(value) ?? 0) + 1)
  }

  return counts
}

/** `rows` — це вже відфільтрований результат, тож чіпс показує свою частку того, що видно в таблиці. */
export function buildIssuanceFilterChips(
  filters: IssuanceFilters,
  rows: readonly IssuanceRow[]
): IssuanceFilterChip[] {
  const chips: IssuanceFilterChip[] = []

  const name = filters.nameQuery.trim()
  if (name) {
    chips.push({
      id: "name",
      label: `«${name}»`,
      count: rows.length,
      type: "name",
    })
  }

  if (
    filters.projects.length > 0 &&
    filters.projects.length < ISSUANCE_PROJECT_OPTIONS.length
  ) {
    const counts = countIssuanceRowsByValue(rows, (row) =>
      toIssuanceProjectLine(row.project)
    )
    for (const project of filters.projects) {
      chips.push({
        id: `project:${project}`,
        label: project,
        count: counts.get(project) ?? 0,
        type: "project",
      })
    }
  }

  if (filters.fundraisings.length < FUNDRAISINGS.length) {
    const counts = countIssuanceRowsByValue(rows, (row) => row.fundraising)
    for (const fundraising of filters.fundraisings) {
      chips.push({
        id: `fundraising:${fundraising}`,
        label: fundraising,
        count: counts.get(fundraising) ?? 0,
        type: "fundraising",
      })
    }
  }

  if (
    filters.units.length > 0 &&
    filters.units.length < ISSUANCE_UNITS.length
  ) {
    const counts = countIssuanceRowsByValue(rows, (row) => row.unit)
    for (const unit of filters.units) {
      chips.push({
        id: `unit:${unit}`,
        label: unit,
        count: counts.get(unit) ?? 0,
        type: "unit",
      })
    }
  }

  if (filters.categories.length < ISSUANCE_PROPERTY_CATEGORIES.length) {
    const counts = countIssuanceRowsByValue(rows, (row) => row.category)
    for (const category of filters.categories) {
      chips.push({
        id: `category:${category}`,
        label: category,
        count: counts.get(category) ?? 0,
        type: "category",
      })
    }
  }

  return chips
}

export function removeIssuanceFilterChip(
  filters: IssuanceFilters,
  chip: IssuanceFilterChip
): IssuanceFilters {
  if (chip.type === "name") {
    return { ...filters, nameQuery: "" }
  }

  if (chip.type === "project") {
    const next = filters.projects.filter((item) => item !== chip.label)
    return {
      ...filters,
      projects: next,
    }
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
      units: next,
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

export type IssuanceRequestBreakdownItem = {
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

/**
 * Кількість закритих запитів (рядків видачі) за лінійками проєктів — тим самим
 * словником, що в чипсах фільтрів і колонці «Проєкт».
 */
export function summarizeClosedRequestsByProject(
  rows: IssuanceRow[]
): IssuanceRequestBreakdownItem[] {
  if (rows.length === 0) return []

  const counts = new Map<IssuanceProjectLine, number>()
  const amounts = new Map<IssuanceProjectLine, number>()
  for (const project of ISSUANCE_PROJECT_LINES) {
    counts.set(project, 0)
    amounts.set(project, 0)
  }
  for (const row of rows) {
    const project = toIssuanceProjectLine(row.project)
    if (!project) continue
    counts.set(project, (counts.get(project) ?? 0) + 1)
    amounts.set(project, (amounts.get(project) ?? 0) + row.total)
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
    const top = items.reduce((best, item) =>
      item.count > best.count ? item : best
    )
    top.share += 100 - shareTotal
  }

  return [...items]
    .filter((item) => item.count > 0)
    .sort((left, right) => {
      if (left.count !== right.count) return right.count - left.count
      return left.project.localeCompare(right.project, "uk")
    })
}

export function computeIssuanceFilterAvailability(
  rows: readonly IssuanceRow[],
  period: { from: Date; to: Date }
) {
  return computeFilterAvailability({
    rows,
    period,
    getRowDate: (row) => parseIssuanceDate(row.date),
    getProject: (row) => row.project,
    getFundraiser: (row) => row.fundraising,
    allProjects: ISSUANCE_PROJECT_LINES,
    allFundraisers: FUNDRAISINGS,
  })
}
