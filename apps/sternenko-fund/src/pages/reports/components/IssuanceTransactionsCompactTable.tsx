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
        "[&_button]:hover:bg-[color-mix(in_oklch,var(--report-surface-foreground)_12%,transparent)]",
        "[&_span[aria-hidden]]:text-[color-mix(in_oklch,var(--report-surface-foreground)_45%,transparent)]"
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
  row,
  onOpenMedia,
  onOpenDocument,
}: {
  row: IssuanceRow
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
          available={row.attachments.media.length > 0}
          onClick={() => onOpenMedia(row.productName, row.attachments.media)}
        />
      </AttachmentTile>
      <AttachmentTile label="Акт">
        <AttachmentButton
          label="Переглянути акт видачі"
          icon={FileTextIcon}
          iconClassName="size-5"
          available={row.attachments.act.length > 0}
          onClick={() => onOpenDocument("act", row.productName, row.attachments.act)}
        />
      </AttachmentTile>
      <AttachmentTile label="Платіж">
        <AttachmentButton
          label="Переглянути платіжний документ"
          icon={ReceiptIcon}
          iconClassName="size-5"
          available={row.attachments.payment.length > 0}
          onClick={() =>
            onOpenDocument("payment", row.productName, row.attachments.payment)
          }
        />
      </AttachmentTile>
    </div>
  )
}

function AmountBlock({ row }: { row: IssuanceRow }) {
  return (
    <div className="min-w-0">
      <p className="text-2xl leading-tight font-bold tabular-nums text-[var(--report-surface-foreground)] sm:text-[1.625rem]">
        {formatReportNumber(row.total)} ₴
      </p>
      <p className={cn("mt-1 tabular-nums", secondaryTextClass)}>
        {row.quantity} шт × {formatReportNumber(row.unitPrice)} ₴
      </p>
    </div>
  )
}

function IssuanceCompactCard({
  row,
  onOpenMedia,
  onOpenDocument,
}: {
  row: IssuanceRow
  onOpenMedia: (productName: string, items: TransferMediaItem[]) => void
  onOpenDocument: (
    kind: Extract<AttachmentKind, "act" | "payment">,
    productName: string,
    items: DocumentAttachmentItem[]
  ) => void
}) {
  return (
    <article className="rounded-[var(--radius-report)] border border-[var(--report-border)] bg-[var(--card)] p-4 text-[var(--report-surface-foreground)]">
      <div className="flex min-w-0 flex-col">
        {/* Назва + сума зліва, вкладення стовпчиком справа */}
        <div className="flex items-start gap-3">
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
              <p className="min-w-0 text-lg leading-snug font-semibold break-words text-[var(--report-surface-foreground)]">
                {row.productName}
              </p>
              <div className="min-w-0 sm:shrink-0 sm:text-right">
                <AmountBlock row={row} />
              </div>
            </div>

            <div className="flex min-w-0 flex-col gap-4">
              <CompactMetaRow label="Проєкт/збір">
                <FundraisingTag
                  name={row.project}
                  variant="colored"
                  className="inline-flex"
                />
              </CompactMetaRow>
              <CompactMetaRow label="Кому передали">
                <RecipientCell value={row.recipient} />
              </CompactMetaRow>
            </div>
          </div>
          <AttachmentsColumn
            row={row}
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
 * групи по даті зі sticky-заголовком, кожен товар окремою карткою.
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
      {dateGroups.map((group) => (
        <section key={group.date} className="flex flex-col gap-3">
          <StickyDateHeader date={group.date} />
          <ul className="flex flex-col gap-3">
            {group.rows.map((row) => (
              <li key={row.id} className="min-w-0">
                <IssuanceCompactCard
                  row={row}
                  onOpenMedia={onOpenMedia}
                  onOpenDocument={onOpenDocument}
                />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
