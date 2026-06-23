import { useEffect, useMemo, useState } from "react"

import { formatReportNumber } from "@workspace/ui/components/report-metric"
import {
  ReportTable,
  ReportTableBody,
  ReportTableCell,
  ReportTableHead,
  ReportTableHeader,
  ReportTableHeaderRow,
  ReportTableRow,
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
import { FilterChips } from "../components/FilterChips"
import { FundraisingTag } from "../components/FundraisingTag"
import { ProjectTag } from "../components/ProjectTag"
import { IssuanceSnapshotSection } from "../components/IssuanceSnapshotSection"
import { MultiSelectFilter } from "../components/MultiSelectFilter"
import { NameSearchFilter } from "../components/NameSearchFilter"
import { EmptyReportState, ReportPagination } from "../components/ReportPagination"
import {
  AttachmentButton,
  FilterApplyButton,
  FilterField,
  FilterRow,
} from "../components/report-ui"
import {
  TransferActIcon,
  TransferMediaIcon,
  TransferPaymentIcon,
} from "../components/transfer-attachment-icons"
import {
  buildIssuanceFilterChips,
  createDefaultIssuanceFilters,
  filterIssuanceRows,
  removeIssuanceFilterChip,
  type IssuanceFilterChip,
} from "../lib/issuance-analytics"
import { formatPeriodLabel } from "../lib/income-analytics"
import {
  FUNDRAISINGS,
  ISSUANCE_PROPERTY_CATEGORIES,
  ISSUANCE_ROWS,
  ISSUANCE_UNITS,
} from "../mock-data"

/** Заголовки з фіксованим одним рядком; «Найменування» та «Збір» можуть ламатися. */
const issuanceHeadNowrap = "!whitespace-nowrap overflow-hidden"
const issuanceHeadWrap =
  "!h-auto min-h-11 !whitespace-normal break-words py-2 leading-tight"

const issuanceCellNowrap = "!whitespace-nowrap overflow-hidden"
const issuanceCellWrap = "min-w-0 whitespace-normal break-words"
const issuanceCellRecipient = "min-w-0 max-w-0"
const issuanceCellRecipientText =
  "line-clamp-2 whitespace-normal break-words leading-snug"

/** Фіксовані ширини стовпців (px) — стабільна сітка; на вузьких екранах таблиця скролиться. */
const ISSUANCE_COLUMNS = [
  92, // Дата
  150, // Найменування
  68, // К-сть
  112, // Вартість
  104, // Сума
  108, // Проєкт
  132, // Збір
  212, // Кому передали
  96, // Фото/відео
  52, // Акт
  88, // Платіж
] as const

const issuanceTableClassName =
  "w-full min-w-[1214px] table-fixed border-collapse"

type ViewerState = {
  title: string
  kind: AttachmentKind
  mediaItems?: TransferMediaItem[]
  documentItems?: DocumentAttachmentItem[]
}

export function IssuanceTab() {
  const [draftFilters, setDraftFilters] = useState(createDefaultIssuanceFilters)
  const [appliedFilters, setAppliedFilters] = useState(createDefaultIssuanceFilters)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(15)
  const [viewer, setViewer] = useState<ViewerState | null>(null)

  const filteredRows = useMemo(
    () => filterIssuanceRows(ISSUANCE_ROWS, appliedFilters),
    [appliedFilters]
  )

  const activeFilterChips = useMemo(
    () => buildIssuanceFilterChips(appliedFilters),
    [appliedFilters]
  )

  const periodLabel = useMemo(
    () => formatPeriodLabel(appliedFilters.from, appliedFilters.to),
    [appliedFilters.from, appliedFilters.to]
  )

  useEffect(() => {
    setPage(1)
  }, [appliedFilters])

  const pageRows = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredRows.slice(start, start + pageSize)
  }, [filteredRows, page, pageSize])

  const applyFilters = () => {
    setAppliedFilters(draftFilters)
    setPage(1)
  }

  const clearFilters = () => {
    const defaults = createDefaultIssuanceFilters()
    setDraftFilters(defaults)
    setAppliedFilters(defaults)
    setPage(1)
  }

  const removeFilterChip = (chip: IssuanceFilterChip) => {
    const next = removeIssuanceFilterChip(appliedFilters, chip)
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
      <Stack className="w-full min-w-0 gap-10">
        <Stack className="gap-3">
          <FilterRow className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[repeat(5,minmax(0,1fr))_auto] lg:items-end">
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
            <FilterField label="Підрозділи">
              <MultiSelectFilter
                options={ISSUANCE_UNITS}
                selected={draftFilters.units}
                onChange={(units) =>
                  setDraftFilters((current) => ({ ...current, units }))
                }
                placeholder="Усі"
              />
            </FilterField>
            <FilterField label="Категорія майна">
              <MultiSelectFilter
                options={ISSUANCE_PROPERTY_CATEGORIES}
                selected={draftFilters.categories}
                onChange={(categories) =>
                  setDraftFilters((current) => ({ ...current, categories }))
                }
                placeholder="Усі"
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

        <IssuanceSnapshotSection rows={filteredRows} periodLabel={periodLabel} />

        <Stack className="gap-3">
          {pageRows.length === 0 ? (
            <EmptyReportState message="За обраними фільтрами записів не знайдено." />
          ) : (
            <ReportTable
              tableClassName={issuanceTableClassName}
              containerClassName="overflow-x-auto"
            >
              <colgroup>
                {ISSUANCE_COLUMNS.map((width, index) => (
                  <col key={index} style={{ width }} />
                ))}
              </colgroup>
              <ReportTableHeader>
                <ReportTableHeaderRow>
                  <ReportTableHead className={cn("!px-2", issuanceHeadNowrap)}>Дата</ReportTableHead>
                  <ReportTableHead className={cn("!px-2", issuanceHeadWrap)}>
                    Найменування
                  </ReportTableHead>
                  <ReportTableHead className={cn("!px-2 text-right", issuanceHeadNowrap)}>
                    К-сть
                  </ReportTableHead>
                  <ReportTableHead className={cn("!px-2 text-right", issuanceHeadNowrap)}>
                    Вартість, ₴
                  </ReportTableHead>
                  <ReportTableHead className={cn("!px-2 text-right", issuanceHeadNowrap)}>
                    Сума, ₴
                  </ReportTableHead>
                  <ReportTableHead className={cn("!px-2", issuanceHeadWrap)}>Проєкт</ReportTableHead>
                  <ReportTableHead className={cn("!px-2", issuanceHeadWrap)}>Збір</ReportTableHead>
                  <ReportTableHead className={cn("!px-2", issuanceHeadNowrap)}>
                    Кому передали
                  </ReportTableHead>
                  <ReportTableHead className={cn("!px-2 text-center", issuanceHeadNowrap)}>
                    Фото/відео
                  </ReportTableHead>
                  <ReportTableHead className={cn("!px-2 text-center", issuanceHeadNowrap)}>
                    Акт
                  </ReportTableHead>
                  <ReportTableHead className={cn("!px-2 text-center", issuanceHeadNowrap)}>
                    Платіж
                  </ReportTableHead>
                </ReportTableHeaderRow>
              </ReportTableHeader>
              <ReportTableBody>
                {pageRows.map((row) => (
                  <ReportTableRow key={row.id}>
                    <ReportTableCell className={cn("!px-2 tabular-nums", issuanceCellNowrap)}>
                      {row.date}
                    </ReportTableCell>
                    <ReportTableCell className={cn("!px-2", issuanceCellWrap)}>
                      {row.productName}
                    </ReportTableCell>
                    <ReportTableCell className={cn("!px-2 text-right tabular-nums", issuanceCellNowrap)}>
                      {row.quantity}
                    </ReportTableCell>
                    <ReportTableCell className={cn("!px-2 text-right tabular-nums", issuanceCellNowrap)}>
                      {formatReportNumber(row.unitPrice)}
                    </ReportTableCell>
                    <ReportTableCell className={cn("!px-2 text-right tabular-nums", issuanceCellNowrap)}>
                      {formatReportNumber(row.total)}
                    </ReportTableCell>
                    <ReportTableCell className={cn("!px-2", issuanceCellWrap)}>
                      <ProjectTag name={row.project} />
                    </ReportTableCell>
                    <ReportTableCell className={cn("!px-2", issuanceCellWrap)}>
                      <FundraisingTag name={row.fundraising} />
                    </ReportTableCell>
                    <ReportTableCell
                      className={cn("!px-2", issuanceCellRecipient)}
                      title={row.recipient}
                    >
                      <span className={issuanceCellRecipientText}>{row.recipient}</span>
                    </ReportTableCell>
                    <ReportTableCell className="!px-2 text-center">
                      <AttachmentButton
                        label="Переглянути фото та відео передачі"
                        icon={TransferMediaIcon}
                        available={row.attachments.media.length > 0}
                        onClick={() => openMedia(row.productName, row.attachments.media)}
                      />
                    </ReportTableCell>
                    <ReportTableCell className="!px-2 text-center">
                      <AttachmentButton
                        label="Переглянути акт видачі"
                        icon={TransferActIcon}
                        available={row.attachments.act.length > 0}
                        onClick={() =>
                          openDocument("act", row.productName, row.attachments.act)
                        }
                      />
                    </ReportTableCell>
                    <ReportTableCell className="!px-2 text-center">
                      <AttachmentButton
                        label="Переглянути платіжний документ"
                        icon={TransferPaymentIcon}
                        available={row.attachments.payment.length > 0}
                        onClick={() =>
                          openDocument("payment", row.productName, row.attachments.payment)
                        }
                      />
                    </ReportTableCell>
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
