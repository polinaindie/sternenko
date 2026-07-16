import { useState } from "react"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"
import { Container } from "@workspace/ui/layout/container"
import { PageShell } from "@workspace/ui/layout/page-shell"
import { Stack } from "@workspace/ui/layout/stack"

import { defaultIncomePeriod } from "./lib/income-analytics"
import { formatReportsDataUpdatedAt } from "./lib/reports-meta"
import { IncomeTab } from "./tabs/IncomeTab"
import { IssuanceTab } from "./tabs/IssuanceTab"

export function ReportsPage() {
  const [period, setPeriod] = useState(defaultIncomePeriod)
  const [activeTab, setActiveTab] = useState("income")

  const reportTabTriggerClass =
    "[font-family:var(--font-display-dark)] flex-none rounded-none px-0 pb-3 text-base text-muted-foreground after:z-10 after:bg-primary after:bottom-0 group-data-horizontal/tabs:after:bottom-0 data-active:text-accent dark:data-active:text-accent data-active:shadow-none md:text-lg"

  return (
    <PageShell>
      <main id="main">
      <Container className="py-[46px]">
        <Stack className="gap-8 md:gap-10">
          <Stack className="gap-2">
            <p className="text-muted-foreground text-sm">
              Дані оновлено: {formatReportsDataUpdatedAt()}
            </p>
            <h1 className="text-3xl uppercase tracking-tight md:text-4xl">
              Детальна звітність
            </h1>
          </Stack>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="relative mb-2 w-full">
              <TabsList
                variant="line"
                className="mb-0 h-auto w-full justify-start gap-8 rounded-none border-0 bg-transparent p-0"
              >
                <TabsTrigger value="income" className={reportTabTriggerClass}>
                  Надходження
                </TabsTrigger>
                <TabsTrigger value="issuance" className={reportTabTriggerClass}>
                  Закупівлі
                </TabsTrigger>
              </TabsList>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-border"
              />
            </div>

            <TabsContent value="income" className="mt-4">
              <IncomeTab period={period} onPeriodChange={setPeriod} />
            </TabsContent>

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
