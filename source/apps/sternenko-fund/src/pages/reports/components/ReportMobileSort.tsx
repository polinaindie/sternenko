import { useId } from "react"
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { cn } from "@workspace/ui/lib/utils"

import type { ReportSortDirection } from "@workspace/ui/components/report-table"

export type ReportMobileSortOption<T extends string> = {
  value: T
  label: string
}

type ReportMobileSortProps<T extends string> = {
  options: readonly ReportMobileSortOption<T>[]
  sortKey: T
  sortDirection: ReportSortDirection
  onSortKeyChange: (key: T) => void
  onSortDirectionToggle: () => void
  className?: string
  label?: string
}

export function ReportMobileSort<T extends string>({
  options,
  sortKey,
  sortDirection,
  onSortKeyChange,
  onSortDirectionToggle,
  className,
  label = "Сортування",
}: ReportMobileSortProps<T>) {
  const selectId = useId()
  const directionLabel =
    sortDirection === "asc"
      ? "Від найменшого до найбільшого"
      : "Від найбільшого до найменшого"

  return (
    <div
      className={cn(
        "flex min-w-0 flex-col gap-2 rounded-[var(--radius-report)] border border-[var(--report-border)] bg-[var(--report-surface)] p-3 lg:hidden",
        className
      )}
    >
      <label
        htmlFor={selectId}
        className="text-xs tracking-wide uppercase [font-family:var(--font-subheading-dark)]"
      >
        {label}
      </label>
      <div className="flex min-w-0 items-center gap-2">
        <Select
          value={sortKey}
          onValueChange={(value) => onSortKeyChange(value as T)}
        >
          <SelectTrigger
            id={selectId}
            className="bg-background h-10 min-h-6 min-w-0 flex-1"
            aria-label={`${label}: обрати стовпець`}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="max-w-[calc(100vw-2rem)]">
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-10 shrink-0"
          onClick={onSortDirectionToggle}
          aria-label={`${label}: ${directionLabel}`}
          aria-pressed={sortDirection === "desc"}
          title={directionLabel}
        >
          {sortDirection === "asc" ? (
            <ArrowUpIcon className="size-4" aria-hidden />
          ) : (
            <ArrowDownIcon className="size-4" aria-hidden />
          )}
        </Button>
      </div>
    </div>
  )
}
