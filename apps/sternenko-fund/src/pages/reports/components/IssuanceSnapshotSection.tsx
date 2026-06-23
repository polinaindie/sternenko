import { useMemo, type ReactNode } from "react"

import {
  CurrencyMetric,
  DisplayMetric,
} from "@workspace/ui/components/report-metric"
import { ReportCard } from "@workspace/ui/components/report-card"
import { Stack } from "@workspace/ui/layout/stack"

import {
  summarizeClosedRequestsByProject,
  summarizeIssuanceKpis,
} from "../lib/issuance-analytics"
import type { IssuanceRow } from "../mock-data"
import { ClosedRequestsByProjectChart } from "./ClosedRequestsByProjectChart"
import { EmptyReportState } from "./ReportPagination"
import { SectionTitle } from "./report-ui"

type IssuanceSnapshotSectionProps = {
  /** Рядки таблиці після застосованих фільтрів. */
  rows: IssuanceRow[]
  /** Підпис періоду з фільтра «Дата видачі». */
  periodLabel: string
}

function SnapshotCaption({ children }: { children: ReactNode }) {
  return (
    <span className="[font-family:var(--font-body)] text-sm font-normal tracking-normal text-muted-foreground">
      {children}
    </span>
  )
}

export function IssuanceSnapshotSection({
  rows,
  periodLabel,
}: IssuanceSnapshotSectionProps) {
  const kpis = useMemo(() => summarizeIssuanceKpis(rows), [rows])

  const projectBreakdown = useMemo(
    () => summarizeClosedRequestsByProject(rows),
    [rows]
  )

  return (
    <Stack className="gap-3">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <ReportCard
          tone="outline"
          className="bg-[var(--report-surface)] text-[var(--report-surface-foreground)]"
        >
          <CurrencyMetric
            amount={kpis.totalPurchaseAmountUah}
            label="Загальна сума закупівель, ₴"
            size="sm"
          >
            <SnapshotCaption>{periodLabel}</SnapshotCaption>
          </CurrencyMetric>
        </ReportCard>
        <ReportCard
          tone="outline"
          className="bg-[var(--report-surface)] text-[var(--report-surface-foreground)]"
        >
          <DisplayMetric
            value={kpis.closedRequestsCount}
            label="Закритих запитів"
            size="sm"
          >
            <SnapshotCaption>{periodLabel}</SnapshotCaption>
          </DisplayMetric>
        </ReportCard>
        <ReportCard
          tone="outline"
          className="bg-[var(--report-surface)] text-[var(--report-surface-foreground)]"
        >
          <CurrencyMetric
            amount={kpis.lossesUsd}
            currency="$"
            compact
            label="Збитки ворогу"
            size="sm"
          >
            <SnapshotCaption>приблизна оцінка · {periodLabel}</SnapshotCaption>
          </CurrencyMetric>
        </ReportCard>
      </div>

      {projectBreakdown.length === 0 ? (
        <ReportCard tone="contrast" className="gap-[38px] overflow-x-auto">
          <SectionTitle className="text-center">Закриті запити за проєктами</SectionTitle>
          <EmptyReportState message="За обраними фільтрами немає даних для розподілу." />
        </ReportCard>
      ) : (
        <ClosedRequestsByProjectChart breakdown={projectBreakdown} />
      )}
    </Stack>
  )
}
