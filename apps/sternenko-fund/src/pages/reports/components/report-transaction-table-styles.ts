import { cn } from "@workspace/ui/lib/utils"

/** Заголовки — один рядок, повна назва стовпця (типографіка — reportTableHeadClass). */
export const reportTxHead =
  "!h-auto min-h-11 !whitespace-nowrap !overflow-visible py-2 leading-tight"

export const reportTxHeadSortable = cn(
  reportTxHead,
  "[&_span]:shrink-0 [&_span]:whitespace-nowrap"
)

/** На th, бо border-0 на tr у ReportTableHeader приховує нижню лінію рядка. */
export const reportTxHeaderDivider =
  "[&_th]:border-b [&_th]:border-b-[var(--report-border)]"

/** Рядки: мін-висота, вміст зверху. */
export const reportTxBodyRow = "[&>td]:h-[3.25rem] [&>td]:!align-top"

export const reportTxCellWrap = "min-w-0 whitespace-normal break-words"

export const reportTxCellPadding = "!px-1.5 md:!px-2"

export const reportTxTableClassName = "w-full table-fixed border-collapse"

/** М'яка зебра — менший контраст до базового фону. */
export const reportTxRowStripeClass =
  "bg-[color-mix(in_oklch,var(--report-surface-foreground)_3.5%,var(--report-surface))] hover:bg-[color-mix(in_oklch,var(--report-surface-foreground)_3.5%,var(--report-surface))]"

/** Середній сірий — коментар, дата, валюта. `!` перебиває reportTableCellClass. */
export const reportTxCellCommentTone =
  "!text-[color-mix(in_oklch,var(--report-surface-foreground)_58%,transparent)]"

export const reportTxCellAmountMuted =
  "whitespace-nowrap text-right tabular-nums text-[color-mix(in_oklch,var(--report-surface-foreground)_72%,transparent)]"

/** Світлий акцент для суми в рядку. */
export const reportTxCellAmountLight =
  "!whitespace-nowrap !text-right tabular-nums !text-[var(--report-surface-foreground)]"

export const reportTxCellAmountStrong =
  "whitespace-nowrap text-right tabular-nums font-medium !text-[var(--report-surface-foreground)]"

/** Стовпець «Проєкт/збір». */
export const reportTxProjectColWidth = "calc(9ch + 1.5rem)"

export const reportTxHeadProject = cn(
  reportTxHead,
  "px-1.5 md:px-2 max-w-[calc(9ch+1.5rem)]"
)

export const reportTxCellProject =
  "min-w-0 max-w-[calc(9ch+1.5rem)] overflow-hidden px-1.5 md:px-2 leading-snug"
