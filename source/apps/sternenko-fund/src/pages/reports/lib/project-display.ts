import {
  toIssuanceProjectLine,
  type IssuanceProjectLine,
} from "../mock-data"

import { EMPTY_TABLE_VALUE, isEmptyTableValue } from "./empty-table-value"

/** Канонічні назви 5 лінійок проєктів — однакові в таблицях, тегах і діаграмах. */
export function getProjectLineDisplayName(project: IssuanceProjectLine): string {
  return project
}

export function resolveProjectLine(name: string): IssuanceProjectLine | null {
  return toIssuanceProjectLine(name)
}

/** Збір або лінійка → уніфікована назва проєкту для UI. */
export function getProjectDisplayName(name: string): string {
  if (isEmptyTableValue(name)) return EMPTY_TABLE_VALUE
  const project = resolveProjectLine(name)
  return project ? getProjectLineDisplayName(project) : name
}
