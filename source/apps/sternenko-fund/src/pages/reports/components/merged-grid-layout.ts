export type GridPlacement = {
  id: string
  row: number
  col: number
  rowSpan?: number
  colSpan?: number
}

type Corner = "tl" | "tr" | "bl" | "br"

function occupies(
  placement: GridPlacement,
  row: number,
  col: number
): boolean {
  const rowSpan = placement.rowSpan ?? 1
  const colSpan = placement.colSpan ?? 1
  return (
    row >= placement.row &&
    row < placement.row + rowSpan &&
    col >= placement.col &&
    col < placement.col + colSpan
  )
}

function hasCell(placements: GridPlacement[], row: number, col: number): boolean {
  if (row < 0 || col < 0) return false
  return placements.some((placement) => occupies(placement, row, col))
}

/** Заокруглює кут лише на хресті двох gutter-ліній (Nebesnyi / Rusoriz). */
export function junctionCorners(
  placement: GridPlacement,
  placements: GridPlacement[]
): Corner[] {
  const rowSpan = placement.rowSpan ?? 1
  const colSpan = placement.colSpan ?? 1
  const rowEnd = placement.row + rowSpan - 1
  const colEnd = placement.col + colSpan - 1

  const corners: Corner[] = []

  if (
    hasCell(placements, placement.row - 1, placement.col) &&
    hasCell(placements, placement.row, placement.col - 1)
  ) {
    corners.push("tl")
  }

  if (
    hasCell(placements, placement.row - 1, colEnd) &&
    hasCell(placements, placement.row, colEnd + 1)
  ) {
    corners.push("tr")
  }

  if (
    hasCell(placements, rowEnd + 1, placement.col) &&
    hasCell(placements, rowEnd, placement.col - 1)
  ) {
    corners.push("bl")
  }

  if (
    hasCell(placements, rowEnd + 1, colEnd) &&
    hasCell(placements, rowEnd, colEnd + 1)
  ) {
    corners.push("br")
  }

  return corners
}

/** Розклад KPI + hero для різних breakpoints. */
export const incomeMetricsLayouts = {
  mobile: [
    { id: "kpi1", row: 0, col: 0 },
    { id: "kpi2", row: 1, col: 0 },
    { id: "kpi3", row: 2, col: 0 },
    { id: "hero", row: 3, col: 0 },
  ],
  sm: [
    { id: "kpi1", row: 0, col: 0 },
    { id: "kpi2", row: 0, col: 1 },
    { id: "kpi3", row: 1, col: 0 },
    { id: "hero", row: 2, col: 0, colSpan: 2 },
  ],
  lg: [
    { id: "kpi1", row: 0, col: 0 },
    { id: "kpi2", row: 0, col: 1 },
    { id: "kpi3", row: 0, col: 2 },
    { id: "hero", row: 1, col: 0, colSpan: 3 },
  ],
} as const satisfies Record<string, GridPlacement[]>
