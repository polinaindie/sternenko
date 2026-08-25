import * as React from "react"
import {
  DayPicker,
  getDefaultClassNames,
  type DayButton,
  type Locale,
} from "react-day-picker"

import { cn } from "@workspace/ui/lib/utils"
import { Button, buttonVariants } from "@workspace/ui/components/button"
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon } from "lucide-react"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  locale,
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "group/calendar bg-background p-2 [--cell-radius:var(--radius-md)] [--cell-size:--spacing(7)] in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      locale={locale}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString(locale?.code, { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "relative flex flex-col gap-4 md:flex-row",
          defaultClassNames.months
        ),
        month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) p-0 select-none aria-disabled:opacity-50",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) p-0 select-none aria-disabled:opacity-50",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-sm font-medium",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "relative rounded-(--cell-radius)",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "absolute inset-0 bg-popover opacity-0",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "font-medium select-none",
          captionLayout === "label"
            ? "text-sm"
            : "flex items-center gap-1 rounded-(--cell-radius) text-sm [&>svg]:size-3.5 [&>svg]:text-muted-foreground",
          defaultClassNames.caption_label
        ),
        month_grid: "w-full border-collapse",
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "flex-1 rounded-(--cell-radius) text-[0.8rem] font-normal text-muted-foreground select-none",
          defaultClassNames.weekday
        ),
        week: cn("mt-2 flex w-full", defaultClassNames.week),
        week_number_header: cn(
          "w-(--cell-size) select-none",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "text-[0.8rem] text-muted-foreground select-none",
          defaultClassNames.week_number
        ),
        day: cn(
          "group/day relative aspect-square h-full w-full rounded-none p-0 text-center select-none [&:last-child[data-selected=true]_button]:rounded-none",
          props.showWeekNumber
            ? "[&:nth-child(2)[data-selected=true]_button]:rounded-none"
            : "[&:first-child[data-selected=true]_button]:rounded-none",
          defaultClassNames.day
        ),
        range_start: cn(
          "relative isolate z-0 rounded-none bg-muted after:absolute after:inset-y-0 after:right-0 after:w-4 after:bg-muted",
          defaultClassNames.range_start
        ),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn(
          "relative isolate z-0 rounded-none bg-muted after:absolute after:inset-y-0 after:left-0 after:w-4 after:bg-muted",
          defaultClassNames.range_end
        ),
        today: cn(
          "rounded-none text-foreground data-[selected=true]:rounded-none",
          defaultClassNames.today
        ),
        outside: cn(
          "text-muted-foreground aria-selected:text-muted-foreground",
          defaultClassNames.outside
        ),
        disabled: cn(
          "text-muted-foreground opacity-50",
          defaultClassNames.disabled
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          )
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon className={cn("size-4", className)} {...props} />
            )
          }

          if (orientation === "right") {
            return (
              <ChevronRightIcon className={cn("size-4", className)} {...props} />
            )
          }

          return (
            <ChevronDownIcon className={cn("size-4", className)} {...props} />
          )
        },
        DayButton: ({ ...props }) => (
          <CalendarDayButton locale={locale} {...props} />
        ),
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-(--cell-size) items-center justify-center text-center">
                {children}
              </div>
            </td>
          )
        },
        ...components,
      }}
      {...props}
    />
  )
}

/**
 * Смуга, а не крапка: сусідні дні зливаються в один штрих, тож місяць читається
 * кількома лініями замість двох десятків окремих точок, що рябіли в очах.
 * Жовтий на світлій картці дає 1.39:1, тож там межу тримає контурна рамка;
 * на темній вона зайва — сам жовтий дає 10.9:1 (WCAG 1.4.11).
 */
const calendarActivityMarkClass =
  "activity-mark h-0.5 shrink-0 rounded-none bg-primary !opacity-100 ring-1 ring-foreground/70 dark:ring-0"

/** Смуга виходить із потоку, щоб число дня стояло на тій самій лінії, що й дні без даних. */
const calendarActivityMarkInCellClass =
  "pointer-events-none absolute inset-x-0 bottom-0"

/**
 * Сьогодні — контурна рамка, а не заливка: заливка збігалася з серединою
 * діапазону і день губився. На картці 3.87:1, на темній 5.7:1; коли день
 * потрапляє в межу діапазону, рамка переходить на primary-foreground —
 * 4.4:1 на жовтому (WCAG 1.4.11). Фокус лишається кільцем на 3px, тож
 * позначку сьогодні з ним не сплутати.
 */
const calendarTodayMarkClass =
  "outline-solid outline-1 -outline-offset-1 outline-foreground/60 data-[range-end=true]:outline-primary-foreground/70 data-[range-start=true]:outline-primary-foreground/70 data-[selected-single=true]:outline-primary-foreground/70"

function CalendarDayButton({
  className,
  day,
  modifiers,
  locale,
  ...props
}: React.ComponentProps<typeof DayButton> & { locale?: Partial<Locale> }) {
  const defaultClassNames = getDefaultClassNames()
  const hasData = Boolean(modifiers.has_data)
  const isToday = Boolean(modifiers.today)
  const boundaryDisabled = Boolean(modifiers.boundary_disabled)
  const fallbackLabel = day.date.toLocaleDateString(locale?.code ?? "uk-UA", {
    day: "numeric",
    month: "long",
  })
  const baseLabel = props["aria-label"] ?? fallbackLabel
  const accessibleLabel =
    isToday || hasData
      ? [baseLabel, isToday ? "сьогодні" : null, hasData ? "є закупівлі" : null]
          .filter(Boolean)
          .join(", ")
      : props["aria-label"]

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString(locale?.code)}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      data-has-data={hasData}
      className={cn(
        "relative isolate z-10 flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 rounded-none border-0 leading-none font-normal group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-[3px] group-data-[focused=true]/day:ring-ring/50 data-[range-end=true]:rounded-none data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-muted data-[range-middle=true]:text-foreground data-[range-start=true]:rounded-none data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[selected-single=true]:rounded-none data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground dark:hover:text-foreground [&[data-range-end=true]_.activity-mark]:bg-primary-foreground [&[data-range-end=true]_.activity-mark]:ring-0 [&[data-range-start=true]_.activity-mark]:bg-primary-foreground [&[data-range-start=true]_.activity-mark]:ring-0 [&[data-selected-single=true]_.activity-mark]:bg-primary-foreground [&[data-selected-single=true]_.activity-mark]:ring-0 [&>span]:text-xs [&>span]:opacity-70",
        isToday && calendarTodayMarkClass,
        boundaryDisabled &&
          "cursor-not-allowed text-muted-foreground opacity-50",
        defaultClassNames.day,
        className
      )}
      {...props}
      disabled={boundaryDisabled ? false : props.disabled}
      aria-disabled={boundaryDisabled || undefined}
      aria-label={accessibleLabel}
      onClick={(event) => {
        if (boundaryDisabled) {
          event.preventDefault()
          return
        }
        props.onClick?.(event)
      }}
      onKeyDown={(event) => {
        if (
          boundaryDisabled &&
          (event.key === "Enter" || event.key === " ")
        ) {
          event.preventDefault()
          return
        }
        props.onKeyDown?.(event)
      }}
    >
      {props.children}
      {hasData ? (
        <span
          aria-hidden="true"
          className={cn(
            calendarActivityMarkClass,
            calendarActivityMarkInCellClass
          )}
        />
      ) : null}
    </Button>
  )
}

export { Calendar, CalendarDayButton, calendarActivityMarkClass }
