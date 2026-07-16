import { ChevronDownIcon } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover"
import { cn } from "@workspace/ui/lib/utils"

import {
  FUNDRAISER_UNAVAILABLE_TOOLTIP,
  isFilterSelectionActive,
  MultiSelectFilterPanel,
  PROJECT_UNAVAILABLE_TOOLTIP,
  selectionLabel,
} from "./MultiSelectFilter"
import {
  filterPopoverContentClass,
  siteFilterTriggerActiveClass,
  siteFilterTriggerClass,
  useFilterControlId,
} from "./report-ui"

type ProjectFundraiserFilterProps = {
  projectOptions: readonly string[]
  projects: string[]
  onProjectsChange: (projects: string[]) => void
  disabledProjects?: readonly string[]
  fundraisingOptions: readonly string[]
  fundraisings: string[]
  onFundraisingsChange: (fundraisings: string[]) => void
  disabledFundraisings?: readonly string[]
  className?: string
  id?: string
}

function combinedSelectionLabel(
  projectOptions: readonly string[],
  projects: string[],
  fundraisingOptions: readonly string[],
  fundraisings: string[]
): string {
  const projectsLabel = selectionLabel(projectOptions, projects, "Усі проєкти")
  const fundraisingsLabel = selectionLabel(
    fundraisingOptions,
    fundraisings,
    "Усі збори"
  )

  const projectsAll = projectsLabel === "Усі проєкти"
  const fundraisingsAll = fundraisingsLabel === "Усі збори"

  if (projectsAll && fundraisingsAll) return "Усі"
  if (projectsAll) return fundraisingsLabel
  if (fundraisingsAll) return projectsLabel
  return `${projectsLabel} · ${fundraisingsLabel}`
}

function FilterSectionTitle({ children }: { children: string }) {
  return (
    <p className="[font-family:var(--font-subheading-dark)] px-2 text-xs tracking-wide uppercase">
      {children}
    </p>
  )
}

export function ProjectFundraiserFilter({
  projectOptions,
  projects,
  onProjectsChange,
  disabledProjects = [],
  fundraisingOptions,
  fundraisings,
  onFundraisingsChange,
  disabledFundraisings = [],
  className,
  id,
}: ProjectFundraiserFilterProps) {
  const controlId = useFilterControlId(id)
  const isActive =
    isFilterSelectionActive(projectOptions, projects) ||
    isFilterSelectionActive(fundraisingOptions, fundraisings)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id={controlId}
          type="button"
          variant="outline"
          className={cn(
            siteFilterTriggerClass,
            "justify-between",
            isActive && siteFilterTriggerActiveClass,
            className
          )}
        >
          <span className="truncate">
            {combinedSelectionLabel(
              projectOptions,
              projects,
              fundraisingOptions,
              fundraisings
            )}
          </span>
          <ChevronDownIcon className="size-4 shrink-0 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={filterPopoverContentClass} align="start">
        <div className="flex max-h-[min(24rem,var(--radix-popover-content-available-height))] flex-col gap-3 overflow-y-auto">
          <div className="flex flex-col gap-1.5">
            <FilterSectionTitle>Проєкт</FilterSectionTitle>
            <MultiSelectFilterPanel
              options={projectOptions}
              selected={projects}
              onChange={onProjectsChange}
              disabledOptions={disabledProjects}
              disabledOptionTooltip={PROJECT_UNAVAILABLE_TOOLTIP}
              placeholder="Усі проєкти"
              showSelectAllDivider={false}
            />
          </div>
          <div className="bg-border h-px shrink-0" />
          <div className="flex flex-col gap-1.5">
            <FilterSectionTitle>Збір</FilterSectionTitle>
            <MultiSelectFilterPanel
              options={fundraisingOptions}
              selected={fundraisings}
              onChange={onFundraisingsChange}
              disabledOptions={disabledFundraisings}
              disabledOptionTooltip={FUNDRAISER_UNAVAILABLE_TOOLTIP}
              placeholder="Усі збори"
              showSelectAllDivider={false}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
