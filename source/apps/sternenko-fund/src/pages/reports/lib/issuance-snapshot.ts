import { formatIncomeDateTime } from "./income-analytics"
import { ISSUANCE_SNAPSHOT, type IssuanceSnapshot } from "../mock-data"

/** Знімок KPI закупівель — не залежить від періоду на сторінці. */
export function getIssuanceSnapshot(): IssuanceSnapshot {
  return ISSUANCE_SNAPSHOT
}

export function formatIssuanceSnapshotUpdatedAt(updatedAt: string): string {
  return formatIncomeDateTime(updatedAt)
}
