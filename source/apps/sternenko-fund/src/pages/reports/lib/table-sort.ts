export type SortDirection = "asc" | "desc"

export function cycleColumnSort<T extends string>(
  key: T,
  activeKey: T | null,
  activeDir: SortDirection,
  defaultDir: SortDirection = "desc"
): { activeKey: T | null; direction: SortDirection } {
  if (activeKey !== key) {
    return { activeKey: key, direction: "asc" }
  }
  if (activeDir === "asc") {
    return { activeKey: key, direction: "desc" }
  }
  return { activeKey: null, direction: defaultDir }
}

export function resolveSortKey<T extends string>(
  activeKey: T | null,
  defaultKey: T
): T {
  return activeKey ?? defaultKey
}
