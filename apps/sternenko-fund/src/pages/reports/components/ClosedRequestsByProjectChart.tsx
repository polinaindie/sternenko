import { MetricBar, MetricBarGroup } from "@workspace/ui/components/metric-bar"
import { formatReportNumber, UAH_SUFFIX } from "@workspace/ui/components/report-metric"
import { StackedBlockLayout } from "@workspace/ui/components/stacked-block-layout"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip"
import { cn } from "@workspace/ui/lib/utils"

import {
  formatRequestCountCaption,
  type IssuanceProjectRequestBreakdownItem,
} from "../lib/issuance-analytics"
import { getProjectBarClass } from "../lib/project-colors"
import {
  ReportChartTooltipBody,
  reportChartTooltipContentClass,
} from "./ReportChartTooltip"
import { SectionTitle } from "./report-ui"

type ClosedRequestsByProjectChartProps = {
  breakdown: IssuanceProjectRequestBreakdownItem[]
}

/** Віджет «Закриті запити за проєктами» — вертикальні MetricBar у StackedBlockLayout (брендбук). */
export function ClosedRequestsByProjectChart({
  breakdown,
}: ClosedRequestsByProjectChartProps) {
  return (
    <StackedBlockLayout
      blockColor="var(--report-surface)"
      backgroundColor="transparent"
      heroMaxHeight="auto"
      heroClassName="flex min-h-0 flex-col justify-center text-[var(--report-surface-foreground)]"
      blockClassName="text-[var(--report-surface-foreground)]"
      contentClassName="overflow-x-auto"
      hero={
        <SectionTitle className="text-center">Закриті запити за проєктами</SectionTitle>
      }
      content={
        <TooltipProvider>
          <MetricBarGroup className="min-w-[640px]">
            {breakdown.map((item) => (
              <MetricBar
                key={item.project}
                percent={item.share}
                label={item.project}
                valueLabel={formatReportNumber(item.count)}
                valueCaption={formatRequestCountCaption(item.count)}
                className={cn("min-w-0 flex-1", getProjectBarClass(item.project))}
                renderFill={(clamped) => (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className="absolute inset-x-0 bottom-0 cursor-default bg-current outline-none focus-visible:ring-2 focus-visible:ring-foreground/30"
                        style={{ height: `${clamped}%` }}
                        aria-label={`Закритих запитів: ${formatReportNumber(item.count)} ${formatRequestCountCaption(item.count)}; Сума закупівель: ${formatReportNumber(item.amountUah)}${UAH_SUFFIX}`}
                      />
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      sideOffset={8}
                      hideArrow
                      className={reportChartTooltipContentClass}
                    >
                      <ReportChartTooltipBody
                        title={item.project}
                        rows={[
                          {
                            label: "Закритих запитів",
                            value: `${formatReportNumber(item.count)} ${formatRequestCountCaption(item.count)}`,
                          },
                          {
                            label: "Сума закупівель",
                            value: `${formatReportNumber(item.amountUah)}${UAH_SUFFIX}`,
                          },
                        ]}
                      />
                    </TooltipContent>
                  </Tooltip>
                )}
              />
            ))}
          </MetricBarGroup>
        </TooltipProvider>
      }
    />
  )
}
