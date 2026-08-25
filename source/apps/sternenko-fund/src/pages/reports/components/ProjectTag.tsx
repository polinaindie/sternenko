import { cn } from "@workspace/ui/lib/utils"

import type { IssuanceProjectLine } from "../mock-data"
import { getProjectSwatch } from "../lib/project-colors"

type ProjectTagProps = {
  name: IssuanceProjectLine
  className?: string
}

export function ProjectTag({ name, className }: ProjectTagProps) {
  const { bg, fg } = getProjectSwatch(name)

  return (
    <span
      className={cn(
        "inline-flex min-h-6 w-full max-w-full items-center justify-start rounded-[var(--radius-report-lg)] px-1.5 py-0.5 text-left text-[0.625rem] font-semibold uppercase leading-tight tracking-tight md:text-[0.6875rem]",
        "whitespace-normal break-words",
        className
      )}
      style={{ backgroundColor: bg, color: fg }}
    >
      {name}
    </span>
  )
}
