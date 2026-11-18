export type OptionSortKey = "name" | "count"
export type OptionSortDirection = "asc" | "desc"

export type OptionListSort = {
  key: OptionSortKey
  direction: OptionSortDirection
}

/** Як у таблиці: перший клік — зростання, другий — спадання, третій скидає. */
export function cycleOptionSort(
  key: OptionSortKey,
  current: OptionListSort | null
): OptionListSort | null {
  if (current?.key !== key) return { key, direction: "asc" }
  if (current.direction === "asc") return { key, direction: "desc" }
  return null
}

export function sortFilterOptions(
  options: readonly string[],
  sort: OptionListSort,
  counts?: ReadonlyMap<string, number>
): string[] {
  const direction = sort.direction === "asc" ? 1 : -1

  return [...options].sort((a, b) => {
    if (sort.key === "count") {
      const delta = (counts?.get(a) ?? 0) - (counts?.get(b) ?? 0)
      if (delta !== 0) return delta * direction
    }

    return a.localeCompare(b, "uk", { sensitivity: "base" }) * direction
  })
}

/** Підпис — це наступна дія, як у кнопки сортування стовпця таблиці. */
export function optionSortActionLabel(
  key: OptionSortKey,
  direction: OptionSortDirection | null
): string {
  if (key === "name") {
    if (direction === null) return "Сортувати від А до Я"
    if (direction === "asc") return "Сортувати від Я до А"
    return "Скинути сортування за назвою"
  }

  if (direction === null) return "Сортувати від найменшого до найбільшого"
  if (direction === "asc") return "Сортувати від найбільшого до найменшого"
  return "Скинути сортування за кількістю"
}
