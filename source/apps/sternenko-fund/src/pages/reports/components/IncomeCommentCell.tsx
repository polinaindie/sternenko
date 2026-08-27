import { cn } from "@workspace/ui/lib/utils"

import { EMPTY_TABLE_VALUE } from "../lib/empty-table-value"
import { formatIncomeCommentDisplay } from "../lib/income-comment-display"
import { reportTxCellCommentTone } from "./report-transaction-table-styles"

const commentTextClass = cn("text-sm", reportTxCellCommentTone)

type IncomeCommentCellProps = {
  comment: string | undefined
  className?: string
}

export function IncomeCommentCell({ comment, className }: IncomeCommentCellProps) {
  const display = formatIncomeCommentDisplay(comment)
  const hidden = display === EMPTY_TABLE_VALUE

  return (
    <span
      className={cn(
        commentTextClass,
        "min-w-0 whitespace-normal break-words leading-snug",
        className
      )}
      aria-label={hidden ? "Коментар відсутній" : `Коментар: ${display}`}
    >
      {display}
    </span>
  )
}
