import { cn } from "@workspace/ui/lib/utils"

import type { IssuanceProjectLine } from "../mock-data"
import { getProjectTagClass } from "../lib/project-colors"

type ProjectTagProps = {
  name: IssuanceProjectLine
  className?: string
}

export function ProjectTag({ name, className }: ProjectTagProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-6 max-w-full items-center justify-center rounded-[var(--radius-report-lg)] px-1.5 py-0.5 text-center text-[0.625rem] font-semibold uppercase leading-tight tracking-tight md:text-[0.6875rem]",
        "whitespace-normal break-words",
        getProjectTagClass(name),
        className
      )}
    >
      {name}
    </span>
  )
}
