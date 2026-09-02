import { useMemo } from "react"

import {
  summarizeClosedRequestsByProject,
  summarizeIssuanceKpis,
} from "../lib/issuance-analytics"
import type { IssuanceRow } from "../mock-data"
import { IssuanceSnapshotBlock } from "./IssuanceSnapshotBlock"

type IssuanceSnapshotSectionProps = {
  /** Рядки таблиці після застосованих фільтрів. */
  rows: IssuanceRow[]
  /** Конкретне пояснення замість порожньої діаграми. */
  emptyMessage: string
  onResetFilters?: () => void
  isLoading?: boolean
  /** Render KPI column + chart as grid siblings (no outer wrapper). */
  bare?: boolean
  className?: string
}

export function IssuanceSnapshotSection({
  rows,
  emptyMessage,
  onResetFilters,
  isLoading = false,
  bare = false,
  className,
}: IssuanceSnapshotSectionProps) {
  const kpis = useMemo(() => summarizeIssuanceKpis(rows), [rows])

  const requestBreakdown = useMemo(
    () => summarizeClosedRequestsByProject(rows),
    [rows]
  )

  return (
    <IssuanceSnapshotBlock
      bare={bare}
      className={className}
      totalPurchaseAmountUah={kpis.totalPurchaseAmountUah}
      closedRequestsCount={kpis.closedRequestsCount}
      lossesUsd={kpis.lossesUsd}
      breakdown={requestBreakdown}
      emptyMessage={emptyMessage}
      onResetFilters={onResetFilters}
      isLoading={isLoading}
    />
  )
}
