import { clampIncomeRange } from "./income-analytics"

export type DatePeriod = { from: Date; to: Date }

export type FilterAvailability = {
  activeProjects: ReadonlySet<string>
  activeFundraisers: ReadonlySet<string>
}

type ComputeFilterAvailabilityArgs<TRow> = {
  rows: readonly TRow[]
  period: DatePeriod
  getRowDate: (row: TRow) => Date
  getProject: (row: TRow) => string | null
  getFundraiser: (row: TRow) => string | null
  allProjects: readonly string[]
  allFundraisers: readonly string[]
}

export function computeFilterAvailability<TRow>({
  rows,
  period,
  getRowDate,
  getProject,
  getFundraiser,
  allProjects,
  allFundraisers,
}: ComputeFilterAvailabilityArgs<TRow>): FilterAvailability {
  const { from, to } = clampIncomeRange(period.from, period.to)
  const fromMs = from.getTime()
  const toMs = to.getTime()

  const activeProjects = new Set<string>()
  const activeFundraisers = new Set<string>()

  for (const row of rows) {
    const atMs = getRowDate(row).getTime()
    if (atMs < fromMs || atMs > toMs) continue

    const project = getProject(row)
    if (project && (allProjects as readonly string[]).includes(project)) {
      activeProjects.add(project)
    }

    const fundraiser = getFundraiser(row)
    if (fundraiser && (allFundraisers as readonly string[]).includes(fundraiser)) {
      activeFundraisers.add(fundraiser)
    }
  }

  return { activeProjects, activeFundraisers }
}

export function inactiveOptions(
  options: readonly string[],
  active: ReadonlySet<string>
): string[] {
  return options.filter((option) => !active.has(option))
}

/** Drop inactive picks from partial selections; full selection stays «усі». */
export function pruneFilterSelectionsForAvailability(
  selected: string[],
  allOptions: readonly string[],
  active: ReadonlySet<string>
): string[] {
  if (selected.length === allOptions.length) return [...allOptions]

  const pruned = selected.filter((item) => active.has(item))
  return pruned.length === 0 ? [...allOptions] : pruned
}

export function pruneProjectFundraiserFilters<
  T extends { projects: string[]; fundraisings: string[] },
>(
  filters: T,
  allProjects: readonly string[],
  allFundraisers: readonly string[],
  availability: FilterAvailability
): T {
  return {
    ...filters,
    projects: pruneFilterSelectionsForAvailability(
      filters.projects,
      allProjects,
      availability.activeProjects
    ),
    fundraisings: pruneFilterSelectionsForAvailability(
      filters.fundraisings,
      allFundraisers,
      availability.activeFundraisers
    ),
  }
}
