import { cn } from "@workspace/ui/lib/utils"

/** Візуальний стиль tooltip як у графіка «Джерела надходжень». */
export const reportChartTooltipContentClass = cn(
  "rounded-[var(--radius-report)] border-2 border-primary bg-foreground px-3 py-2 text-background shadow-none",
  "[&_.font-medium]:[font-family:var(--font-subheading-dark)] [&_.font-medium]:uppercase"
)

type ReportChartTooltipRow = {
  label: string
  value: string
}

type ReportChartTooltipBodyProps = {
  title: string
  rows: ReportChartTooltipRow[]
}

export function ReportChartTooltipBody({
  title,
  rows,
}: ReportChartTooltipBodyProps) {
  return (
    <div className="grid min-w-32 items-start gap-1.5">
      <div className="font-medium">{title}</div>
      <div className="grid gap-1.5">
        {rows.map((row) => (
          <div key={row.label} className="flex w-full items-center gap-2.5">
            <span className="flex-1">{row.label}</span>
            <span className="[font-family:var(--font-display-dark)] text-sm tabular-nums">
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
