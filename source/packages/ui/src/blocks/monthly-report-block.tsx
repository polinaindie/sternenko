import * as React from "react"

import { CurrencyMetric, DisplayMetric } from "@workspace/ui/components/report-metric"
import { ProjectTitle } from "@workspace/ui/components/project-title"
import { ReportCard } from "@workspace/ui/components/report-card"
import { ReportDateStamp } from "@workspace/ui/components/report-date-stamp"
import { cn } from "@workspace/ui/lib/utils"

type SecondaryMetric = {
  value: number | string
  label: React.ReactNode
}

// Project colour combinations sampled from the report screenshots. Maps to
// `data-report-palette` (see tokens/palettes/sternenko-fund-report-palettes.css).
type ReportPalette =
  | "shahedoriz"
  | "nebesnyi"
  | "donations"
  | "potochnyi"
  | "fpv"
  | "redrone"

type MonthlyReportBlockProps = React.ComponentProps<"section"> & {
  period: string
  dateStampLabel?: string
  project: React.ReactNode
  projectIcon?: React.ReactNode
  hero: SecondaryMetric
  secondary?: SecondaryMetric[]
  media?: React.ReactNode
  loss?: { amount: number; currency?: "₴" | "$"; label?: React.ReactNode }
  palette?: ReportPalette
}

// Composed Sternenko monthly report — "left stat stack + right media" layout
// from the social report set (e.g. Шахедоріз). Sits on the themed dark canvas
// and is built entirely from the Report/* primitives, so it re-skins per brand.
function MonthlyReportBlock({
  className,
  period,
  dateStampLabel,
  project,
  projectIcon,
  hero,
  secondary = [],
  media,
  loss,
  palette,
  ...props
}: MonthlyReportBlockProps) {
  return (
    <section
      data-slot="monthly-report-block"
      data-report-palette={palette}
      className={cn(
        "bg-foreground text-background w-full p-3 md:p-4",
        className
      )}
      {...props}
    >
      <div className="grid gap-3 md:grid-cols-2">
        <ReportCard tone="accent" size="lg" className="justify-between gap-8">
          <div className="flex flex-col gap-5">
            <ReportDateStamp period={period} label={dateStampLabel} />
            <ProjectTitle icon={projectIcon}>{project}</ProjectTitle>
          </div>

          <DisplayMetric
            value={hero.value}
            label={hero.label}
            size="lg"
            align="end"
          />

          {secondary.length ? (
            <div className="grid grid-cols-2 gap-px overflow-hidden border-t-2 border-current pt-5">
              {secondary.map((metric, index) => (
                <DisplayMetric
                  key={index}
                  value={metric.value}
                  label={metric.label}
                  size="sm"
                />
              ))}
            </div>
          ) : null}
        </ReportCard>

        <div className="flex flex-col gap-3">
          <ReportCard
            tone="muted"
            size="lg"
            className="flex-1 items-center justify-center overflow-hidden p-0"
          >
            {media ?? (
              <div className="text-muted-foreground flex aspect-video w-full items-center justify-center text-xs uppercase">
                media
              </div>
            )}
          </ReportCard>

          {loss ? (
            <CurrencyMetric
              amount={loss.amount}
              currency={loss.currency}
              compact
              size="lg"
              align="end"
              label={loss.label ?? "приблизні збитки окупантів за місяць"}
            />
          ) : null}
        </div>
      </div>
    </section>
  )
}

export { MonthlyReportBlock }
export type { ReportPalette }
