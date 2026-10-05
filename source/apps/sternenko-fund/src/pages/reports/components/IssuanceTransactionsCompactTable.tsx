import { useMemo } from "react"
import { FileTextIcon, ImagesIcon, ReceiptIcon } from "lucide-react"

import { formatReportNumber } from "@workspace/ui/components/report-metric"
import { cn } from "@workspace/ui/lib/utils"

import type {
  AttachmentKind,
  DocumentAttachmentItem,
  TransferMediaItem,
} from "./AttachmentViewer"
import { FundraisingTag } from "./FundraisingTag"
import { AttachmentButton } from "./report-ui"
import { StickyDateHeader } from "./StickyDateHeader"
import {
  EMPTY_TABLE_VALUE,
  formatTableCellValue,
  isEmptyTableValue,
} from "../lib/empty-table-value"
import {
  groupIssuanceTransfers,
  mergeTransferAttachments,
  type IssuanceTransferGroup,
} from "../lib/issuance-transfers"
import type { IssuanceRow } from "../mock-data"

type IssuanceTransactionsCompactTableProps = {
  rows: IssuanceRow[]
  onOpenMedia: (productName: string, items: TransferMediaItem[]) => void
  onOpenDocument: (
    kind: Extract<AttachmentKind, "act" | "payment">,
    productName: string,
    items: DocumentAttachmentItem[]
  ) => void
}

/** ~93% mix — дрібні капси, ціль WCAG AA 4.5:1 на темному фоні. */
const metaLabelClass =
  "text-[0.6875rem] font-semibold tracking-[0.04em] text-[color-mix(in_oklch,var(--report-surface-foreground)_93%,transparent)] uppercase [font-family:var(--font-subheading-dark)]"

const secondaryTextClass =
  "text-xs text-[color-mix(in_oklch,var(--report-surface-foreground)_82%,transparent)]"

function groupRowsByDate(rows: IssuanceRow[]) {
  const groups: { date: string; rows: IssuanceRow[] }[] = []

  for (const row of rows) {
    const last = groups[groups.length - 1]
    if (last?.date === row.date) {
      last.rows.push(row)
    } else {
      groups.push({ date: row.date, rows: [row] })
    }
  }

  return groups
}

function RecipientCell({ value }: { value: string }) {
  if (isEmptyTableValue(value)) {
    return (
      <span aria-label="Одержувача не вказано">{EMPTY_TABLE_VALUE}</span>
    )
  }

  const lastComma = value.lastIndexOf(",")
  const unit = lastComma === -1 ? value : value.slice(0, lastComma).trim()
  const unitMatch = unit.match(/^(\d+)\s+([\s\S]*)$/)

  return (
    <span className="min-w-0 leading-snug text-[var(--report-surface-foreground)]">
      {unitMatch ? (
        <>
          <span className="font-medium">{unitMatch[1]}</span>{" "}
          <span className="whitespace-normal break-words">{unitMatch[2]}</span>
        </>
      ) : (
        <span className="whitespace-normal break-words">{unit}</span>
      )}
    </span>
  )
}

function CompactMetaRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <span className={metaLabelClass}>{label}</span>
      <div className="min-w-0 text-sm leading-snug">{children}</div>
    </div>
  )
}

function AttachmentTile({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "flex w-[4.25rem] min-w-0 flex-col items-center gap-1 rounded-[var(--radius-report)]",
        "bg-[color-mix(in_oklch,var(--report-surface-foreground)_10%,var(--card))]",
        "border border-[color-mix(in_oklch,var(--report-surface-foreground)_8%,transparent)]",
        "px-1.5 py-2",
        "[&_button]:size-10 [&_button]:text-[var(--report-surface-foreground)]",
        "[&_button]:hover:bg-[color-mix(in_oklch,var(--report-surface-foreground)_12%,transparent)]"
      )}
    >
      <div className="flex min-h-10 min-w-10 items-center justify-center [&_svg]:size-5">
        {children}
      </div>
      <span className={cn(metaLabelClass, "text-center text-[0.5625rem] leading-tight")}>
        {label}
      </span>
    </div>
  )
}

function AttachmentsColumn({
  productLabel,
  attachments,
  pending,
  onOpenMedia,
  onOpenDocument,
}: {
  productLabel: string
  attachments: IssuanceRow["attachments"]
  pending: IssuanceRow["pendingAttachments"]
  onOpenMedia: (productName: string, items: TransferMediaItem[]) => void
  onOpenDocument: (
    kind: Extract<AttachmentKind, "act" | "payment">,
    productName: string,
    items: DocumentAttachmentItem[]
  ) => void
}) {
  return (
    <div
      className="flex shrink-0 flex-col gap-1.5"
      aria-label="Вкладення"
    >
      <AttachmentTile label="Фото/відео">
        <AttachmentButton
          label="Переглянути фото та відео передачі"
          icon={ImagesIcon}
          iconClassName="size-5"
          available={attachments.media.length > 0}
          pending={pending.media}
          onClick={() => onOpenMedia(productLabel, attachments.media)}
        />
      </AttachmentTile>
      <AttachmentTile label="Акт">
        <AttachmentButton
          label="Переглянути акт видачі"
          icon={FileTextIcon}
          iconClassName="size-5"
          available={attachments.act.length > 0}
          pending={pending.act}
          onClick={() => onOpenDocument("act", productLabel, attachments.act)}
        />
      </AttachmentTile>
      <AttachmentTile label="Платіж">
        <AttachmentButton
          label="Переглянути платіжний документ"
          icon={ReceiptIcon}
          iconClassName="size-5"
          available={attachments.payment.length > 0}
          pending={pending.payment}
          onClick={() =>
            onOpenDocument("payment", productLabel, attachments.payment)
          }
        />
      </AttachmentTile>
    </div>
  )
}

function IssuanceCompactCard({
  group,
  onOpenMedia,
  onOpenDocument,
}: {
  group: IssuanceTransferGroup<IssuanceRow>
  onOpenMedia: (productName: string, items: TransferMediaItem[]) => void
  onOpenDocument: (
    kind: Extract<AttachmentKind, "act" | "payment">,
    productName: string,
    items: DocumentAttachmentItem[]
  ) => void
}) {
  const host = group.rows[0]!
  const merged = mergeTransferAttachments(group.rows)
  const productLabel = group.rows.map((row) => row.productName).join(", ")

  return (
    <article className="rounded-[var(--radius-report)] border border-[var(--report-border)] bg-[var(--card)] p-4 text-[var(--report-surface-foreground)]">
      <div className="flex min-w-0 flex-col">
        <div className="flex items-start gap-3">
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
              <ul className="flex min-w-0 flex-1 flex-col gap-2">
                {group.rows.map((row) => (
                  <li key={row.id} className="flex min-w-0 flex-col">
                    <p className="min-w-0 text-lg leading-snug font-semibold break-words text-[var(--report-surface-foreground)]">
                      {formatTableCellValue(row.productName)}
                    </p>
                    <p className={cn("mt-0.5 tabular-nums", secondaryTextClass)}>
                      {row.quantity} шт × {formatReportNumber(row.unitPrice)} ₴
                    </p>
                  </li>
                ))}
              </ul>
              <div className="min-w-0 sm:shrink-0 sm:text-right">
                <p className="text-2xl leading-tight font-bold tabular-nums text-[var(--report-surface-foreground)] sm:text-[1.625rem]">
                  {formatReportNumber(group.total)} ₴
                </p>
              </div>
            </div>

            <div className="flex min-w-0 flex-col gap-4">
              <CompactMetaRow label="Проєкт/збір">
                <FundraisingTag
                  name={host.project}
                  variant="colored"
                  className="inline-flex"
                />
              </CompactMetaRow>
              <CompactMetaRow label="Кому передали">
                <RecipientCell value={host.recipient} />
              </CompactMetaRow>
              <CompactMetaRow label="Призначення">
                <span className="leading-snug text-[var(--report-surface-foreground)]">
                  {formatTableCellValue(host.purpose)}
                </span>
              </CompactMetaRow>
            </div>
          </div>
          <AttachmentsColumn
            productLabel={productLabel}
            attachments={{
              media: merged.media,
              act: merged.act,
              payment: merged.payment,
            }}
            pending={merged.pending}
            onOpenMedia={onOpenMedia}
            onOpenDocument={onOpenDocument}
          />
        </div>
      </div>
    </article>
  )
}

/**
 * Компактне подання закупленого та виданого для mobile/tablet (< lg) —
 * групи по даті зі sticky-заголовком, кожна передача окремою карткою.
 */
export function IssuanceTransactionsCompactTable({
  rows,
  onOpenMedia,
  onOpenDocument,
}: IssuanceTransactionsCompactTableProps) {
  const dateGroups = useMemo(() => groupRowsByDate(rows), [rows])

  return (
    <div
      className="flex flex-col gap-4 pb-12 lg:hidden [--report-border:var(--border)] [--report-surface:var(--muted)] [--report-surface-foreground:var(--foreground)]"
      aria-label="Список закупленого та виданого майна"
    >
      {dateGroups.map((group) => {
        const transfers = groupIssuanceTransfers(group.rows)
        return (
          <section key={group.date} className="flex flex-col gap-3">
            <StickyDateHeader date={group.date} />
            <ul className="flex flex-col gap-3">
              {transfers.map((transfer) => (
                <li key={transfer.key} className="min-w-0">
                  <IssuanceCompactCard
                    group={transfer}
                    onOpenMedia={onOpenMedia}
                    onOpenDocument={onOpenDocument}
                  />
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
