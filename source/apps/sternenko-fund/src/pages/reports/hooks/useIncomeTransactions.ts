import { useEffect, useState } from "react"

import {
  loadIncomeTransactions,
  type IncomeTransaction,
} from "../data/income-transactions"

type UseIncomeTransactionsResult = {
  rows: IncomeTransaction[]
  loading: boolean
  error: string | null
}

export function useIncomeTransactions(): UseIncomeTransactionsResult {
  const [rows, setRows] = useState<IncomeTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    loadIncomeTransactions()
      .then((data) => {
        if (!cancelled) {
          setRows(data)
          setError(null)
        }
      })
      .catch((cause: unknown) => {
        if (!cancelled) {
          setRows([])
          setError(
            cause instanceof Error
              ? cause.message
              : "Не вдалося завантажити надходження"
          )
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { rows, loading, error }
}
