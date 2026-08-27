import { cn } from "@workspace/ui/lib/utils"

import { formatReportDateShort } from "../lib/income-analytics"

type AppliedPeriodSummaryProps = {
  from: Date
  to: Date
  /** Показувати лише після застосованого фільтра. */
  visible: boolean
  className?: string
}

/**
 * Мобайл і планшет: замість чіпсів — підпис, за який період показано дані.
 * На великих екранах чіпси лишаються в панелі фільтрів.
 */
export function AppliedPeriodSummary({
  from,
  to,
  visible,
  className,
}: AppliedPeriodSummaryProps) {
  if (!visible) return null

  return (
    <p
      className={cn(
        "lg:hidden text-sm leading-snug text-foreground",
        className
      )}
    >
      <span className="block text-foreground/70">
        Дані відображені за вибраний період:
      </span>
      <span className="block tabular-nums">
        Від {formatReportDateShort(from)} До {formatReportDateShort(to)}
      </span>
    </p>
  )
}
