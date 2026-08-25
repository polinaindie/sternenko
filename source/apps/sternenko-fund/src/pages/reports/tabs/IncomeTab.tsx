import { useEffect, useMemo, useRef, useState } from "react"

import { formatReportNumber } from "@workspace/ui/components/report-metric"
import {
  ReportTable,
  ReportTableBody,
  ReportTableCell,
  ReportTableHead,
  ReportTableHeadSortable,
  ReportTableHeader,
  ReportTableHeaderRow,
  ReportTableRow,
  reportTableRowSurfaceClass,
} from "@workspace/ui/components/report-table"
import { Stack } from "@workspace/ui/layout/stack"
import { cn } from "@workspace/ui/lib/utils"

import { AmountRangeFilter } from "../components/AmountRangeFilter"
import { DateRangeFilter } from "../components/DateRangeFilter"
import { FilterChips } from "../components/FilterChips"
import { ReportFiltersPanel } from "../components/ReportFiltersPanel"
import { FundraisingTag } from "../components/FundraisingTag"
import {
  IncomeMetricsCluster,
} from "../components/IncomeMetricsCluster"
import { IncomeSourcesChart } from "../components/IncomeSourcesChart"
import { MultiSelectFilter } from "../components/MultiSelectFilter"
import { EmptyReportState, ReportPagination } from "../components/ReportPagination"
import { IncomeTransactionsCompactTable } from "../components/IncomeTransactionsCompactTable"
import {
  FilterApplyButton,
  FilterField,
  FilterRow,
  GranularityToggle,
  reportControlGapStyle,
  reportDesktopKpiRowClass,
  SectionTitle,
} from "../components/report-ui"
import {
  reportTxBodyRow,
  reportTxCellAmountLight,
  reportTxCellAmountStrong,
  reportTxCellCommentTone,
  reportTxCellPadding,
  reportTxCellProject,
  reportTxHead,
  reportTxHeaderDivider,
  reportTxHeadProject,
  reportTxHeadSortable,
  reportTxRowStripeClass,
  reportTxTableClassName,
} from "../components/report-transaction-table-styles"
import { useIncomeTransactions } from "../hooks/useIncomeTransactions"
import {
  buildIncomeChartData,
  buildIncomeFilterChips,
  clampIncomeRange,
  computeIncomeFilterAvailability,
  createDefaultIncomeFilters,
  filterIncomeTransactions,
  formatIncomeDateTime,
  isDefaultIncomePeriod,
  removeIncomeFilterChip,
  summarizeIncome,
} from "../lib/income-analytics"
import {
  pruneProjectFundraiserFilters,
} from "../lib/filter-availability"
import { cycleColumnSort, resolveSortKey } from "../lib/table-sort"
import { IncomeCommentCell } from "../components/IncomeCommentCell"
import { FUNDRAISINGS, INCOME_SOURCES, ISSUANCE_PROJECT_LINES, type ChartGranularity } from "../mock-data"
import {
  getIncomeReportingEnd,
  getIncomeReportingStart,
} from "../data/income-transactions"

type IncomeSortKey = "date" | "amount" | "amountUah"
type SortDirection = "asc" | "desc"

const DEFAULT_SORT_KEY: IncomeSortKey = "date"
const DEFAULT_SORT_DIR: SortDirection = "desc"

/**
 * Дата | Джерело (ліворуч) | блок Сума·Валюта·Еквівалент | Проєкт | Коментар.
 * Числові колонки — компактні (ch), з однаковим pr-проміжком між собою.
 */
const INCOME_COL_DATE = "calc(11ch + 2.5rem)"
const INCOME_COL_SOURCE = "22%"
const INCOME_COL_AMOUNT = "calc(7ch + 1.25rem)"
/** Коди UAH/EUR/USD + заголовок «Валюта», обидва вправо до еквівалента. */
const INCOME_COL_CURRENCY = "calc(7ch + 1rem)"
/** Заголовок + сортування над найдовшим числом. */
const INCOME_COL_AMOUNT_UAH = "calc(17ch + 2.25rem)"
const INCOME_COL_PROJECT = "calc(9ch + 1.5rem)"
const INCOME_COL_COMMENT = `calc(100% - ${INCOME_COL_DATE} - ${INCOME_COL_SOURCE} - ${INCOME_COL_AMOUNT} - ${INCOME_COL_CURRENCY} - ${INCOME_COL_AMOUNT_UAH} - ${INCOME_COL_PROJECT})`

const INCOME_COLUMN_WIDTHS = [
  INCOME_COL_DATE,
  INCOME_COL_SOURCE,
  INCOME_COL_AMOUNT,
  INCOME_COL_CURRENCY,
  INCOME_COL_AMOUNT_UAH,
  INCOME_COL_PROJECT,
  INCOME_COL_COMMENT,
] as const

/** Проміжок між Сума → Валюта → Еквівалент. */
const incomeNumericGap = "!pr-3"

const incomeHeadDate = cn(
  reportTxHeadSortable,
  reportTxCellPadding,
  "border-r border-[var(--report-border)]"
)
const incomeHeadSource = cn(
  reportTxHead,
  reportTxCellPadding,
  "!whitespace-normal leading-tight"
)
const incomeHeadAmount = cn(
  reportTxHeadSortable,
  "!pl-1.5",
  incomeNumericGap,
  "tabular-nums"
)
const incomeHeadCurrency = cn(
  reportTxHead,
  "!px-1",
  incomeNumericGap,
  "!overflow-hidden whitespace-nowrap text-right"
)
const incomeHeadAmountUah = cn(
  reportTxHeadSortable,
  "!pl-2",
  "!pr-2",
  "tabular-nums"
)
const incomeHeadComment = cn(reportTxHead, reportTxCellPadding, "min-w-0")
const incomeCellSource = cn(
  reportTxCellPadding,
  "min-w-0 whitespace-normal [overflow-wrap:normal] [word-break:normal]"
)
const incomeCellDate = cn(
  reportTxCellPadding,
  "border-r border-[var(--report-border)] whitespace-nowrap tabular-nums",
  reportTxCellCommentTone
)
const incomeCellAmount = cn("!pl-1.5", incomeNumericGap, reportTxCellAmountLight)
const incomeCellCurrency = cn(
  "!px-1",
  incomeNumericGap,
  "whitespace-nowrap tabular-nums text-right",
  reportTxCellCommentTone
)
const incomeCellAmountUah = cn("!pl-1.5", incomeNumericGap, reportTxCellAmountStrong)
const incomeCellComment = cn(
  reportTxCellPadding,
  "min-w-0"
)

type IncomeTabProps = {
  period: { from: Date; to: Date }
  onPeriodChange: (period: { from: Date; to: Date }) => void
}

export function IncomeTab({
  period,
  onPeriodChange,
}: IncomeTabProps) {
  const { rows: incomeTransactions, loading, error } = useIncomeTransactions()
  const [granularity, setGranularity] = useState<ChartGranularity>("day")
  const [draftFilters, setDraftFilters] = useState(createDefaultIncomeFilters)
  const [appliedFilters, setAppliedFilters] = useState(createDefaultIncomeFilters)
  const [draftPeriod, setDraftPeriod] = useState(period)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(15)
  const [activeSortKey, setActiveSortKey] = useState<IncomeSortKey | null>(null)
  const [sortDir, setSortDir] = useState<SortDirection>(DEFAULT_SORT_DIR)
  const sortKey = resolveSortKey(activeSortKey, DEFAULT_SORT_KEY)
  const didSyncExpandedReporting = useRef(false)

  useEffect(() => {
    if (loading || incomeTransactions.length === 0) return

    const reportingStart = getIncomeReportingStart()
    const reportingEnd = getIncomeReportingEnd()
    const reportingPeriod = clampIncomeRange(reportingStart, reportingEnd)

    if (!didSyncExpandedReporting.current) {
      didSyncExpandedReporting.current = true
      onPeriodChange(reportingPeriod)
      setDraftPeriod(reportingPeriod)
      setGranularity("day")
      return
    }

    const visibleInPeriod = filterIncomeTransactions(incomeTransactions, {
      ...appliedFilters,
      from: period.from,
      to: period.to,
    })

    if (visibleInPeriod.length === 0) {
      onPeriodChange(reportingPeriod)
      setDraftPeriod(reportingPeriod)
      setGranularity("day")
    }
  }, [
    loading,
    incomeTransactions,
    appliedFilters,
    onPeriodChange,
    period.from,
    period.to,
  ])

  const filteredRows = useMemo(
    () =>
      filterIncomeTransactions(incomeTransactions, {
        ...appliedFilters,
        from: period.from,
        to: period.to,
      }),
    [appliedFilters, period, incomeTransactions]
  )

  const summary = useMemo(() => summarizeIncome(filteredRows), [filteredRows])

  const chartData = useMemo(
    () =>
      buildIncomeChartData(filteredRows, granularity, {
        from: period.from,
        to: period.to,
      }),
    [filteredRows, granularity, period]
  )

  const sortedRows = useMemo(() => {
    const rows = [...filteredRows]
    const direction = sortDir === "asc" ? 1 : -1

    rows.sort((a, b) => {
      if (sortKey === "date") {
        return (new Date(a.at).getTime() - new Date(b.at).getTime()) * direction
      }
      if (sortKey === "amount") {
        return (a.amount - b.amount) * direction
      }
      return (a.amountUah - b.amountUah) * direction
    })

    return rows
  }, [filteredRows, sortKey, sortDir])

  const cycleSort = (key: IncomeSortKey) => {
    const next = cycleColumnSort(key, activeSortKey, sortDir, DEFAULT_SORT_DIR)
    setActiveSortKey(next.activeKey)
    setSortDir(next.direction)
    setPage(1)
  }

  const pageRows = useMemo(() => {
    const start = (page - 1) * pageSize
    return sortedRows.slice(start, start + pageSize)
  }, [sortedRows, page, pageSize])

  const activeFilterChips = useMemo(
    () => buildIncomeFilterChips(appliedFilters, filteredRows),
    [appliedFilters, filteredRows]
  )

  const activeFilterCount =
    activeFilterChips.length +
    (isDefaultIncomePeriod(period.from, period.to) ? 0 : 1)

  useEffect(() => {
    if (!filtersOpen) return
    setDraftFilters(appliedFilters)
    setDraftPeriod(period)
  }, [filtersOpen, appliedFilters, period])

  const applyFilters = () => {
    onPeriodChange(draftPeriod)
    const availability = computeIncomeFilterAvailability(
      incomeTransactions,
      draftPeriod
    )
    const pruned = pruneProjectFundraiserFilters(
      draftFilters,
      ISSUANCE_PROJECT_LINES,
      FUNDRAISINGS,
      availability
    )
    setAppliedFilters(pruned)
    setDraftFilters(pruned)
    setPage(1)
    setFiltersOpen(false)
  }

  const applyDesktopFilters = () => {
    setAppliedFilters(draftFilters)
    setPage(1)
  }

  const handlePeriodChange = (next: { from: Date; to: Date }) => {
    onPeriodChange(next)
    const availability = computeIncomeFilterAvailability(incomeTransactions, next)
    const prune = <T extends typeof draftFilters>(filters: T) =>
      pruneProjectFundraiserFilters(
        filters,
        ISSUANCE_PROJECT_LINES,
        FUNDRAISINGS,
        availability
      )
    setDraftFilters(prune)
    setAppliedFilters(prune)
    setPage(1)
  }

  const cancelFilters = () => {
    setDraftFilters(appliedFilters)
    setDraftPeriod(period)
    setFiltersOpen(false)
  }

  const handleFiltersOpenChange = (open: boolean) => {
    if (!open) {
      setDraftFilters(appliedFilters)
      setDraftPeriod(period)
    }
    setFiltersOpen(open)
  }

  const clearFilters = () => {
    const defaults = createDefaultIncomeFilters()
    const defaultPeriod = { from: defaults.from, to: defaults.to }
    setDraftFilters(defaults)
    setAppliedFilters(defaults)
    setDraftPeriod(defaultPeriod)
    onPeriodChange(defaultPeriod)
    setGranularity("day")
    setPage(1)
    setFiltersOpen(false)
  }

  const removeFilterChip = (chip: { id: string }) => {
    const match = activeFilterChips.find((item) => item.id === chip.id)
    if (!match) return
    const next = removeIncomeFilterChip(appliedFilters, match)
    setDraftFilters(next)
    setAppliedFilters(next)
    setPage(1)
  }

  if (loading) {
    return (
      <EmptyReportState message="Завантаження надходжень…" />
    )
  }

  if (error) {
    return (
      <EmptyReportState message={error} />
    )
  }

  return (
    <Stack className="w-full min-w-0 gap-4 md:gap-6 lg:gap-10">
      <Stack className="gap-3">
        <ReportFiltersPanel
          open={filtersOpen}
          onOpenChange={handleFiltersOpenChange}
          activeFilterCount={activeFilterCount}
          onApply={applyFilters}
          onCancel={cancelFilters}
          onClearAll={clearFilters}
        >
          <FilterField label="Дата надходження">
            <DateRangeFilter
              value={draftPeriod}
              onChange={setDraftPeriod}
              reportingStart={getIncomeReportingStart()}
              reportingEnd={getIncomeReportingEnd()}
              isDefaultPeriod={isDefaultIncomePeriod(draftPeriod.from, draftPeriod.to)}
            />
          </FilterField>
          <FilterField label="Джерела надходження">
            <MultiSelectFilter
              options={INCOME_SOURCES}
              selected={draftFilters.sources}
              onChange={(sources) =>
                setDraftFilters((current) => ({ ...current, sources }))
              }
              placeholder="Усі джерела"
            />
          </FilterField>
          <FilterField label="Сума">
            <AmountRangeFilter
              value={{ min: draftFilters.amountMin, max: draftFilters.amountMax }}
              onChange={({ min, max }) =>
                setDraftFilters((current) => ({ ...current, amountMin: min, amountMax: max }))
              }
            />
          </FilterField>
        </ReportFiltersPanel>

        <div className="hidden lg:flex lg:flex-col lg:gap-3">
          <div className={cn(reportDesktopKpiRowClass, "items-end")}>
            <FilterField label="Дата надходження" className="min-w-0 flex-1">
              <DateRangeFilter
                value={period}
                onChange={handlePeriodChange}
                reportingStart={getIncomeReportingStart()}
                reportingEnd={getIncomeReportingEnd()}
                isDefaultPeriod={isDefaultIncomePeriod(period.from, period.to)}
              />
            </FilterField>
            <FilterField label="Джерела надходження" className="min-w-0 flex-1">
              <MultiSelectFilter
                options={INCOME_SOURCES}
                selected={draftFilters.sources}
                onChange={(sources) =>
                  setDraftFilters((current) => ({ ...current, sources }))
                }
                placeholder="Усі джерела"
              />
            </FilterField>
            <div
              className={cn(
                reportControlGapStyle,
                "flex min-w-0 flex-1 items-end gap-(--report-control-gap)"
              )}
            >
              <FilterField label="Сума" className="min-w-0 flex-1">
                <AmountRangeFilter
                  value={{ min: draftFilters.amountMin, max: draftFilters.amountMax }}
                  onChange={({ min, max }) =>
                    setDraftFilters((current) => ({ ...current, amountMin: min, amountMax: max }))
                  }
                />
              </FilterField>
              <FilterApplyButton className="shrink-0 self-end" onClick={applyDesktopFilters} />
            </div>
          </div>
          {activeFilterChips.length > 0 ? (
            <FilterChips
              chips={activeFilterChips}
              onRemove={removeFilterChip}
              onClear={clearFilters}
              clearLabel="Очистити всі"
            />
          ) : null}
        </div>

        <FilterChips
          chips={activeFilterChips}
          onRemove={removeFilterChip}
          className="lg:hidden"
        />
      </Stack>

      <Stack className="gap-3">
        <IncomeMetricsCluster summary={summary} bare className="hidden lg:flex" />
        <IncomeMetricsCluster summary={summary} className="lg:hidden" />

        <div
          data-report-palette="shahedoriz"
          className="flex w-full min-w-0 flex-col gap-10 overflow-hidden rounded-[var(--radius-report-lg)] bg-foreground p-3 text-background md:p-4"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <SectionTitle className="text-background">
              Джерела надходжень, ₴
            </SectionTitle>
            <GranularityToggle
              tone="onDark"
              value={granularity}
              onChange={setGranularity}
            />
          </div>
          <IncomeSourcesChart
            data={chartData}
            granularity={granularity}
            onGranularityChange={setGranularity}
            activeSources={appliedFilters.sources}
          />
        </div>
      </Stack>

      <div className="flex w-full min-w-0 flex-col gap-3">
        {pageRows.length === 0 ? (
          <EmptyReportState message="За обраний період транзакцій не знайдено." />
        ) : (
          <>
            <IncomeTransactionsCompactTable rows={pageRows} />

            <div className="hidden lg:block">
              <ReportTable
                tone="muted"
                tableClassName={reportTxTableClassName}
              >
                <colgroup>
                  {INCOME_COLUMN_WIDTHS.map((width, index) => (
                    <col key={index} style={{ width }} />
                  ))}
                </colgroup>
                <ReportTableHeader className={reportTxHeaderDivider}>
                  <ReportTableHeaderRow>
                    <ReportTableHeadSortable
                      label="Дата"
                      sortDirection={activeSortKey === "date" ? sortDir : null}
                      onCycleSort={() => cycleSort("date")}
                      className={incomeHeadDate}
                    />
                    <ReportTableHead className={incomeHeadSource}>
                      Джерело надходження
                    </ReportTableHead>
                    <ReportTableHeadSortable
                      label="Сума"
                      sortDirection={activeSortKey === "amount" ? sortDir : null}
                      onCycleSort={() => cycleSort("amount")}
                      align="right"
                      layout="compact"
                      className={incomeHeadAmount}
                    />
                    <ReportTableHead className={incomeHeadCurrency}>Валюта</ReportTableHead>
                    <ReportTableHeadSortable
                      label="Сума еквівалент у ₴"
                      sortDirection={activeSortKey === "amountUah" ? sortDir : null}
                      onCycleSort={() => cycleSort("amountUah")}
                      align="right"
                      layout="compact"
                      className={incomeHeadAmountUah}
                    />
                    <ReportTableHead className={reportTxHeadProject}>
                      Проєкт/збір
                    </ReportTableHead>
                    <ReportTableHead className={incomeHeadComment}>
                      Коментар
                    </ReportTableHead>
                  </ReportTableHeaderRow>
                </ReportTableHeader>
                <ReportTableBody>
                  {pageRows.map((row, rowIndex) => (
                    <ReportTableRow
                      key={row.id}
                      striping="none"
                      className={cn(
                        reportTxBodyRow,
                        rowIndex % 2 === 1
                          ? reportTxRowStripeClass
                          : reportTableRowSurfaceClass
                      )}
                    >
                      <ReportTableCell className={incomeCellDate}>
                        {formatIncomeDateTime(row.at)}
                      </ReportTableCell>
                      <ReportTableCell className={incomeCellSource}>
                        {row.source}
                      </ReportTableCell>
                      <ReportTableCell className={incomeCellAmount}>
                        {formatReportNumber(row.amount)}
                      </ReportTableCell>
                      <ReportTableCell className={incomeCellCurrency}>
                        {row.currency}
                      </ReportTableCell>
                      <ReportTableCell className={incomeCellAmountUah}>
                        {formatReportNumber(row.amountUah)}
                      </ReportTableCell>
                      <ReportTableCell className={reportTxCellProject}>
                        <FundraisingTag name={row.fundraising} variant="colored" />
                      </ReportTableCell>
                      <ReportTableCell className={incomeCellComment}>
                        <IncomeCommentCell comment={row.comment} />
                      </ReportTableCell>
                    </ReportTableRow>
                  ))}
                </ReportTableBody>
              </ReportTable>
            </div>
          </>
        )}
        <ReportPagination
          page={page}
          pageSize={pageSize}
          total={filteredRows.length}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size)
            setPage(1)
          }}
        />
      </div>
    </Stack>
  )
}
