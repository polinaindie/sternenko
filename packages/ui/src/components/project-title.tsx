import * as React from "react"

import { cn } from "@workspace/ui/lib/utils"

// Project / product name lockup in a thick bordered box, optionally preceded by
// an icon slot — e.g. «ШАХЕДОРІЗ», «НЕБЕСНИЙ РУСОРІЗ». Border uses currentColor
// so it inherits the surrounding report-card foreground.
function ProjectTitle({
  className,
  icon,
  children,
  ...props
}: React.ComponentProps<"div"> & { icon?: React.ReactNode }) {
  return (
    <div
      data-slot="project-title"
      className={cn(
        "inline-flex items-center gap-3 rounded-[var(--radius-report)] border-2 border-current px-4 py-3",
        className
      )}
      {...props}
    >
      {icon ? (
        <span
          data-slot="project-title-icon"
          className="flex size-9 shrink-0 items-center justify-center [&>svg]:size-full"
        >
          {icon}
        </span>
      ) : null}
      <span className="[font-family:var(--font-display-dark)] text-2xl leading-[0.9] tracking-[-0.02em] uppercase md:text-3xl">
        {children}
      </span>
    </div>
  )
}

export { ProjectTitle }
