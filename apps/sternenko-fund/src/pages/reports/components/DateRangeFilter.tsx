import { useEffect, useState } from "react"
import { CalendarIcon } from "lucide-react"
import type { DateRange as DayPickerDateRange } from "react-day-picker"

import { Button } from "@workspace/ui/components/button"
import { Calendar } from "@workspace/ui/components/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover"
import { cn } from "@workspace/ui/lib/utils"

import {
  INCOME_REPORTING_END,
  INCOME_REPORTING_START,
} from "../data/income-transactions"
import {
  clampReportingRange,
  formatPeriodLabel,
  monthRange,
  yearRange,
} from "../lib/income-analytics"
import {
  filterPopoverContentClass,
  siteFilterTriggerActiveClass,
  siteFilterTriggerClass,
  useFilterControlId,
} from "./report-ui"

type DateRange = { from: Date; to: Date }

type DateRangeFilterProps = {
  value: DateRange
  onChange: (value: DateRange) => void
  id?: string
  reportingStart?: Date
  reportingEnd?: Date
  /** Повний період з імпортованого документа — сірий підпис, вужчий вибір — білий. */
  isDefaultPeriod?: boolean
}

export function DateRangeFilter({
  value,
  onChange,
  id,
  reportingStart = INCOME_REPORTING_START,
  reportingEnd = INCOME_REPORTING_END,
  isDefaultPeriod = false,
}: DateRangeFilterProps) {
  const controlId = useFilterControlId(id)
  const [open, setOpen] = useState(false)
  const [visibleMonth, setVisibleMonth] = useState(() => value.from)
  const [calendarRange, setCalendarRange] = useState<DayPickerDateRange>()

  const clampToReporting = (from: Date, to: Date) =>
    clampReportingRange(from, to, reportingStart, reportingEnd)

  useEffect(() => {
    if (!open) return
    setVisibleMonth(value.from)
    setCalendarRange({ from: value.from, to: value.to })
    // Sync only when the popover opens, not while the user is picking dates.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const handleSelect = (range: DayPickerDateRange | undefined) => {
    if (!range?.from) {
      setCalendarRange(undefined)
      return
    }

    setCalendarRange(range)

    if (!range.to) {
      onChange(clampToReporting(range.from, range.from))
      return
    }

    onChange(clampToReporting(range.from, range.to))
    setOpen(false)
  }

  const selectVisibleMonth = () => {
    const year = visibleMonth.getFullYear()
    const month = visibleMonth.getMonth()
    const next = monthRange(year, month)
    onChange(clampToReporting(next.from, next.to))
    setOpen(false)
  }

  const selectVisibleYear = () => {
    const next = yearRange(visibleMonth.getFullYear())
    onChange(clampToReporting(next.from, next.to))
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={controlId}
          type="button"
          variant="outline"
          className={cn(
            siteFilterTriggerClass,
            "justify-start text-left",
            !isDefaultPeriod && siteFilterTriggerActiveClass
          )}
        >
          <CalendarIcon className="size-4 shrink-0 opacity-60" />
          <span className="truncate">{formatPeriodLabel(value.from, value.to)}</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className={cn(filterPopoverContentClass, "p-3")} align="start">
        <div className="flex w-full min-w-0 flex-col gap-3">
          <Calendar
            mode="range"
            resetOnSelect
            selected={calendarRange}
            onSelect={handleSelect}
            month={visibleMonth}
            onMonthChange={setVisibleMonth}
            captionLayout="dropdown"
            fromYear={reportingStart.getFullYear()}
            toYear={reportingEnd.getFullYear()}
            disabled={{
              before: reportingStart,
              after: reportingEnd,
            }}
            classNames={{ root: "w-full min-w-0" }}
          />

          <div className="flex w-full flex-wrap gap-2">
            <Button type="button" size="sm" variant="secondary" className="min-w-0 flex-1" onClick={selectVisibleMonth}>
              За обраний місяць
            </Button>
            <Button type="button" size="sm" variant="secondary" className="min-w-0 flex-1" onClick={selectVisibleYear}>
              За обраний рік
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
