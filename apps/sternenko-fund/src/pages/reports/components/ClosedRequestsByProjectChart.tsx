import { MetricBar, MetricBarGroup } from "@workspace/ui/components/metric-bar"
import { formatReportNumber, UAH_SUFFIX } from "@workspace/ui/components/report-metric"
import { StackedBlockLayout } from "@workspace/ui/components/stacked-block-layout"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip"

import {
  formatRequestCountCaption,
  type IssuanceProjectRequestBreakdownItem,
} from "../lib/issuance-analytics"
import {
  ReportChartTooltipBody,
  reportChartTooltipContentClass,
} from "./ReportChartTooltip"
import { SectionTitle } from "./report-ui"

const PROJECT_CHART_BAR_HEIGHT = "9rem"

type ClosedRequestsByProjectChartProps = {
  breakdown: IssuanceProjectRequestBreakdownItem[]
}

/** Віджет «Закриті запити за проєктами» — злитий заголовок + вертикальні MetricBar. */
export function ClosedRequestsByProjectChart({
  breakdown,
}: ClosedRequestsByProjectChartProps) {
  return (
    <section className="w-full min-w-0 text-background">
      <StackedBlockLayout
        blockColor="var(--foreground)"
        backgroundColor="transparent"
        heroMaxHeight="auto"
        heroClassName="flex min-h-0 flex-col justify-center"
        blockClassName="flex h-full min-h-0 flex-col justify-end"
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
                  trackHeight={PROJECT_CHART_BAR_HEIGHT}
                  className="min-w-0 flex-1"
                  renderFill={(clamped) => (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className="absolute inset-x-0 bottom-0 cursor-default bg-current outline-none focus-visible:ring-2 focus-visible:ring-background/30"
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
    </section>
  )
}
