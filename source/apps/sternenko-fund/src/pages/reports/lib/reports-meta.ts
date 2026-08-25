import { formatIncomeDateTime } from "./income-analytics"
import { REPORTS_DATA_UPDATED_AT } from "../mock-data"

export function formatReportsDataUpdatedAt(): string {
  return formatIncomeDateTime(REPORTS_DATA_UPDATED_AT)
}
