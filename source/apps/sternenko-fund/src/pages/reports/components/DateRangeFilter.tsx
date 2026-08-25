import { useEffect, useMemo, useState } from "react"
import { uk } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import type { DateRange as DayPickerDateRange } from "react-day-picker"

import { Button } from "@workspace/ui/components/button"
import {
  Calendar,
  calendarActivityMarkClass,
} from "@workspace/ui/components/calendar"
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
  /** ISO dates returned alongside the applied result. */
  activeDates?: readonly string[]
}

export function DateRangeFilter({
  value,
  onChange,
  id,
  reportingStart = INCOME_REPORTING_START,
  reportingEnd = INCOME_REPORTING_END,
  isDefaultPeriod = false,
  activeDates,
}: DateRangeFilterProps) {
  const controlId = useFilterControlId(id)
  const [open, setOpen] = useState(false)
  const [visibleMonth, setVisibleMonth] = useState(() => value.from)
  const [calendarRange, setCalendarRange] = useState<DayPickerDateRange>()
  const activeDateValues = useMemo(
    () =>
      (activeDates ?? []).map((isoDate) => {
        const [year, month, day] = isoDate.split("-").map(Number)
        return new Date(year!, month! - 1, day!)
      }),
    [activeDates]
  )

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
          <CalendarIcon
            className="size-4 shrink-0 opacity-60"
            aria-hidden="true"
          />
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
            locale={uk}
            captionLayout="dropdown"
            fromYear={reportingStart.getFullYear()}
            toYear={reportingEnd.getFullYear()}
            modifiers={{
              has_data: activeDateValues,
              boundary_disabled: [
                { before: reportingStart },
                { after: reportingEnd },
              ],
            }}
            classNames={{ root: "w-full min-w-0" }}
          />

          <div className="flex w-full flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="border-foreground/50 dark:border-foreground/40 min-w-0 flex-1 rounded-none"
              onClick={selectVisibleMonth}
            >
              За обраний місяць
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="border-foreground/50 dark:border-foreground/40 min-w-0 flex-1 rounded-none"
              onClick={selectVisibleYear}
            >
              За обраний рік
            </Button>
          </div>

          {activeDates ? (
            <p className="text-foreground/70 flex items-start gap-2 pt-1 text-xs leading-snug">
              <span
                aria-hidden="true"
                className={cn(calendarActivityMarkClass, "mt-2 w-3")}
              />
              <span>Є дані про закупівлі за обраними параметрами</span>
            </p>
          ) : null}
        </div>
      </PopoverContent>
    </Popover>
  )
}
