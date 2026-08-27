/** Прочерк у комірці, коли значення немає. */
export const EMPTY_TABLE_VALUE = "-"

const EMPTY_MARKERS = new Set(["", "-", "—", "–"])

export function isEmptyTableValue(
  value: string | number | null | undefined
): boolean {
  if (value == null) return true
  if (typeof value === "number") return Number.isNaN(value)
  return EMPTY_MARKERS.has(value.trim())
}

export function formatTableCellValue(
  value: string | number | null | undefined
): string {
  if (typeof value === "number") {
    return Number.isNaN(value) ? EMPTY_TABLE_VALUE : String(value)
  }
  if (isEmptyTableValue(value)) return EMPTY_TABLE_VALUE
  return value!.trim()
}
