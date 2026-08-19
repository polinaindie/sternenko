import { useState } from "react"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip"
import { Container } from "@workspace/ui/layout/container"
import { PageShell } from "@workspace/ui/layout/page-shell"
import { Stack } from "@workspace/ui/layout/stack"
import { cn } from "@workspace/ui/lib/utils"

import { defaultIncomePeriod } from "./lib/income-analytics"
import { formatReportsDataUpdatedAt } from "./lib/reports-meta"
import { IncomeTab } from "./tabs/IncomeTab"
import { IssuanceTab } from "./tabs/IssuanceTab"

/** Тимчасово вимкнено — увімкнути, коли вкладка «Надходження» буде готова. */
const INCOME_TAB_ENABLED = false

export function ReportsPage() {
  const [period, setPeriod] = useState(defaultIncomePeriod)
  const [activeTab, setActiveTab] = useState(
    INCOME_TAB_ENABLED ? "income" : "issuance"
  )

  const reportTabTriggerClass =
    "[font-family:var(--font-display-dark)] flex-none rounded-none px-0 pb-3 text-base text-muted-foreground after:z-10 after:bg-primary after:bottom-0 group-data-horizontal/tabs:after:bottom-0 data-active:text-accent dark:data-active:text-accent data-active:shadow-none md:text-lg"

  return (
    <PageShell>
      <main id="main">
      <Container className="pt-[46px] pb-[46px] md:pt-[80px]">
        <Stack className="gap-8 md:gap-10">
          <Stack className="gap-2">
            <p className="text-muted-foreground text-sm">
              Дані оновлено: {formatReportsDataUpdatedAt()}
            </p>
            <h1 className="text-3xl uppercase tracking-tight md:text-4xl">
              Детальна звітність
            </h1>
          </Stack>

          <Tabs
            value={activeTab}
            onValueChange={(value) => {
              if (!INCOME_TAB_ENABLED && value === "income") return
              setActiveTab(value)
            }}
          >
            <div className="relative mb-2 w-full">
              <TabsList
                variant="line"
                className="mb-0 h-auto w-full justify-start gap-8 rounded-none border-0 bg-transparent p-0"
              >
                {INCOME_TAB_ENABLED ? (
                  <TabsTrigger value="income" className={reportTabTriggerClass}>
                    Надходження
                  </TabsTrigger>
                ) : (
                  <TooltipProvider delayDuration={200}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="inline-flex cursor-not-allowed">
                          <TabsTrigger
                            value="income"
                            disabled
                            className={cn(
                              reportTabTriggerClass,
                              "disabled:pointer-events-none"
                            )}
                          >
                            Надходження
                          </TabsTrigger>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top" sideOffset={6} hideArrow>
                        Сторінка в процесі розробки
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                <TabsTrigger value="issuance" className={reportTabTriggerClass}>
                  Закупівлі
                </TabsTrigger>
              </TabsList>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-border"
              />
            </div>

            {INCOME_TAB_ENABLED ? (
              <TabsContent value="income" className="mt-4">
                <IncomeTab period={period} onPeriodChange={setPeriod} />
              </TabsContent>
            ) : null}

            <TabsContent value="issuance" className="mt-4">
              <IssuanceTab />
            </TabsContent>
          </Tabs>
        </Stack>
      </Container>
      </main>
    </PageShell>
  )
}
