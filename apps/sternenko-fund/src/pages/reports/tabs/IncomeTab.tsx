import { useMemo, useState } from "react"

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
} from "@workspace/ui/components/report-table"
import { Stack } from "@workspace/ui/layout/stack"

import { AmountRangeFilter } from "../components/AmountRangeFilter"
import { DateRangeFilter } from "../components/DateRangeFilter"
import { FilterChips } from "../components/FilterChips"
import { FundraisingTag } from "../components/FundraisingTag"
import {
  IncomeMetricsCluster,
} from "../components/IncomeMetricsCluster"
import { IncomeSourcesChart } from "../components/IncomeSourcesChart"
import { MultiSelectFilter } from "../components/MultiSelectFilter"
import { EmptyReportState, ReportPagination } from "../components/ReportPagination"
import {
  FilterApplyButton,
  FilterField,
  FilterRow,
  GranularityToggle,
  SectionTitle,
} from "../components/report-ui"
import { INCOME_TRANSACTIONS, DONOR_TYPES } from "../data/income-transactions"
import {
  buildIncomeChartData,
  buildIncomeFilterChips,
  createDefaultIncomeFilters,
  filterIncomeTransactions,
  formatIncomeDateTime,
  formatPeriodLabel,
  removeIncomeFilterChip,
  summarizeIncome,
} from "../lib/income-analytics"
import { cycleColumnSort, resolveSortKey } from "../lib/table-sort"
import { FUNDRAISINGS, INCOME_SOURCES, type ChartGranularity } from "../mock-data"

type IncomeSortKey = "date" | "amount" | "amountUah"
type SortDirection = "asc" | "desc"

const DEFAULT_SORT_KEY: IncomeSortKey = "date"
const DEFAULT_SORT_DIR: SortDirection = "desc"

type IncomeTabProps = {
  period: { from: Date; to: Date }
  onPeriodChange: (period: { from: Date; to: Date }) => void
}

export function IncomeTab({
  period,
  onPeriodChange,
}: IncomeTabProps) {
  const [granularity, setGranularity] = useState<ChartGranularity>("day")
  const [draftFilters, setDraftFilters] = useState(createDefaultIncomeFilters)
  const [appliedFilters, setAppliedFilters] = useState(createDefaultIncomeFilters)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(15)
  const [activeSortKey, setActiveSortKey] = useState<IncomeSortKey | null>(null)
  const [sortDir, setSortDir] = useState<SortDirection>(DEFAULT_SORT_DIR)
  const sortKey = resolveSortKey(activeSortKey, DEFAULT_SORT_KEY)

  const filteredRows = useMemo(
    () =>
      filterIncomeTransactions(INCOME_TRANSACTIONS, {
        ...appliedFilters,
        from: period.from,
        to: period.to,
      }),
    [appliedFilters, period]
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
    () => buildIncomeFilterChips(appliedFilters),
    [appliedFilters]
  )

  const periodLabel = useMemo(
    () => formatPeriodLabel(period.from, period.to),
    [period.from, period.to]
  )

  const applyFilters = () => {
    setAppliedFilters(draftFilters)
    setPage(1)
  }

  const clearFilters = () => {
    const defaults = createDefaultIncomeFilters()
    setDraftFilters(defaults)
    setAppliedFilters(defaults)
    setGranularity("day")
    setPage(1)
  }

  const removeFilterChip = (chip: { id: string }) => {
    const match = activeFilterChips.find((item) => item.id === chip.id)
    if (!match) return
    const next = removeIncomeFilterChip(appliedFilters, match)
    setDraftFilters(next)
    setAppliedFilters(next)
    setPage(1)
  }

  return (
    <Stack className="w-full min-w-0 gap-10">
      <Stack className="gap-3">
        <FilterRow className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[repeat(5,minmax(0,1fr))_auto] lg:items-end">
          <FilterField label="Дата надходження">
            <DateRangeFilter value={period} onChange={onPeriodChange} />
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
          <FilterField label="Збір">
            <MultiSelectFilter
              options={FUNDRAISINGS}
              selected={draftFilters.fundraisings}
              onChange={(fundraisings) =>
                setDraftFilters((current) => ({ ...current, fundraisings }))
              }
              placeholder="Усі збори"
            />
          </FilterField>
          <FilterField label="Тип донора">
            <MultiSelectFilter
              options={DONOR_TYPES}
              selected={draftFilters.donorTypes}
              onChange={(donorTypes) =>
                setDraftFilters((current) => ({ ...current, donorTypes }))
              }
              placeholder="Усі типи"
            />
          </FilterField>
          <FilterApplyButton onClick={applyFilters} />
        </FilterRow>
        <FilterChips
          chips={activeFilterChips}
          onRemove={removeFilterChip}
          onClear={clearFilters}
        />
      </Stack>

      <IncomeMetricsCluster summary={summary} periodLabel={periodLabel} />

      <div
        data-report-palette="shahedoriz"
        className="flex w-full min-w-0 flex-col gap-3 overflow-hidden rounded-[var(--radius-report-lg)] bg-foreground p-3 text-background md:p-4"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
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
        />
      </div>

      <div className="flex w-full min-w-0 flex-col gap-3">
        <SectionTitle>Транзакції</SectionTitle>
        {pageRows.length === 0 ? (
          <EmptyReportState message="За обраний період транзакцій не знайдено." />
        ) : (
          <ReportTable tableClassName="table-fixed">
            <ReportTableHeader>
              <ReportTableHeaderRow>
                <ReportTableHeadSortable
                  label="Дата"
                  sortDirection={activeSortKey === "date" ? sortDir : null}
                  onCycleSort={() => cycleSort("date")}
                  className="w-[14%]"
                />
                <ReportTableHead className="w-[17%]">Джерело надходження</ReportTableHead>
                <ReportTableHeadSortable
                  label="Сума"
                  sortDirection={activeSortKey === "amount" ? sortDir : null}
                  onCycleSort={() => cycleSort("amount")}
                  align="right"
                  className="w-[10%]"
                />
                <ReportTableHead className="w-[7%]">Валюта</ReportTableHead>
                <ReportTableHeadSortable
                  label="Сума еквівалент у ₴"
                  sortDirection={activeSortKey === "amountUah" ? sortDir : null}
                  onCycleSort={() => cycleSort("amountUah")}
                  align="right"
                  className="w-[20%]"
                />
                <ReportTableHead className="w-[18%]">Збір</ReportTableHead>
                <ReportTableHead className="w-[14%]">Тип донора</ReportTableHead>
              </ReportTableHeaderRow>
            </ReportTableHeader>
            <ReportTableBody>
              {pageRows.map((row) => (
                <ReportTableRow key={row.id}>
                  <ReportTableCell className="whitespace-nowrap tabular-nums">
                    {formatIncomeDateTime(row.at)}
                  </ReportTableCell>
                  <ReportTableCell>{row.source}</ReportTableCell>
                  <ReportTableCell className="text-right tabular-nums">
                    {formatReportNumber(row.amount)}
                  </ReportTableCell>
                  <ReportTableCell>{row.currency}</ReportTableCell>
                  <ReportTableCell className="text-right tabular-nums">
                    {formatReportNumber(row.amountUah)}
                  </ReportTableCell>
                  <ReportTableCell className="min-w-0 max-w-full">
                    <FundraisingTag name={row.fundraising} />
                  </ReportTableCell>
                  <ReportTableCell>{row.donorType}</ReportTableCell>
                </ReportTableRow>
              ))}
            </ReportTableBody>
          </ReportTable>
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
