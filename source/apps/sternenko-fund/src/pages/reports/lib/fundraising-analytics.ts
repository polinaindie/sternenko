import {
  FUNDRAISING_REPORT_CONFIG,
  FUNDRAISING_RESULTS,
  type FundraisingBreakdownItem,
  type FundraisingReportConfig,
  type FundraisingResultRow,
} from "../mock-data"
import { clampIncomeRange } from "./income-analytics"

export type FundraisingSummary = {
  config: FundraisingReportConfig
  quantity: number
  lossesUsd: number
  breakdown?: FundraisingBreakdownItem[]
  planPercent?: number
  /** Чи були зрізи цього збору в обраному періоді. */
  hasData: boolean
}

const CONFIG_BY_FUNDRAISING = new Map(
  FUNDRAISING_REPORT_CONFIG.map((config) => [config.fundraising, config])
)

function parseResultDate(date: string): Date {
  const [year, month, day] = date.split("-").map(Number)
  return new Date(year!, (month ?? 1) - 1, day ?? 1)
}

export function filterFundraisingResults(
  rows: FundraisingResultRow[],
  range: { from: Date; to: Date }
): FundraisingResultRow[] {
  const { from, to } = clampIncomeRange(range.from, range.to)
  const fromMs = from.getTime()
  const toMs = to.getTime()
  return rows.filter((row) => {
    const ms = parseResultDate(row.date).getTime()
    return ms >= fromMs && ms <= toMs
  })
}

function mergeBreakdown(
  rows: FundraisingResultRow[]
): FundraisingBreakdownItem[] | undefined {
  const byLabel = new Map<string, FundraisingBreakdownItem>()
  for (const row of rows) {
    if (!row.breakdown) continue
    for (const item of row.breakdown) {
      const existing = byLabel.get(item.label)
      if (existing) {
        existing.count += item.count
        existing.amountUah += item.amountUah
      } else {
        byLabel.set(item.label, { ...item })
      }
    }
  }
  return byLabel.size > 0 ? [...byLabel.values()] : undefined
}

/** Знімок плану = останнє значення planPercent у періоді (за датою). */
function latestPlanPercent(rows: FundraisingResultRow[]): number | undefined {
  let latest: { date: string; value: number } | undefined
  for (const row of rows) {
    if (row.planPercent == null) continue
    if (!latest || row.date > latest.date) {
      latest = { date: row.date, value: row.planPercent }
    }
  }
  return latest?.value
}

/**
 * Один запис на КОЖЕН збір з FUNDRAISING_REPORT_CONFIG (усі 14), у тому самому
 * порядку. Збори без зрізів у періоді повертаються з нулями (hasData: false),
 * щоб блок завжди рендерився.
 */
export function summarizeByFundraising(range: {
  from: Date
  to: Date
}): FundraisingSummary[] {
  const inRange = filterFundraisingResults(FUNDRAISING_RESULTS, range)

  const rowsByFundraising = new Map<string, FundraisingResultRow[]>()
  for (const row of inRange) {
    const list = rowsByFundraising.get(row.fundraising)
    if (list) list.push(row)
    else rowsByFundraising.set(row.fundraising, [row])
  }

  return FUNDRAISING_REPORT_CONFIG.map((config) => {
    const rows = rowsByFundraising.get(config.fundraising) ?? []
    const quantity = rows.reduce((sum, row) => sum + row.quantity, 0)
    const lossesUsd = rows.reduce((sum, row) => sum + row.lossesUsd, 0)

    return {
      config,
      quantity,
      lossesUsd,
      breakdown: config.showBreakdown ? mergeBreakdown(rows) : undefined,
      planPercent: config.showPlanPercent ? latestPlanPercent(rows) : undefined,
      hasData: rows.length > 0,
    }
  })
}

export function totalLossesUsd(summaries: FundraisingSummary[]): number {
  return summaries.reduce((sum, summary) => sum + summary.lossesUsd, 0)
}

export { CONFIG_BY_FUNDRAISING }
