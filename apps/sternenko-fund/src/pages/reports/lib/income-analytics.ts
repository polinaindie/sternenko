import {
  FUNDRAISINGS,
  FUNDRAISING_TO_PROJECT,
  INCOME_CHART_KEYS,
  INCOME_SOURCE_CHART_KEY,
  INCOME_SOURCES,
  ISSUANCE_PROJECT_LINES,
  type ChartGranularity,
  type IssuanceProjectLine,
} from "../mock-data"
import { formatReportNumber, UAH_SUFFIX } from "@workspace/ui/components/report-metric"
import type { IncomeSource, IncomeTransaction } from "../data/income-transactions"
import {
  INCOME_REPORTING_END,
  INCOME_REPORTING_START,
} from "../data/income-transactions"
import { computeFilterAvailability } from "./filter-availability"

/** Дефолтний діапазон суми в UI фільтрі (null,null = без обмежень). */
export const DEFAULT_INCOME_AMOUNT_MIN = 0
export const DEFAULT_INCOME_AMOUNT_MAX = 100_000

export type IncomeAmountPreset = {
  id: string
  label: string
  min: number | null
  max: number | null
}

export const INCOME_AMOUNT_PRESETS: readonly IncomeAmountPreset[] = [
  { id: "any", label: "Будь-яка сума", min: null, max: null },
  { id: "lt-1k", label: "Менше 1000", min: null, max: 999 },
  { id: "1k-5k", label: "Від 1000 до 5000", min: 1000, max: 5000 },
  { id: "5k-10k", label: "Від 5000 до 10 000", min: 5000, max: 10_000 },
  { id: "10k-50k", label: "Від 10 000 до 50 000", min: 10_000, max: 50_000 },
  { id: "50k-100k", label: "Від 50 000 до 100 000", min: 50_000, max: 100_000 },
  { id: "gt-100k", label: "Більше 100 000", min: 100_001, max: null },
] as const

export function findIncomeAmountPreset(
  value: { min: number | null; max: number | null },
  presets: readonly IncomeAmountPreset[] = INCOME_AMOUNT_PRESETS
): IncomeAmountPreset | undefined {
  return presets.find(
    (preset) => preset.min === value.min && preset.max === value.max
  )
}

export type IncomeFilters = {
  from: Date
  to: Date
  /** Усі значення = без фільтра за джерелом */
  sources: IncomeSource[]
  amountMin: number | null
  amountMax: number | null
  /** Усі значення = без фільтра за проєктом */
  projects: IssuanceProjectLine[]
  /** Усі значення = без фільтра за збором */
  fundraisings: string[]
}

export type IncomeSummary = {
  totalAmountUah: number
  averageDonationUah: number
  donationCount: number
}

export type IncomeChartRow = {
  period: string
  sortKey: string
} & Record<(typeof INCOME_CHART_KEYS)[number], number>

function createEmptyChartBucket(period: string, sortKey: string): IncomeChartRow {
  const bucket = { period, sortKey } as IncomeChartRow
  for (const key of INCOME_CHART_KEYS) {
    bucket[key] = 0
  }
  return bucket
}

const UK_DATE_TIME = new Intl.DateTimeFormat("uk-UA", {
  day: "2-digit",
  month: "2-digit",
  year: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
})

const UK_MONTH = new Intl.DateTimeFormat("uk-UA", {
  month: "2-digit",
  year: "2-digit",
})

const UK_DATE = new Intl.DateTimeFormat("uk-UA", {
  day: "2-digit",
  month: "2-digit",
  year: "2-digit",
})

const UK_TIME = new Intl.DateTimeFormat("uk-UA", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
})

function parseAt(at: string): Date {
  return new Date(at)
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function endOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999)
}

export function sameCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function clampIncomeRange(from: Date, to: Date): { from: Date; to: Date } {
  const start = startOfDay(from)
  const end = endOfDay(to)
  return start <= end ? { from: start, to: end } : { from: end, to: start }
}

export function clampReportingRange(
  from: Date,
  to: Date,
  reportingStart: Date,
  reportingEnd: Date
): { from: Date; to: Date } {
  const range = clampIncomeRange(from, to)
  const windowStart = startOfDay(reportingStart)
  const windowEnd = endOfDay(reportingEnd)
  return clampIncomeRange(
    new Date(Math.max(range.from.getTime(), windowStart.getTime())),
    new Date(Math.min(range.to.getTime(), windowEnd.getTime()))
  )
}

export function defaultIncomePeriod(): { from: Date; to: Date } {
  return clampIncomeRange(INCOME_REPORTING_START, INCOME_REPORTING_END)
}

export function resolveIncomeProject(
  row: IncomeTransaction
): IssuanceProjectLine | null {
  if (row.fundraising === "—") return "Поточний"
  if (!(row.fundraising in FUNDRAISING_TO_PROJECT)) return null
  return FUNDRAISING_TO_PROJECT[
    row.fundraising as keyof typeof FUNDRAISING_TO_PROJECT
  ]
}

export function createDefaultIncomeFilters(): IncomeFilters {
  const { from, to } = defaultIncomePeriod()
  return {
    from,
    to,
    sources: [...INCOME_SOURCES],
    amountMin: null,
    amountMax: null,
    projects: [...ISSUANCE_PROJECT_LINES],
    fundraisings: [...FUNDRAISINGS],
  }
}

export function isSameIncomePeriod(
  a: { from: Date; to: Date },
  b: { from: Date; to: Date }
): boolean {
  const left = clampIncomeRange(a.from, a.to)
  const right = clampIncomeRange(b.from, b.to)
  return (
    left.from.getTime() === right.from.getTime() &&
    left.to.getTime() === right.to.getTime()
  )
}

export function isDefaultIncomePeriod(from: Date, to: Date): boolean {
  return isSameIncomePeriod({ from, to }, defaultIncomePeriod())
}

/** Джерела для графіка/легенди: усі або лише обрані у фільтрі (у т.ч. без даних). */
export function resolveIncomeChartSources(
  selectedSources: readonly IncomeSource[]
): IncomeSource[] {
  if (
    selectedSources.length === 0 ||
    selectedSources.length >= INCOME_SOURCES.length
  ) {
    return [...INCOME_SOURCES]
  }

  const selected = new Set(selectedSources)
  return INCOME_SOURCES.filter((source) => selected.has(source))
}

export function hasActiveIncomeFilters(filters: IncomeFilters): boolean {
  if (filters.sources.length < INCOME_SOURCES.length) return true
  if (filters.amountMin != null || filters.amountMax != null) return true
  if (filters.projects.length < ISSUANCE_PROJECT_LINES.length) return true
  if (filters.fundraisings.length < FUNDRAISINGS.length) return true
  return false
}

export type IncomeFilterChip = {
  id: string
  label: string
  /** Скільки зі знайдених надходжень належить цьому значенню; сума чіпсів виміру дорівнює загальній кількості. */
  count: number
  type: "source" | "amount" | "project" | "fundraising"
}

function countIncomeRowsByValue(
  rows: readonly IncomeTransaction[],
  getValue: (row: IncomeTransaction) => string | null
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
export function buildIncomeFilterChips(
  filters: IncomeFilters,
  rows: readonly IncomeTransaction[]
): IncomeFilterChip[] {
  const chips: IncomeFilterChip[] = []

  if (filters.sources.length < INCOME_SOURCES.length) {
    const counts = countIncomeRowsByValue(rows, (row) => row.source)
    for (const source of filters.sources) {
      chips.push({
        id: `source:${source}`,
        label: source,
        count: counts.get(source) ?? 0,
        type: "source",
      })
    }
  }

  if (filters.amountMin != null || filters.amountMax != null) {
    const amountPreset = findIncomeAmountPreset({
      min: filters.amountMin,
      max: filters.amountMax,
    })

    if (amountPreset) {
      chips.push({
        id: "amount",
        label: amountPreset.label,
        count: rows.length,
        type: "amount",
      })
    } else {
      const { amountMin, amountMax } = filters
      if (amountMin != null && amountMax != null) {
        chips.push({
          id: "amount",
          label: `${formatReportNumber(amountMin)} – ${formatReportNumber(amountMax)}${UAH_SUFFIX}`,
          count: rows.length,
          type: "amount",
        })
      } else if (amountMin != null) {
        chips.push({
          id: "amount:min",
          label: `від ${formatReportNumber(amountMin)}${UAH_SUFFIX}`,
          count: rows.length,
          type: "amount",
        })
      } else if (amountMax != null) {
        chips.push({
          id: "amount:max",
          label: `до ${formatReportNumber(amountMax)}${UAH_SUFFIX}`,
          count: rows.length,
          type: "amount",
        })
      }
    }
  }

  if (filters.projects.length < ISSUANCE_PROJECT_LINES.length) {
    const counts = countIncomeRowsByValue(rows, (row) =>
      resolveIncomeProject(row)
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
    const counts = countIncomeRowsByValue(rows, (row) => row.fundraising)
    for (const fundraising of filters.fundraisings) {
      chips.push({
        id: `fundraising:${fundraising}`,
        label: fundraising,
        count: counts.get(fundraising) ?? 0,
        type: "fundraising",
      })
    }
  }

  return chips
}

export function removeIncomeFilterChip(
  filters: IncomeFilters,
  chip: IncomeFilterChip
): IncomeFilters {
  if (chip.type === "source") {
    const nextSources = filters.sources.filter((source) => source !== chip.label)
    return {
      ...filters,
      sources: nextSources.length === 0 ? [...INCOME_SOURCES] : nextSources,
    }
  }

  if (chip.type === "amount") {
    return { ...filters, amountMin: null, amountMax: null }
  }

  if (chip.type === "project") {
    const nextProjects = filters.projects.filter((project) => project !== chip.label)
    return {
      ...filters,
      projects:
        nextProjects.length === 0 ? [...ISSUANCE_PROJECT_LINES] : nextProjects,
    }
  }

  if (chip.type === "fundraising") {
    const nextFundraisings = filters.fundraisings.filter(
      (fundraising) => fundraising !== chip.label
    )
    return {
      ...filters,
      fundraisings:
        nextFundraisings.length === 0 ? [...FUNDRAISINGS] : nextFundraisings,
    }
  }

  return filters
}

export function filterIncomeTransactions(
  rows: IncomeTransaction[],
  filters: IncomeFilters
): IncomeTransaction[] {
  const { from, to } = clampIncomeRange(filters.from, filters.to)
  const fromMs = from.getTime()
  const toMs = to.getTime()

  return rows.filter((row) => {
    const atMs = parseAt(row.at).getTime()
    if (atMs < fromMs || atMs > toMs) return false
    if (
      filters.sources.length > 0 &&
      filters.sources.length < INCOME_SOURCES.length &&
      !filters.sources.includes(row.source)
    ) {
      return false
    }
    if (
      filters.projects.length > 0 &&
      filters.projects.length < ISSUANCE_PROJECT_LINES.length
    ) {
      const project = resolveIncomeProject(row)
      if (project && !filters.projects.includes(project)) return false
    }
    if (
      filters.fundraisings.length > 0 &&
      filters.fundraisings.length < FUNDRAISINGS.length &&
      !filters.fundraisings.includes(row.fundraising)
    ) {
      return false
    }
    if (filters.amountMin != null && row.amountUah < filters.amountMin) return false
    if (filters.amountMax != null && row.amountUah > filters.amountMax) return false
    return true
  })
}

export function summarizeIncome(rows: IncomeTransaction[]): IncomeSummary {
  if (rows.length === 0) {
    return { totalAmountUah: 0, averageDonationUah: 0, donationCount: 0 }
  }

  const totalAmountUah = rows.reduce((sum, row) => sum + row.amountUah, 0)
  return {
    totalAmountUah,
    averageDonationUah: Math.round(totalAmountUah / rows.length),
    donationCount: rows.length,
  }
}

const SPARKLINE_DAYS = 14

/** Попередній інтервал тієї самої тривалості, що й обраний період. */
export function previousIncomePeriod(range: {
  from: Date
  to: Date
}): { from: Date; to: Date } {
  const { from, to } = clampIncomeRange(range.from, range.to)
  const durationMs = to.getTime() - from.getTime()
  const prevTo = endOfDay(new Date(from.getTime() - MS_PER_DAY))
  const prevFrom = startOfDay(new Date(prevTo.getTime() - durationMs))
  return clampIncomeRange(prevFrom, prevTo)
}

export function computeTrendPercent(
  current: number,
  previous: number
): number | null {
  if (previous === 0) {
    return current > 0 ? 100 : null
  }
  return Math.round(((current - previous) / previous) * 100)
}

/** Добові суми надходжень за останні N днів періоду — для спарклайнів. */
export function buildDailyIncomeSparkline(
  rows: IncomeTransaction[],
  range: { from: Date; to: Date },
  days = SPARKLINE_DAYS
): number[] {
  const { from, to } = clampIncomeRange(range.from, range.to)
  const end = startOfDay(to)
  const start = startOfDay(new Date(end.getTime() - (days - 1) * MS_PER_DAY))
  const clampedStart = start < startOfDay(from) ? startOfDay(from) : start

  const byDay = new Map<string, number>()
  for (const row of rows) {
    const day = startOfDay(parseAt(row.at))
    if (day < clampedStart || day > end) continue
    const key = bucketKey(day, "day")
    byDay.set(key, (byDay.get(key) ?? 0) + row.amountUah)
  }

  const series: number[] = []
  for (
    let cursor = new Date(clampedStart);
    cursor <= end;
    cursor = new Date(cursor.getTime() + MS_PER_DAY)
  ) {
    series.push(byDay.get(bucketKey(cursor, "day")) ?? 0)
  }

  return series.length >= 2 ? series : []
}

/** Добова кількість донатів — для спарклайну KPI «кількість». */
export function buildDailyDonationCountSparkline(
  rows: IncomeTransaction[],
  range: { from: Date; to: Date },
  days = SPARKLINE_DAYS
): number[] {
  const { from, to } = clampIncomeRange(range.from, range.to)
  const end = startOfDay(to)
  const start = startOfDay(new Date(end.getTime() - (days - 1) * MS_PER_DAY))
  const clampedStart = start < startOfDay(from) ? startOfDay(from) : start

  const byDay = new Map<string, number>()
  for (const row of rows) {
    const day = startOfDay(parseAt(row.at))
    if (day < clampedStart || day > end) continue
    const key = bucketKey(day, "day")
    byDay.set(key, (byDay.get(key) ?? 0) + 1)
  }

  const series: number[] = []
  for (
    let cursor = new Date(clampedStart);
    cursor <= end;
    cursor = new Date(cursor.getTime() + MS_PER_DAY)
  ) {
    series.push(byDay.get(bucketKey(cursor, "day")) ?? 0)
  }

  return series.length >= 2 ? series : []
}

function startOfWeekMonday(date: Date): Date {
  const day = startOfDay(date)
  const weekday = day.getDay()
  const diff = weekday === 0 ? -6 : 1 - weekday
  day.setDate(day.getDate() + diff)
  return day
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function bucketKey(date: Date, granularity: ChartGranularity): string {
  if (granularity === "day") {
    const d = startOfDay(date)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
  }
  if (granularity === "week") {
    const d = startOfWeekMonday(date)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
  }
  const d = startOfMonth(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
}

function bucketLabel(key: string, granularity: ChartGranularity): string {
  const [year, month, day] = key.split("-").map(Number)
  const date = new Date(year!, month! - 1, day ?? 1)

  if (granularity === "day") {
    return formatReportDateShort(date)
  }
  if (granularity === "week") {
    const weekEnd = new Date(date)
    weekEnd.setDate(weekEnd.getDate() + 6)
    return `${formatReportDateShort(date)}–${formatReportDateShort(weekEnd)}`
  }
  return UK_MONTH.format(date)
}

export function formatReportDateShort(date: Date): string {
  const dd = String(date.getDate()).padStart(2, "0")
  const mm = String(date.getMonth() + 1).padStart(2, "0")
  const yy = String(date.getFullYear()).slice(-2)
  return `${dd}.${mm}.${yy}`
}

const MS_PER_DAY = 24 * 60 * 60 * 1000

/** Ширина стовпця та проміжок між категоріями (px) — тиждень/місяць ширші за день. */
export const CHART_BAR_WIDTH: Record<ChartGranularity, number> = {
  day: 20,
  week: 40,
  month: 80,
}

export const CHART_BAR_GAP: Record<ChartGranularity, number> = {
  day: 4,
  week: 6,
  month: 8,
}

/** Мінімальна товщина кольорової смуги в stacked bar (px) — щоб дрібні джерела лишались видимими. */
export const CHART_STACK_MIN_SEGMENT_PX = 6

/** @deprecated use chartBarWidth(granularity) */
export const CHART_MIN_BAR_WIDTH = CHART_BAR_WIDTH.day

export function chartBarWidth(granularity: ChartGranularity): number {
  return CHART_BAR_WIDTH[granularity]
}

export function chartCategoryWidth(granularity: ChartGranularity): number {
  return CHART_BAR_WIDTH[granularity] + CHART_BAR_GAP[granularity]
}

/**
 * Піднімає ненульові сегменти stacked bar до мінімальної висоти в px.
 * Реальні суми лишаються в оригінальному `data` — для tooltip.
 */
export function applyStackedBarMinSegmentDisplay(
  rows: IncomeChartRow[],
  yMax: number,
  plotHeightPx: number,
  minSegmentPx: number = CHART_STACK_MIN_SEGMENT_PX
): IncomeChartRow[] {
  if (rows.length === 0 || yMax <= 0 || plotHeightPx <= 0 || minSegmentPx <= 0) {
    return rows
  }

  const minValue = (minSegmentPx / plotHeightPx) * yMax

  return rows.map((row) => {
    const next = { ...row } as IncomeChartRow
    for (const key of INCOME_CHART_KEYS) {
      const actual = row[key] ?? 0
      next[key] = actual > 0 ? Math.max(actual, minValue) : 0
    }
    return next
  })
}

export type ChartBarLayout = {
  barWidth: number
  categoryWidth: number
  barGap: number
  /** Стовпці розтягнуті до viewport (барів менше, ніж вміщається на мін. ширині). */
  fillsViewport: boolean
}

/**
 * Розкладка стовпців відносно viewport:
 * - якщо bucketCount ≤ скільки вміщається на мін. ширині — розтягуємо до ширини графіка;
 * - інакше — мін. ширина стовпця, графік скролиться.
 */
export function chartBarLayout(
  granularity: ChartGranularity,
  bucketCount: number,
  viewportWidth: number,
  plotMarginX = 0
): ChartBarLayout {
  const baseBarWidth = CHART_BAR_WIDTH[granularity]
  const baseGap = CHART_BAR_GAP[granularity]
  const minCategoryWidth = baseBarWidth + baseGap
  const defaultLayout: ChartBarLayout = {
    barWidth: baseBarWidth,
    categoryWidth: minCategoryWidth,
    barGap: baseGap,
    fillsViewport: false,
  }

  if (bucketCount <= 0) return defaultLayout

  if (viewportWidth <= 0) {
    return { ...defaultLayout, fillsViewport: true }
  }

  const plotWidth = viewportWidth - plotMarginX
  const maxBucketsAtMinWidth = Math.floor(plotWidth / minCategoryWidth)

  if (bucketCount <= maxBucketsAtMinWidth) {
    const categoryWidth = plotWidth / bucketCount
    const barGap = Math.min(baseGap, Math.max(2, Math.round(categoryWidth * 0.08)))
    const barWidth = Math.max(baseBarWidth, categoryWidth - barGap)
    return {
      barWidth,
      categoryWidth,
      barGap,
      fillsViewport: true,
    }
  }

  return defaultLayout
}

/** @deprecated use chartBarLayout */
export function chartDayLayout(
  bucketCount: number,
  viewportWidth: number,
  plotMarginX = 0
): ChartBarLayout {
  return chartBarLayout("day", bucketCount, viewportWidth, plotMarginX)
}

/** За скільки днів граничного періоду «День» стає незручним і вмикає підказку. */
export const CHART_DAY_HINT_THRESHOLD = 45

/** Послідовність початків bucketів від from до to включно (без пропусків). */
function* iterateBucketStarts(
  from: Date,
  to: Date,
  granularity: ChartGranularity
): Generator<Date> {
  const { from: start, to: end } = clampIncomeRange(from, to)

  if (granularity === "day") {
    const cur = startOfDay(start)
    const last = startOfDay(end)
    while (cur <= last) {
      yield new Date(cur)
      cur.setDate(cur.getDate() + 1)
    }
    return
  }

  if (granularity === "week") {
    const cur = startOfWeekMonday(start)
    const last = startOfWeekMonday(end)
    while (cur <= last) {
      yield new Date(cur)
      cur.setDate(cur.getDate() + 7)
    }
    return
  }

  const cur = startOfMonth(start)
  const last = startOfMonth(end)
  while (cur <= last) {
    yield new Date(cur)
    cur.setMonth(cur.getMonth() + 1)
  }
}

/** Кількість стовпців графіка для діапазону за обраною гранулярністю. */
export function countChartBuckets(
  from: Date,
  to: Date,
  granularity: ChartGranularity
): number {
  let count = 0
  for (const _start of iterateBucketStarts(from, to, granularity)) count++
  return count
}

/** Кількість календарних днів у діапазоні (включно). */
function dayCount(from: Date, to: Date): number {
  const { from: start, to: end } = clampIncomeRange(from, to)
  return (
    Math.round(
      (startOfDay(end).getTime() - startOfDay(start).getTime()) / MS_PER_DAY
    ) + 1
  )
}

/**
 * М'яка рекомендація гранулярності за довжиною періоду: короткі діапазони —
 * по днях, середні — по тижнях, довгі (рік+) — по місяцях. Користувач може
 * перемкнути вручну.
 */
export function suggestChartGranularity(
  from: Date,
  to: Date
): ChartGranularity {
  const days = dayCount(from, to)
  if (days <= CHART_DAY_HINT_THRESHOLD) return "day"
  if (days <= 120) return "week"
  return "month"
}

/** Чи потрібен горизонтальний скрол, щоб усі стовпці лишались читабельними. */
export function chartNeedsHorizontalScroll(
  bucketCount: number,
  containerWidth: number,
  granularity: ChartGranularity = "day"
): boolean {
  return bucketCount * chartCategoryWidth(granularity) > containerWidth
}

export function buildIncomeChartData(
  rows: IncomeTransaction[],
  granularity: ChartGranularity,
  range?: { from: Date; to: Date }
): IncomeChartRow[] {
  const buckets = new Map<string, IncomeChartRow>()

  // Попередньо заповнюємо всю послідовність порожніми bucketами, щоб періоди
  // без надходжень теж відображались на осі X (інакше «провали» зникають).
  if (range) {
    for (const start of iterateBucketStarts(range.from, range.to, granularity)) {
      const key = bucketKey(start, granularity)
      buckets.set(key, createEmptyChartBucket(bucketLabel(key, granularity), key))
    }
  }

  for (const row of rows) {
    const key = bucketKey(parseAt(row.at), granularity)
    const existing = buckets.get(key) ?? createEmptyChartBucket(bucketLabel(key, granularity), key)
    const chartKey = INCOME_SOURCE_CHART_KEY[row.source as IncomeSource]
    if (!chartKey) continue
    existing[chartKey] += row.amountUah
    buckets.set(key, existing)
  }

  return [...buckets.values()].sort((a, b) => a.sortKey.localeCompare(b.sortKey))
}

export function formatIncomeDateTime(at: string): string {
  return UK_DATE_TIME.format(parseAt(at))
}

/** Дата й час окремо (без секунд) — для компактної таблиці на mobile/tablet. */
export function formatIncomeDateParts(at: string): { date: string; time: string } {
  const parsed = parseAt(at)
  return { date: UK_DATE.format(parsed), time: UK_TIME.format(parsed) }
}

export function formatIncomePeriod(from: Date, to: Date): string {
  return `${formatReportDateShort(from)} – ${formatReportDateShort(to)}`
}

export type PeriodPickerMode = "day" | "month" | "range" | "year"

export const REPORTING_YEARS = [2025, 2026] as const

function lastDayOfMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
}

export function inferPeriodMode(from: Date, to: Date): PeriodPickerMode {
  if (sameCalendarDay(from, to)) return "day"

  const sameYear = from.getFullYear() === to.getFullYear()
  if (
    sameYear &&
    from.getMonth() === 0 &&
    from.getDate() === 1 &&
    to.getMonth() === 11 &&
    to.getDate() === 31
  ) {
    return "year"
  }

  if (
    sameYear &&
    from.getMonth() === to.getMonth() &&
    from.getDate() === 1 &&
    to.getDate() === lastDayOfMonth(to)
  ) {
    return "month"
  }

  return "range"
}

export function formatPeriodLabel(from: Date, to: Date): string {
  const mode = inferPeriodMode(from, to)
  if (mode === "day") return formatReportDateShort(from)
  if (mode === "month") return formatIncomePeriod(from, to)
  if (mode === "year") return formatIncomePeriod(from, to)
  return formatIncomePeriod(from, to)
}

export function yearRange(year: number): { from: Date; to: Date } {
  return clampIncomeRange(new Date(year, 0, 1), new Date(year, 11, 31))
}

export function monthRange(year: number, monthIndex: number): { from: Date; to: Date } {
  return clampIncomeRange(
    new Date(year, monthIndex, 1),
    new Date(year, monthIndex + 1, 0)
  )
}

export function dayRange(date: Date): { from: Date; to: Date } {
  return clampIncomeRange(date, date)
}

export const MONTH_LABELS = [
  "Січ",
  "Лют",
  "Бер",
  "Кві",
  "Тра",
  "Чер",
  "Лип",
  "Сер",
  "Вер",
  "Жов",
  "Лис",
  "Гру",
] as const

export const INCOME_SOURCE_OPTIONS = ["all", ...INCOME_SOURCES] as const

export function computeIncomeFilterAvailability(
  rows: readonly IncomeTransaction[],
  period: { from: Date; to: Date }
) {
  return computeFilterAvailability({
    rows,
    period,
    getRowDate: (row) => parseAt(row.at),
    getProject: resolveIncomeProject,
    getFundraiser: (row) =>
      row.fundraising === "—" ? "Тотальний Русоріз" : row.fundraising,
    allProjects: ISSUANCE_PROJECT_LINES,
    allFundraisers: FUNDRAISINGS,
  })
}
