import * as React from "react"

import { cn } from "@workspace/ui/lib/utils"

// The recurring report period marker ("ЗВІТУЄМО ЗА ТРАВЕНЬ 2026") shown in a
// report corner. Heavy display caps, stacked tight.
function ReportDateStamp({
  className,
  label = "Звітуємо за",
  period,
  ...props
}: React.ComponentProps<"div"> & { label?: string; period: string }) {
  return (
    <div
      data-slot="report-date-stamp"
      className={cn(
        "[font-family:var(--font-display-black)] text-sm leading-[0.9] tracking-[-0.02em] uppercase md:text-base",
        className
      )}
      {...props}
    >
      <span className="block">{label}</span>
      <span className="block">{period}</span>
    </div>
  )
}

export { ReportDateStamp }
