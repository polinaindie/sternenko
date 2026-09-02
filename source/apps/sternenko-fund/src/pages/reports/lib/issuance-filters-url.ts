import { ISSUANCE_PROJECT_OPTIONS, ISSUANCE_UNITS } from "../mock-data"
import {
  createDefaultIssuanceFilters,
  isDefaultIssuancePeriod,
  type IssuanceFilters,
} from "./issuance-analytics"

export type ParsedIssuanceFilters = {
  filters: IssuanceFilters
  /** Значення з адреси, яких немає в даних, — про них повідомляємо вголос. */
  dropped: string[]
}

function toIsoDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${date.getFullYear()}-${month}-${day}`
}

function parseIsoDate(value: string, endOfDay: boolean): Date | null {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) return null

  const [, year, month, day] = match
  const date = endOfDay
    ? new Date(Number(year), Number(month) - 1, Number(day), 23, 59, 59, 999)
    : new Date(Number(year), Number(month) - 1, Number(day))

  if (
    date.getFullYear() !== Number(year) ||
    date.getMonth() !== Number(month) - 1 ||
    date.getDate() !== Number(day)
  ) {
    return null
  }

  return date
}

export function parseIssuanceFiltersFromQuery(
  search: string
): ParsedIssuanceFilters {
  const defaults = createDefaultIssuanceFilters()
  const params = new URLSearchParams(search)
  const dropped: string[] = []

  const requestedProjects = [
    ...params.getAll("project"),
    ...params.getAll("projects"),
  ]
  const requestedUnits = [...params.getAll("unit"), ...params.getAll("units")]

  const projects = requestedProjects.filter((value) =>
    (ISSUANCE_PROJECT_OPTIONS as readonly string[]).includes(value)
  ) as IssuanceFilters["projects"]
  const units = requestedUnits.filter((value) =>
    (ISSUANCE_UNITS as readonly string[]).includes(value)
  )

  dropped.push(
    ...requestedProjects.filter(
      (value) =>
        !(ISSUANCE_PROJECT_OPTIONS as readonly string[]).includes(value)
    ),
    ...requestedUnits.filter(
      (value) => !(ISSUANCE_UNITS as readonly string[]).includes(value)
    )
  )

  const rawFrom = params.get("from")
  const rawTo = params.get("to")
  const from = rawFrom ? parseIsoDate(rawFrom, false) : null
  const to = rawTo ? parseIsoDate(rawTo, true) : null
  if (rawFrom && !from) dropped.push(rawFrom)
  if (rawTo && !to) dropped.push(rawTo)

  return {
    filters: {
      ...defaults,
      nameQuery: params.get("q")?.trim() ?? defaults.nameQuery,
      from: from ?? defaults.from,
      to: to ?? defaults.to,
      projects: requestedProjects.length > 0 ? projects : defaults.projects,
      units: requestedUnits.length > 0 ? units : defaults.units,
    },
    dropped,
  }
}

/** Лише те, що відрізняється від типового стану, — щоб адреса лишалась читною. */
export function buildIssuanceFiltersQuery(filters: IssuanceFilters): string {
  const params = new URLSearchParams()

  const nameQuery = filters.nameQuery.trim()
  if (nameQuery) params.set("q", nameQuery)

  if (!isDefaultIssuancePeriod(filters.from, filters.to)) {
    params.set("from", toIsoDate(filters.from))
    params.set("to", toIsoDate(filters.to))
  }

  if (
    filters.projects.length > 0 &&
    filters.projects.length < ISSUANCE_PROJECT_OPTIONS.length
  ) {
    for (const project of filters.projects) params.append("project", project)
  }

  if (filters.units.length > 0 && filters.units.length < ISSUANCE_UNITS.length) {
    for (const unit of filters.units) params.append("unit", unit)
  }

  return params.toString()
}
