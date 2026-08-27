import { useEffect, useMemo, useState } from "react"
import { FileTextIcon, ImagesIcon, ReceiptIcon } from "lucide-react"

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

import {
  AttachmentViewer,
  attachmentViewerMode,
  attachmentViewerTitle,
  type AttachmentKind,
  type DocumentAttachmentItem,
  type TransferMediaItem,
} from "../components/AttachmentViewer"
import { DateRangeFilter } from "../components/DateRangeFilter"
import { AppliedPeriodSummary } from "../components/AppliedPeriodSummary"
import { FilterChips } from "../components/FilterChips"
import { ReportFiltersPanel } from "../components/ReportFiltersPanel"
import { FundraisingTag } from "../components/FundraisingTag"
import { IssuanceSnapshotSection } from "../components/IssuanceSnapshotSection"
import { MultiSelectFilter } from "../components/MultiSelectFilter"
import { NameSearchFilter } from "../components/NameSearchFilter"
import {
  EmptyReportState,
  ReportPagination,
} from "../components/ReportPagination"
import { IssuanceTransactionsCompactTable } from "../components/IssuanceTransactionsCompactTable"
import { StickyFilterBar } from "../components/StickyFilterBar"
import {
  AttachmentButton,
  FilterApplyButton,
  FilterField,
  FilterPopoverResetButton,
  reportIssuanceDesktopGridClass,
  reportIssuanceFilterFieldsGridClass,
  reportIssuanceFilterHalfClass,
  reportIssuanceFilterHalfWithApplyClass,
} from "../components/report-ui"
import {
  reportTxBodyRow,
  reportTxCellAmountLight,
  reportTxCellCommentTone,
  reportTxCellPadding,
  reportTxCellProject,
  reportTxCellWrap,
  reportTxHead,
  reportTxHeaderDivider,
  reportTxHeadProject,
  reportTxHeadSortable,
  reportTxProjectColWidth,
  reportTxRowStripeClass,
  reportTxTableClassName,
} from "../components/report-transaction-table-styles"
import {
  buildIssuanceFilterChips,
  buildIssuanceEmptyStateMessage,
  collectIssuanceActiveDates,
  createDefaultIssuanceFilters,
  filterIssuanceResult,
  hasActiveIssuanceFilters,
  hasIssuanceFilterSelection,
  isDefaultIssuancePeriod,
  isSameIssuanceFilters,
  removeIssuanceFilterChip,
  type IssuanceFilterChip,
  type IssuanceFilters,
} from "../lib/issuance-analytics"
import {
  computeIssuanceDateCells,
  computeIssuanceDateGroupStripes,
} from "../lib/issuance-table-dates"
import { cycleColumnSort, resolveSortKey } from "../lib/table-sort"
import {
  ISSUANCE_PROJECT_OPTIONS,
  ISSUANCE_ROWS,
  ISSUANCE_UNITS,
  REPORTS_DATA_UPDATED_AT,
} from "../mock-data"

/** Заголовки — один рядок, повна назва стовпця без обрізання (типографіка — reportTableHeadClass). */
const issuanceHead = reportTxHead
/** DD.MM.YYYY + padding; фіксована ширина, щоб не розтягувалась у table-fixed. */
const ISSUANCE_DATE_COL_WIDTH = "6.5rem"
/** До 4 цифр + кнопка сортування. */
const ISSUANCE_QUANTITY_COL_WIDTH = "4.5rem"
/** До 10 цифр (uk-UA групування) + підпис і сортування. */
const ISSUANCE_UNIT_PRICE_COL_WIDTH = "calc(9ch + 2.5rem)"
/** Сума рядка — вузький числовий стовпець. */
const ISSUANCE_TOTAL_COL_WIDTH = "calc(10ch + 2.5rem)"
const ISSUANCE_PROJECT_COL_WIDTH = reportTxProjectColWidth
/** Іконка size-8 + мінімальний падинг. */
const ISSUANCE_ATTACHMENT_COL_WIDTH = "3.25rem"
const ISSUANCE_FIXED_COLS_WIDTH = `calc(${ISSUANCE_DATE_COL_WIDTH} + ${ISSUANCE_QUANTITY_COL_WIDTH} + ${ISSUANCE_UNIT_PRICE_COL_WIDTH} + ${ISSUANCE_TOTAL_COL_WIDTH} + ${ISSUANCE_PROJECT_COL_WIDTH} + 3 * ${ISSUANCE_ATTACHMENT_COL_WIDTH})`

/** Пропорції гнучких стовпців: найменування, кому передали. */
const ISSUANCE_FLEX_COL_FRACTIONS = [42, 38] as const
const ISSUANCE_FLEX_COL_TOTAL = ISSUANCE_FLEX_COL_FRACTIONS.reduce(
  (sum, fraction) => sum + fraction,
  0
)

function issuanceFlexColWidth(fraction: number) {
  return `calc((100% - ${ISSUANCE_FIXED_COLS_WIDTH}) * ${fraction} / ${ISSUANCE_FLEX_COL_TOTAL})`
}

const issuanceHeadSortable = reportTxHeadSortable

const issuanceCellWrap = reportTxCellWrap

/** Дата — середній сірий, як коментар; вирівнювання з першим товаром у групі. */
const issuanceCellDate = cn(
  issuanceCellWrap,
  "max-w-[6.5rem] border-r border-[var(--report-border)] !align-top whitespace-nowrap tabular-nums",
  reportTxCellCommentTone
)
const issuanceBodyRow = reportTxBodyRow
/** Початок нового дня: тонка лінія + помірний відступ. */
const issuanceDayGroupStartRow =
  "border-t border-[var(--report-border)] [&>td]:pt-5"
const issuanceHeaderDivider = reportTxHeaderDivider
const issuanceHeadQuantity = cn(issuanceHeadSortable, "max-w-[4.5rem] !px-2")
const issuanceCellQuantity = "max-w-[4.5rem] whitespace-nowrap tabular-nums"
const issuanceHeadUnitPrice = cn(
  issuanceHeadSortable,
  "max-w-[calc(9ch+2.5rem)] !px-1.5"
)
const issuanceCellUnitPrice = cn(
  "max-w-[calc(9ch+2.5rem)] text-right whitespace-nowrap tabular-nums",
  reportTxCellCommentTone
)
const issuanceHeadTotal = cn(
  issuanceHeadSortable,
  "max-w-[calc(10ch+2.5rem)] !px-1.5 md:!px-2"
)
const issuanceCellTotal = cn(
  "max-w-[calc(10ch+2.5rem)]",
  reportTxCellAmountLight
)
const issuanceHeadProject = reportTxHeadProject
const issuanceCellProject = reportTxCellProject
const issuanceCellRecipient = "min-w-0"

const issuanceHeadAttachment =
  "!h-auto min-h-11 !whitespace-normal text-center py-1.5 leading-tight !px-0.5 max-w-[3.25rem]"
const issuanceCellAttachment = "!px-0.5 py-2 text-center max-w-[3.25rem]"

/** Дата, к-сть, вартість, сума, проєкт, вкладення — фіксовані; найменування й одержувач ділять залишок. */
const ISSUANCE_COLUMN_WIDTHS = [
  ISSUANCE_DATE_COL_WIDTH,
  issuanceFlexColWidth(ISSUANCE_FLEX_COL_FRACTIONS[0]),
  ISSUANCE_QUANTITY_COL_WIDTH,
  ISSUANCE_UNIT_PRICE_COL_WIDTH,
  ISSUANCE_TOTAL_COL_WIDTH,
  ISSUANCE_PROJECT_COL_WIDTH,
  issuanceFlexColWidth(ISSUANCE_FLEX_COL_FRACTIONS[1]),
  ISSUANCE_ATTACHMENT_COL_WIDTH,
  ISSUANCE_ATTACHMENT_COL_WIDTH,
  ISSUANCE_ATTACHMENT_COL_WIDTH,
] as const

const issuanceTableClassName = reportTxTableClassName

const issuanceRowStripeClass = reportTxRowStripeClass

type IssuanceSortKey = "date" | "quantity" | "unitPrice" | "total"
type SortDirection = "asc" | "desc"

const DEFAULT_SORT_KEY: IssuanceSortKey = "date"
const DEFAULT_SORT_DIR: SortDirection = "desc"

function parseIssuanceDate(date: string): number {
  const [day, month, year] = date.split(".").map(Number)
  return new Date(year, month - 1, day).getTime()
}

const ISSUANCE_EARLIEST_RECORD_DATE = new Date(
  Math.min(...ISSUANCE_ROWS.map((row) => parseIssuanceDate(row.date)))
)
const REPORTS_LAST_REFRESH_DATE = (() => {
  const refreshedAt = new Date(REPORTS_DATA_UPDATED_AT)
  return new Date(
    refreshedAt.getFullYear(),
    refreshedAt.getMonth(),
    refreshedAt.getDate()
  )
})()

type ViewerState = {
  title: string
  kind: AttachmentKind
  mediaItems?: TransferMediaItem[]
  documentItems?: DocumentAttachmentItem[]
}

function initialIssuanceFiltersFromUrl(): {
  filters: ReturnType<typeof createDefaultIssuanceFilters>
  dropped: string[]
} {
  const filters = createDefaultIssuanceFilters()
  if (typeof window === "undefined") return { filters, dropped: [] }

  const params = new URLSearchParams(window.location.search)
  const requestedProjects = [
    ...params.getAll("project"),
    ...params.getAll("projects"),
  ]
  const requestedUnits = [...params.getAll("unit"), ...params.getAll("units")]
  const projects = requestedProjects.filter((value) =>
    (ISSUANCE_PROJECT_OPTIONS as readonly string[]).includes(value)
  ) as typeof filters.projects
  const units = requestedUnits.filter((value) =>
    (ISSUANCE_UNITS as readonly string[]).includes(value)
  )
  const dropped = [
    ...requestedProjects.filter(
      (value) =>
        !(ISSUANCE_PROJECT_OPTIONS as readonly string[]).includes(value)
    ),
    ...requestedUnits.filter(
      (value) => !(ISSUANCE_UNITS as readonly string[]).includes(value)
    ),
  ]

  return {
    filters: {
      ...filters,
      projects: requestedProjects.length > 0 ? projects : filters.projects,
      units: requestedUnits.length > 0 ? units : filters.units,
    },
    dropped,
  }
}

/** Кому передали: номер підрозділу жирним, назва — звичайно. */
function RecipientCell({ value }: { value: string }) {
  const lastComma = value.lastIndexOf(",")
  const unit = lastComma === -1 ? value : value.slice(0, lastComma).trim()
  const unitMatch = unit.match(/^(\d+)\s+([\s\S]*)$/)

  return (
    <span className="leading-snug">
      {unitMatch ? (
        <>
          <span className="font-medium text-[var(--report-surface-foreground)]">
            {unitMatch[1]}
          </span>{" "}
          <span className="break-words whitespace-normal">{unitMatch[2]}</span>
        </>
      ) : (
        <span className="break-words whitespace-normal">{unit}</span>
      )}
    </span>
  )
}

export function IssuanceTab() {
  const [initialFilters] = useState(initialIssuanceFiltersFromUrl)
  const [draftFilters, setDraftFilters] = useState(initialFilters.filters)
  const [appliedFilters, setAppliedFilters] = useState(initialFilters.filters)
  const [pendingFilters, setPendingFilters] = useState<IssuanceFilters | null>(
    null
  )
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(15)
  const [activeSortKey, setActiveSortKey] = useState<IssuanceSortKey | null>(
    null
  )
  const [sortDir, setSortDir] = useState<SortDirection>(DEFAULT_SORT_DIR)
  const sortKey = resolveSortKey(activeSortKey, DEFAULT_SORT_KEY)
  const [viewer, setViewer] = useState<ViewerState | null>(null)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const issuanceResult = useMemo(
    () => filterIssuanceResult(ISSUANCE_ROWS, appliedFilters),
    [appliedFilters]
  )
  const filteredRows = issuanceResult.rows

  /** Без інших фільтрів крапки позначили б майже кожен день і нічого не пояснювали б. */
  const calendarActiveDates = useMemo(
    () =>
      hasActiveIssuanceFilters(draftFilters)
        ? collectIssuanceActiveDates(ISSUANCE_ROWS, draftFilters)
        : undefined,
    [draftFilters]
  )

  const activeFilterChips = useMemo(
    () => buildIssuanceFilterChips(appliedFilters, filteredRows),
    [appliedFilters, filteredRows]
  )

  /**
   * Порожня чернетка нічого не фільтрує, але коли вона розійшлася з застосованим
   * станом — кнопка потрібна, щоб зняти фільтри й повернути повну таблицю.
   */
  const applyDisabled =
    !hasIssuanceFilterSelection(draftFilters) &&
    isSameIssuanceFilters(draftFilters, appliedFilters)

  const activeFilterCount =
    activeFilterChips.length +
    (isDefaultIssuancePeriod(appliedFilters.from, appliedFilters.to) ? 0 : 1)
  const isLoading = pendingFilters !== null
  const visibleRows = isLoading ? [] : filteredRows
  const resultFilters = pendingFilters ?? appliedFilters
  const emptyMessage = buildIssuanceEmptyStateMessage(resultFilters)

  useEffect(() => {
    if (!pendingFilters) return

    const timer = window.setTimeout(() => {
      setAppliedFilters(pendingFilters)
      setPendingFilters(null)
    }, 0)

    return () => window.clearTimeout(timer)
  }, [pendingFilters])

  useEffect(() => {
    setPage(1)
  }, [appliedFilters])

  const sortedRows = useMemo(() => {
    const rows = [...filteredRows]
    const direction = sortDir === "asc" ? 1 : -1

    rows.sort((a, b) => {
      if (sortKey === "date") {
        const byDate =
          (parseIssuanceDate(a.date) - parseIssuanceDate(b.date)) * direction
        if (byDate !== 0) return byDate
        return a.id.localeCompare(b.id, "uk")
      }
      if (sortKey === "quantity") {
        return (a.quantity - b.quantity) * direction
      }
      if (sortKey === "unitPrice") {
        return (a.unitPrice - b.unitPrice) * direction
      }
      return (a.total - b.total) * direction
    })

    return rows
  }, [filteredRows, sortKey, sortDir])

  const cycleSort = (key: IssuanceSortKey) => {
    const next = cycleColumnSort(key, activeSortKey, sortDir, DEFAULT_SORT_DIR)
    setActiveSortKey(next.activeKey)
    setSortDir(next.direction)
    setPage(1)
  }

  const pageRows = useMemo(() => {
    const start = (page - 1) * pageSize
    return sortedRows.slice(start, start + pageSize)
  }, [sortedRows, page, pageSize])

  const dateCellPlacements = useMemo(
    () => computeIssuanceDateCells(pageRows, sortKey === "date"),
    [pageRows, sortKey]
  )

  const dateGroupStripes = useMemo(
    () => computeIssuanceDateGroupStripes(pageRows),
    [pageRows]
  )

  const applyFilters = () => {
    if (applyDisabled) return
    setPendingFilters(draftFilters)
    setPage(1)
    setFiltersOpen(false)
  }

  const applyDesktopFilters = () => {
    if (applyDisabled) return
    setPendingFilters(draftFilters)
    setPage(1)
  }

  const cancelFilters = () => {
    setFiltersOpen(false)
  }

  const handleFiltersOpenChange = (open: boolean) => {
    setFiltersOpen(open)
  }

  const clearFilters = () => {
    const defaults = createDefaultIssuanceFilters()
    setPendingFilters(null)
    setDraftFilters(defaults)
    setAppliedFilters(defaults)
    setPage(1)
    setFiltersOpen(false)
  }

  const removeFilterChip = (chip: IssuanceFilterChip) => {
    const next = removeIssuanceFilterChip(appliedFilters, chip)
    setPendingFilters(null)
    setDraftFilters(next)
    setAppliedFilters(next)
    setPage(1)
  }

  const openMedia = (productName: string, items: TransferMediaItem[]) => {
    if (items.length === 0) return
    setViewer({
      title: attachmentViewerTitle("media", productName),
      kind: "media",
      mediaItems: items,
    })
  }

  const openDocument = (
    kind: Extract<AttachmentKind, "act" | "payment">,
    productName: string,
    items: DocumentAttachmentItem[]
  ) => {
    if (items.length === 0) return
    setViewer({
      title: attachmentViewerTitle(kind, productName),
      kind,
      documentItems: items,
    })
  }

  return (
    <>
      <Stack className="w-full min-w-0 gap-4 md:gap-6 lg:gap-10">
        {initialFilters.dropped.length > 0 ? (
          <p role="status" className="text-sm text-foreground">
            Не знайдено й пропущено: {initialFilters.dropped.join(", ")}
          </p>
        ) : null}

        <Stack className="gap-3 lg:hidden">
          <ReportFiltersPanel
            open={filtersOpen}
            onOpenChange={handleFiltersOpenChange}
            activeFilterCount={activeFilterCount}
            applyDisabled={applyDisabled}
            onApply={applyFilters}
            onCancel={cancelFilters}
            onClearAll={clearFilters}
          >
            <FilterField label="Найменування">
              <NameSearchFilter
                value={draftFilters.nameQuery}
                onChange={(nameQuery) =>
                  setDraftFilters((current) => ({ ...current, nameQuery }))
                }
              />
            </FilterField>
            <FilterField label="Дата видачі">
              <DateRangeFilter
                value={{ from: draftFilters.from, to: draftFilters.to }}
                onChange={({ from, to }) =>
                  setDraftFilters((current) => ({ ...current, from, to }))
                }
                reportingStart={ISSUANCE_EARLIEST_RECORD_DATE}
                reportingEnd={REPORTS_LAST_REFRESH_DATE}
                activeDates={calendarActiveDates}
                isDefaultPeriod={isDefaultIssuancePeriod(
                  draftFilters.from,
                  draftFilters.to
                )}
              />
            </FilterField>
            <FilterField label="Проєкт">
              <MultiSelectFilter
                options={ISSUANCE_PROJECT_OPTIONS}
                selected={draftFilters.projects}
                onChange={(projects) =>
                  setDraftFilters((current) => ({ ...current, projects }))
                }
                placeholder="Обрати проєкти"
                allSelectedLabel="Усі проєкти"
              />
            </FilterField>
            <FilterField label="Підрозділи">
              <MultiSelectFilter
                options={ISSUANCE_UNITS}
                selected={draftFilters.units}
                onChange={(units) =>
                  setDraftFilters((current) => ({ ...current, units }))
                }
                placeholder="Обрати підрозділи"
                allSelectedLabel="Усі підрозділи"
                searchable
                searchPlaceholder="Пошук підрозділу"
              />
            </FilterField>
          </ReportFiltersPanel>
        </Stack>

        <StickyFilterBar className="hidden lg:block">
          <div className={cn("gap-y-3", reportIssuanceFilterFieldsGridClass)}>
            <div className={reportIssuanceFilterHalfClass}>
              <FilterField label="Найменування">
                <NameSearchFilter
                  value={draftFilters.nameQuery}
                  onChange={(nameQuery) =>
                    setDraftFilters((current) => ({ ...current, nameQuery }))
                  }
                  onSubmit={applyDesktopFilters}
                />
              </FilterField>
              <FilterField label="Дата видачі">
                <DateRangeFilter
                  value={{ from: draftFilters.from, to: draftFilters.to }}
                  onChange={({ from, to }) =>
                    setDraftFilters((current) => ({ ...current, from, to }))
                  }
                  reportingStart={ISSUANCE_EARLIEST_RECORD_DATE}
                  reportingEnd={REPORTS_LAST_REFRESH_DATE}
                  activeDates={calendarActiveDates}
                  isDefaultPeriod={isDefaultIssuancePeriod(
                    draftFilters.from,
                    draftFilters.to
                  )}
                />
              </FilterField>
            </div>
            <div className={reportIssuanceFilterHalfWithApplyClass}>
              <FilterField label="Проєкт">
                <MultiSelectFilter
                  options={ISSUANCE_PROJECT_OPTIONS}
                  selected={draftFilters.projects}
                  onChange={(projects) =>
                    setDraftFilters((current) => ({ ...current, projects }))
                  }
                  placeholder="Обрати проєкти"
                  allSelectedLabel="Усі проєкти"
                />
              </FilterField>
              <FilterField label="Підрозділи">
                <MultiSelectFilter
                  options={ISSUANCE_UNITS}
                  selected={draftFilters.units}
                  onChange={(units) =>
                    setDraftFilters((current) => ({ ...current, units }))
                  }
                  placeholder="Обрати підрозділи"
                  allSelectedLabel="Усі підрозділи"
                  searchable
                  searchPlaceholder="Пошук підрозділу"
                />
              </FilterField>
              <FilterApplyButton
                className="shrink-0 self-end"
                disabled={applyDisabled}
                onClick={applyDesktopFilters}
              />
            </div>
            {activeFilterChips.length > 0 ? (
              <FilterChips
                chips={activeFilterChips}
                onRemove={removeFilterChip}
                onClear={clearFilters}
                clearLabel="Очистити всі"
                className="col-span-full"
              />
            ) : null}
          </div>
        </StickyFilterBar>

        <AppliedPeriodSummary
          from={appliedFilters.from}
          to={appliedFilters.to}
          visible={hasIssuanceFilterSelection(appliedFilters)}
        />

        <p
          className="sr-only"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {isLoading
            ? "Оновлюємо результати."
            : `Знайдено записів: ${filteredRows.length.toLocaleString("uk-UA")}.`}
        </p>

        <div className={cn(reportIssuanceDesktopGridClass, "hidden lg:grid")}>
          <IssuanceSnapshotSection
            bare
            rows={visibleRows}
            isLoading={isLoading}
            emptyMessage={emptyMessage}
          />
        </div>

        <IssuanceSnapshotSection
          rows={visibleRows}
          isLoading={isLoading}
          emptyMessage={emptyMessage}
          className="lg:hidden"
        />

        <Stack className="gap-3">
          {isLoading ? (
            <div
              role="status"
              aria-busy="true"
              className="text-foreground flex min-h-32 items-center justify-center rounded-[var(--radius-report)] border border-border bg-card p-8 text-sm"
            >
              Завантажуємо записи…
            </div>
          ) : pageRows.length === 0 ? (
            <EmptyReportState message={emptyMessage}>
              <FilterPopoverResetButton
                className="h-10 w-auto px-4"
                onClick={clearFilters}
              >
                Скинути всі фільтри
              </FilterPopoverResetButton>
            </EmptyReportState>
          ) : (
            <>
              <IssuanceTransactionsCompactTable
                rows={pageRows}
                onOpenMedia={openMedia}
                onOpenDocument={openDocument}
              />

              <div className="hidden lg:block">
                <ReportTable
                  tone="muted"
                  tableClassName={issuanceTableClassName}
                >
                  <colgroup>
                    {ISSUANCE_COLUMN_WIDTHS.map((width, index) => (
                      <col key={index} style={{ width }} />
                    ))}
                  </colgroup>
                  <ReportTableHeader className={issuanceHeaderDivider}>
                    <ReportTableHeaderRow>
                      <ReportTableHeadSortable
                        label="Дата"
                        sortDirection={
                          activeSortKey === "date" ? sortDir : null
                        }
                        onCycleSort={() => cycleSort("date")}
                        className={cn(
                          "max-w-[6.5rem] border-r border-[var(--report-border)] !px-1.5 md:!px-2",
                          issuanceHeadSortable
                        )}
                      />
                      <ReportTableHead
                        className={cn("!px-1.5 md:!px-2", issuanceHead)}
                      >
                        Найменування
                      </ReportTableHead>
                      <ReportTableHeadSortable
                        label="К-сть"
                        sortDirection={
                          activeSortKey === "quantity" ? sortDir : null
                        }
                        onCycleSort={() => cycleSort("quantity")}
                        align="right"
                        className={issuanceHeadQuantity}
                      />
                      <ReportTableHeadSortable
                        label="Вартість, ₴"
                        sortDirection={
                          activeSortKey === "unitPrice" ? sortDir : null
                        }
                        onCycleSort={() => cycleSort("unitPrice")}
                        align="right"
                        className={issuanceHeadUnitPrice}
                      />
                      <ReportTableHeadSortable
                        label="Сума, ₴"
                        sortDirection={
                          activeSortKey === "total" ? sortDir : null
                        }
                        onCycleSort={() => cycleSort("total")}
                        align="right"
                        className={issuanceHeadTotal}
                      />
                      <ReportTableHead className={issuanceHeadProject}>
                        Проєкт
                      </ReportTableHead>
                      <ReportTableHead
                        className={cn("!px-1.5 md:!px-2", issuanceHead)}
                      >
                        Кому передали
                      </ReportTableHead>
                      <ReportTableHead className={issuanceHeadAttachment}>
                        Фото/
                        <wbr />
                        відео
                      </ReportTableHead>
                      <ReportTableHead className={issuanceHeadAttachment}>
                        Акт
                      </ReportTableHead>
                      <ReportTableHead className={issuanceHeadAttachment}>
                        Платіж
                      </ReportTableHead>
                    </ReportTableHeaderRow>
                  </ReportTableHeader>
                  <ReportTableBody>
                    {pageRows.map((row, rowIndex) => {
                      const dateCell = dateCellPlacements.get(row.id)
                      const showDaySeparator =
                        dateCell?.isDayGroupStart &&
                        !(page === 1 && rowIndex === 0)
                      const dateGroupStriped =
                        dateGroupStripes[rowIndex] ?? false
                      const dateGroupRowClass = dateGroupStriped
                        ? issuanceRowStripeClass
                        : reportTableRowSurfaceClass
                      return (
                        <ReportTableRow
                          key={row.id}
                          striping="none"
                          className={cn(
                            issuanceBodyRow,
                            showDaySeparator && issuanceDayGroupStartRow,
                            dateGroupRowClass
                          )}
                        >
                          {dateCell?.show ? (
                            <ReportTableCell
                              rowSpan={
                                dateCell.rowSpan > 1
                                  ? dateCell.rowSpan
                                  : undefined
                              }
                              className={cn(
                                "!px-1.5 md:!px-2",
                                issuanceCellDate,
                                dateGroupRowClass
                              )}
                            >
                              {row.date}
                            </ReportTableCell>
                          ) : null}
                          <ReportTableCell
                            className={cn("!px-1.5 md:!px-2", issuanceCellWrap)}
                          >
                            {row.productName}
                          </ReportTableCell>
                          <ReportTableCell
                            className={cn(
                              "!px-1 text-right",
                              issuanceCellQuantity
                            )}
                          >
                            {row.quantity}
                          </ReportTableCell>
                          <ReportTableCell
                            className={cn(
                              "!px-1 text-right",
                              issuanceCellUnitPrice
                            )}
                          >
                            {formatReportNumber(row.unitPrice)}
                          </ReportTableCell>
                          <ReportTableCell
                            className={cn(
                              "!px-1.5 text-right md:!px-2",
                              issuanceCellTotal
                            )}
                          >
                            {formatReportNumber(row.total)}
                          </ReportTableCell>
                          <ReportTableCell className={issuanceCellProject}>
                            <FundraisingTag
                              name={row.project}
                              variant="colored"
                            />
                          </ReportTableCell>
                          <ReportTableCell
                            className={cn(
                              "!px-1.5 md:!px-2",
                              issuanceCellRecipient
                            )}
                          >
                            <RecipientCell value={row.recipient} />
                          </ReportTableCell>
                          <ReportTableCell className={issuanceCellAttachment}>
                            <AttachmentButton
                              label="Переглянути фото та відео передачі"
                              icon={ImagesIcon}
                              iconClassName="size-4"
                              compact
                              available={row.attachments.media.length > 0}
                              pending={row.pendingAttachments.media}
                              onClick={() =>
                                openMedia(
                                  row.productName,
                                  row.attachments.media
                                )
                              }
                            />
                          </ReportTableCell>
                          <ReportTableCell className={issuanceCellAttachment}>
                            <AttachmentButton
                              label="Переглянути акт видачі"
                              icon={FileTextIcon}
                              iconClassName="size-4"
                              compact
                              available={row.attachments.act.length > 0}
                              pending={row.pendingAttachments.act}
                              onClick={() =>
                                openDocument(
                                  "act",
                                  row.productName,
                                  row.attachments.act
                                )
                              }
                            />
                          </ReportTableCell>
                          <ReportTableCell className={issuanceCellAttachment}>
                            <AttachmentButton
                              label="Переглянути платіжний документ"
                              icon={ReceiptIcon}
                              iconClassName="size-4"
                              compact
                              available={row.attachments.payment.length > 0}
                              pending={row.pendingAttachments.payment}
                              onClick={() =>
                                openDocument(
                                  "payment",
                                  row.productName,
                                  row.attachments.payment
                                )
                              }
                            />
                          </ReportTableCell>
                        </ReportTableRow>
                      )
                    })}
                  </ReportTableBody>
                </ReportTable>
              </div>
            </>
          )}
          {!isLoading ? (
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
          ) : null}
        </Stack>
      </Stack>

      {viewer ? (
        <AttachmentViewer
          key={viewer.title}
          open
          onOpenChange={(open) => {
            if (!open) setViewer(null)
          }}
          title={viewer.title}
          mode={attachmentViewerMode(viewer.kind)}
          mediaItems={viewer.mediaItems}
          documentItems={viewer.documentItems}
        />
      ) : null}
    </>
  )
}
