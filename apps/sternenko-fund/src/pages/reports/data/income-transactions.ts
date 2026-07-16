import { INCOME_SOURCES } from "../mock-data"
import { expandIncomeTransactionsForDemo } from "./expand-income-demo"

export type IncomeSource = (typeof INCOME_SOURCES)[number]

export type IncomeCurrency = "UAH" | "USD" | "EUR" | "PLN"

export type IncomeTransaction = {
  id: string
  /** ISO 8601 */
  at: string
  source: IncomeSource
  amountUah: number
  amount: number
  currency: IncomeCurrency
  fundraising: string
  counterparty: string
  comment: string
}

export type IncomeTransactionsMeta = {
  start: string
  end: string
  importedAt: string
  rowCount: number
}

type IncomeTransactionsPayload = {
  meta: IncomeTransactionsMeta
  rows: IncomeTransaction[]
}

export const INCOME_REPORTING_START = new Date(2026, 5, 6)
export const INCOME_REPORTING_END = new Date(2026, 6, 6, 23, 59, 59, 999)

let cachedTransactions: Promise<IncomeTransaction[]> | null = null
let cachedMeta: IncomeTransactionsMeta | null = null

function incomeDataUrl(): string {
  const base = import.meta.env.BASE_URL ?? "/"
  return `${base}data/income-transactions.json`
}

export function getIncomeTransactionsMeta(): IncomeTransactionsMeta | null {
  return cachedMeta
}

export function getIncomeReportingStart(): Date {
  if (cachedMeta?.start) {
    const [year, month, day] = cachedMeta.start.split("-").map(Number)
    return new Date(year!, month! - 1, day!)
  }
  return INCOME_REPORTING_START
}

export function getIncomeReportingEnd(): Date {
  if (cachedMeta?.end) {
    const [year, month, day] = cachedMeta.end.split("-").map(Number)
    return new Date(year!, month! - 1, day!, 23, 59, 59, 999)
  }
  return INCOME_REPORTING_END
}

export async function loadIncomeTransactions(): Promise<IncomeTransaction[]> {
  if (!cachedTransactions) {
    cachedTransactions = fetch(incomeDataUrl())
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Не вдалося завантажити надходження (${response.status})`)
        }
        const payload = (await response.json()) as IncomeTransactionsPayload
        const expanded = expandIncomeTransactionsForDemo(payload.rows, payload.meta)
        cachedMeta = expanded.meta
        return expanded.rows
      })
      .catch((error) => {
        cachedTransactions = null
        throw error
      })
  }

  return cachedTransactions
}
