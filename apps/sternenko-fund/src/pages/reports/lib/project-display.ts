import {
  FUNDRAISING_TO_PROJECT,
  FUNDRAISINGS,
  type IssuanceProjectLine,
} from "../mock-data"
import { isIssuanceProjectLine } from "./project-colors"

/** Канонічні назви 5 лінійок проєктів — однакові в таблицях, тегах і діаграмах. */
export function getProjectLineDisplayName(project: IssuanceProjectLine): string {
  return project
}

export function resolveProjectLine(name: string): IssuanceProjectLine | null {
  if (isIssuanceProjectLine(name)) return name
  if ((FUNDRAISINGS as readonly string[]).includes(name)) {
    return FUNDRAISING_TO_PROJECT[name as (typeof FUNDRAISINGS)[number]]
  }
  return null
}

/** Збір або лінійка → уніфікована назва проєкту для UI. */
export function getProjectDisplayName(name: string): string {
  if (name === "—") return name
  const project = resolveProjectLine(name)
  return project ? getProjectLineDisplayName(project) : name
}
